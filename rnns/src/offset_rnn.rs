use linear_algebra::{Vector, Matrix};
use crate::rnn::RNN;
use midiparser::song::{Song, Track};
use std::collections::VecDeque;
use serde::{Serialize, Deserialize};

const NR_OF_POSSIBLE_OFFSETS: usize = 1001;

const SERDE_WEIGHTS_FILE: &str = include_str!("../serde_weights");

#[derive(Clone, PartialEq, Serialize, Deserialize)]
pub struct OffsetRNN {
    rnn: RNN
}

impl OffsetRNN {
    pub fn new(hidden_size: usize, weights_biases_file_path: String) -> OffsetRNN {
        OffsetRNN {
            rnn: RNN::new(NR_OF_POSSIBLE_OFFSETS, hidden_size, NR_OF_POSSIBLE_OFFSETS)
        }
    }

    pub fn from_weights_biases_file() -> OffsetRNN {
        OffsetRNN {
            rnn: RNN::from_weight_bias_file()        
        }
    }

    pub fn gen_offsets(&self, input_offsets: Vec<f32>, nr_of_gen_offsets: usize) -> Vec<f32> {
        let mut output_offsets: Vec<f32> = vec![0.0; nr_of_gen_offsets];
        let window_width: usize = 10;
        let mut window: VecDeque<f32> = VecDeque::with_capacity(window_width);
        window.extend(input_offsets[0..window_width].iter());

        for i in 0..nr_of_gen_offsets {
            let input_matrix: Matrix = self.create_input_matrix(&window);
            let (prediction_vector, _): (Vector, Matrix) = self.rnn.forward(&input_matrix);
            let probs: Vector = prediction_vector.softmax();
            let predicted_offset_id: usize = probs.arg_max();
            let predicted_offset: f32 = predicted_offset_id as f32;
            output_offsets[i] = predicted_offset;
            window.pop_front();
            window.push_back(predicted_offset);
        }
        output_offsets
    }

    pub fn train(&mut self, data: Vec<Song>, track_nr: usize, learn_rate: f32) -> f32 {
        let window_width: usize = 10;
        let mut total_loss: f32 = 0.0;
        let mut total_nr_of_sequences: f32 = 0.0;

        for song in data {
            let first_track: &Track = &song.tracks[track_nr - 1];
            let offsets: &Vec<f32> = &first_track.offsets;
            let mut window: VecDeque<f32> = VecDeque::with_capacity(window_width);
            window.extend(offsets[0..window_width].iter());
            let mut label_index: usize = window_width;
            let mut label: f32 = offsets[label_index];
            let nr_of_possible_labels: usize = offsets.len() - window_width;

            for _ in 1..nr_of_possible_labels {
                let target: usize = self.offset_value_to_id(label);
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
                label = offsets[label_index];
            }
            self.save_weights_biases_to_file();
        }
        let average_loss: f32 = total_loss / total_nr_of_sequences;
        average_loss
    }

    fn create_input_matrix(&self, offsets_sequence: &VecDeque<f32>) -> Matrix {
        let mut inputs_vec: Vec<Vec<f32>> = vec![];

        for offset_value in offsets_sequence {
            let mut offset_vec: Vec<f32> = vec![0.0; NR_OF_POSSIBLE_OFFSETS];
            let target: usize = self.offset_value_to_id(*offset_value);
            offset_vec[target] = 1.0;
            inputs_vec.push(offset_vec);
        }
        Matrix::from_vecs(inputs_vec)
    }

    fn offset_value_to_id(&self, offset_value: f32) -> usize {
        offset_value.max(1000.0) as usize
    }

    pub fn save_weights_biases_to_file(&self) {
        self.rnn.save_weights_biases_to_file("../serde_offset_weights".to_string());
        println!("Weight and biases saved.");
    }
}
