use linear_algebra::{Vector, Matrix};
use crate::rnn::RNN;
use midiparser::song::{Song, Track};
use std::collections::VecDeque;
use serde::{Serialize, Deserialize};

const NR_OF_POSSIBLE_NOTES: usize = 88;

#[derive(Clone, PartialEq, Serialize, Deserialize)]
pub struct NotesRNN {
    rnn: RNN
}

impl NotesRNN {
    pub fn new(hidden_size: usize) -> NotesRNN {
        NotesRNN {
            rnn: RNN::new(NR_OF_POSSIBLE_NOTES, hidden_size, NR_OF_POSSIBLE_NOTES)
        }
    }

    pub fn from_weights_biases_file() -> NotesRNN {
        let to_return = NotesRNN {
            rnn: RNN::from_weight_bias_file()
        }; 
        println!("{:?}", to_return.rnn);
        to_return
    }

    pub fn gen_notes(&self, input_notes: Vec<f32>, nr_of_gen_notes: usize) -> Vec<f32> {
        let mut output_notes: Vec<f32> = vec![0.0; nr_of_gen_notes];
        let window_width: usize = 10;
        let mut window: VecDeque<f32> = VecDeque::with_capacity(window_width);
        window.extend(input_notes[0..window_width].iter());

        for i in 0..nr_of_gen_notes {
            // println!("generating {}", i);
            println!("{:?}", window);
            let input_matrix: Matrix = self.create_input_matrix(&window);
            // println!("input {:?}", input_matrix);

            let (prediction_vector, _): (Vector, Matrix) = self.rnn.forward(&input_matrix);
            // println!("prediction {:?}", prediction_vector);
            
            let probs: Vector = prediction_vector.softmax();
            // println!("probs {:?}", probs);

            let predicted_note_id: usize = probs.arg_max();
            let predicted_note: f32 = self.id_to_note_value(predicted_note_id);
            output_notes[i] = predicted_note;
            window.pop_front();
            window.push_back(predicted_note);
        }
        output_notes
    }

    pub fn train(&mut self, data: Vec<Song>, track_nr: usize, learn_rate: f32) -> f32 {
        let window_width: usize = 10;
        let mut total_loss: f32 = 0.0;
        let mut total_nr_of_sequences: f32 = 0.0;

        for song in data {
            let first_track: &Track = &song.tracks[track_nr - 1];
            let notes: &Vec<f32> = &first_track.notes;
            let mut window: VecDeque<f32> = VecDeque::with_capacity(window_width);
            window.extend(notes[0..window_width].iter());
            let mut label_index: usize = window_width;
            let mut label: f32 = notes[label_index];
            let nr_of_possible_labels: usize = notes.len() - window_width;

            for _ in 1..nr_of_possible_labels {
                let target: usize = self.note_value_to_id(label);
                total_nr_of_sequences += 1.0;
                let input_matrix: Matrix = self.create_input_matrix(&window);
                let (output, last_hs): (Vector, Matrix) = self.rnn.forward(&input_matrix);
                let probs: Vector = output.softmax();
                let mut pd_l_pd_y: Vector = probs.clone();
                pd_l_pd_y[target] -= 1.0;
                self.rnn.backward(&input_matrix, pd_l_pd_y, last_hs, learn_rate);
                total_loss -= probs[target].ln();
                window.pop_front();
                window.push_back(label);
                label_index += 1;
                label = notes[label_index];
            }
            self.save_weights_biases_to_file();
        }
        let average_loss: f32 = total_loss / total_nr_of_sequences;
        average_loss
    }

    fn create_input_matrix(&self, notes_sequence: &VecDeque<f32>) -> Matrix {
        let mut inputs_vec: Vec<Vec<f32>> = vec![];

        for note_value in notes_sequence {
            let mut note_vec: Vec<f32> = vec![0.0; NR_OF_POSSIBLE_NOTES];
            let target: usize = self.note_value_to_id(*note_value);
            note_vec[target] = 1.0;
            inputs_vec.push(note_vec);
        }
        Matrix::from_vecs(inputs_vec)
    }

    fn note_value_to_id(&self, note_value: f32) -> usize {
        (note_value - 21.0).clamp(0.0, 87.0) as usize
    }

    fn id_to_note_value(&self, id: usize) -> f32 {
        (id + 21) as f32
    }

    pub fn save_weights_biases_to_file(&self) {
        self.rnn.save_weights_biases_to_file("serde_weights".to_string());
        println!("Weight and biases saved.");
    }
}
