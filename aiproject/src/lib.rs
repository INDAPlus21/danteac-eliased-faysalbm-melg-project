mod matrix;
use matrix::{Matrix};
// use crate::matrix::Matrix;
// use crate::vector::Vector;
pub mod rnn;
use rnn::{RNN};

mod vector;
use vector::{Vector};
use midiparser::song::{Song, Track};
use std::collections::VecDeque;

use std::fs::File;
use std::fs;

const serde_weights_file: &str = include_str!("../serde_weights");

#[derive(Clone, PartialEq)]
pub struct NotesRNN {
    pub rnn: RNN,
}

impl NotesRNN {
    pub fn new(hidden_size: usize) -> NotesRNN {
        let nr_of_possible_notes: usize = 88;
        NotesRNN {
            rnn: RNN::new(nr_of_possible_notes, hidden_size, nr_of_possible_notes),
        }
    }

    pub fn gen_notes(mut self, input_notes: Vec<f32>, nr_of_gen_notes: usize) -> Vec<f32> {
        let serde_RNN: RNN = serde_json::from_str(&serde_weights_file).unwrap();
        self.rnn.wxh = serde_RNN.wxh;
        self.rnn.whh = serde_RNN.whh;
        self.rnn.why = serde_RNN.why;
        self.rnn.bh = serde_RNN.bh;
        self.rnn.by = serde_RNN.by; 

        let mut output_notes: Vec<f32> = vec![0.0; nr_of_gen_notes];
        let window_width: usize = 10;
        let mut window: VecDeque<f32> = VecDeque::with_capacity(window_width);
        window.extend(input_notes[0..window_width].iter());

        for i in 0..nr_of_gen_notes {
            let input_matrix: Matrix = self.create_input_matrix(&window);
            let (prediction_vector, _): (Vector, Matrix) = self.rnn.forward(&input_matrix);
            let probs: Vector = prediction_vector.softmax();
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
            let mut label = notes[label_index];
            let nr_of_possible_labels: usize = notes.len() - window_width;

            for i in 1..nr_of_possible_labels {
                println!("in possible labels {:?} {:?}", i, nr_of_possible_labels); 
                let target: usize = self.note_value_to_id(label);
                total_nr_of_sequences += 1.0;
                let input_matrix: Matrix = self.create_input_matrix(&window);
                let (output, last_hs): (Vector, Matrix) = self.rnn.forward(&input_matrix);
                let probs: Vector = output.softmax();
                let mut pd_l_pd_y: Vector = probs.clone();
                pd_l_pd_y[target] -= 1.0;
                self.rnn
                    .backward(&input_matrix, pd_l_pd_y, last_hs, learn_rate);
                total_loss -= probs[target].ln();
                window.pop_front();
                window.push_back(label);
                label_index += 1;
                label = notes[label_index];
            }

            // if we want to use serde instead
            println!("saving"); 
            let serialized = serde_json::to_string(&self.rnn).unwrap();
            fs::write("serde_weights", serialized).expect("Unable to write file");
        }
        let average_loss: f32 = total_loss / total_nr_of_sequences;
        average_loss
    }

    fn create_input_matrix(&self, notes_sequence: &VecDeque<f32>) -> Matrix {
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
