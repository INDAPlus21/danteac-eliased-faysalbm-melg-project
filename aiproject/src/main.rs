mod matrix;
mod notes_rnn;
mod rnn;
mod tests;
mod vector;

use crate::rnn::RNN;
use crate::notes_rnn::NotesRNN;
use midiparser::song::Song;
use std::fs::File;
use std::fs;

fn main() {
    let maestro_dataset_path = "../../data/train-data/";
    let mut notes_rnn: NotesRNN = NotesRNN::new(64);
    let songs: Vec<Song> = midiparser::parse_midi_files(maestro_dataset_path);
    let songs_modified: Vec<Song> = vec![songs[0].clone()]; // To test that it works

    let deserialized = fs::read_to_string("serde_weights").expect("Unable to read file");
    let serde_RNN: RNN = serde_json::from_str(&deserialized).unwrap();
    notes_rnn.rnn.wxh = serde_RNN.wxh;
    notes_rnn.rnn.whh = serde_RNN.whh;
    notes_rnn.rnn.why = serde_RNN.why;
    notes_rnn.rnn.bh = serde_RNN.bh;
    notes_rnn.rnn.by = serde_RNN.by; 

    println!("Training started");
    for epoch in 1..=1000 {
        let avg_train_loss: f32 = notes_rnn.train(songs_modified.clone(), 1, 2e-2);
        println!("--- Epoch {}", (epoch));
        println!("Train:\tLoss {:.20}", avg_train_loss);

        // if we want to use serde instead
        let serialized = serde_json::to_string(&notes_rnn.rnn).unwrap();
        fs::write("serde_weights", serialized).expect("Unable to write file");        
    }
}
