mod matrix;
// mod notes_rnn;
mod rnn;
mod tests;
mod vector;

// use crate::notes_rnn::NotesRNN;
use aiproject::rnn::RNN;
use aiproject::NotesRNN;
use midiparser::song::Song;
use std::fs;
use std::fs::File;

fn main() {
    let maestro_dataset_path = "../data/train-data/";
    let mut notes_rnn: NotesRNN = NotesRNN::new(64);
    let songs: Vec<Song> = midiparser::parse_midi_files(maestro_dataset_path);

    /* let deserialized = fs::read_to_string("serde_weights").expect("Unable to read file");
    let serde_rnn: RNN = serde_json::from_str(&deserialized).unwrap();
    notes_rnn.rnn.wxh = serde_rnn.wxh;
    notes_rnn.rnn.whh = serde_rnn.whh;
    notes_rnn.rnn.why = serde_rnn.why;
    notes_rnn.rnn.bh = serde_rnn.bh;
    notes_rnn.rnn.by = serde_rnn.by; */ 

    println!("Training started");
    for epoch in 1..=1000 {
        // let avg_train_loss: f32 = notes_rnn.train(songs.clone(), 1, 2e-2);
        println!("--- Epoch {}", (epoch));
        // println!("Train:\tLoss {:.20}", avg_train_loss);
        notes_rnn.save_weights_biases_to_file();

        // if we want to use serde instead
        let serialized = serde_json::to_string(&notes_rnn.rnn).unwrap();
        fs::write("serde_weights", serialized).expect("Unable to write file");
    }
}
