use std::collections::VecDeque;
use midiparser::song::{Song, Track};
use crate::matrix::Matrix;
use crate::rnn::RNN;
use crate::vector::Vector;

#[derive(Clone, PartialEq)]
pub struct NotesRNN {
    rnn: RNN,
}

impl NotesRNN {
    pub fn new(hidden_size: usize) -> NotesRNN {
        let nr_of_possible_notes: usize = 88;
        NotesRNN {
            rnn: RNN::new(nr_of_possible_notes, hidden_size, nr_of_possible_notes)
        }
    }

    pub fn gen_notes(&self, input_notes: Vec<f32>, nr_of_gen_notes: usize) -> Vec<f32> {
        let mut output_notes: Vec<f32> = vec![0.0; nr_of_gen_notes];
        let window_width: usize = 10;
        let mut window: VecDeque<f32> = VecDeque::with_capacity(window_width);
        window.extend(input_notes[0..window_width].iter());
        for i in 0..nr_of_gen_notes {
            let input_matrix: Matrix = self.create_input_matrix(window.clone());
            let (prediction_vector, _): (Vector, Matrix) = self.rnn.forward(input_matrix);
            let predicted_note: f32 = self.id_to_note_value(prediction_vector.arg_max());
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
            let first_track: Track = song.tracks[track_nr - 1].clone();
            let notes: Vec<f32> = first_track.notes.clone();
            let mut window: VecDeque<f32> = VecDeque::with_capacity(window_width);
            window.extend(notes[0..window_width].iter());
            let mut label_index: usize = window_width;
            let mut label = notes[label_index];
            let nr_of_possible_labels: usize = notes.len() - window_width;
            for current_window_and_label_pair in 1..nr_of_possible_labels {
                let target: usize = self.note_value_to_id(label);
                total_nr_of_sequences += 1.0;
                let input_matrix: Matrix = self.create_input_matrix(window.clone());
                let (output, last_hs): (Vector, Matrix) = self.rnn.forward(input_matrix.clone());
                let probs: Vector = output.softmax();
                let mut pd_L_pd_y: Vector = probs.clone();
                pd_L_pd_y[target] -= 1.0;
                self.rnn.backward(input_matrix.clone(), pd_L_pd_y, last_hs, learn_rate);
                total_loss -= probs[target].ln();
                window.pop_front();
                window.push_back(label);
                label_index += 1;
                label = notes[label_index];
            }
        }
        let average_loss: f32 = total_loss / total_nr_of_sequences;
        average_loss
    }

    fn create_input_matrix(&self, notes_sequence: VecDeque<f32>) -> Matrix {
        let first_note_value: f32 = 21.0;
        let nr_of_possible_notes: usize = 88;
        let mut inputs_vec: Vec<Vec<f32>> = vec![];
        for note_val in notes_sequence {
            let mut note_vec: Vec<f32> = vec![0.0; nr_of_possible_notes];
            let target: usize = (note_val - first_note_value) as usize;
            note_vec[target] = 1.0;
            inputs_vec.push(note_vec);
        }
        Matrix::from_vecs(inputs_vec)
    }

    fn note_value_to_id(&self, note_value: f32) -> usize {
        (note_value - 21.0) as usize
    }

    fn id_to_note_value(&self, id: usize) -> f32 {
        (id + 21) as f32
    }
}