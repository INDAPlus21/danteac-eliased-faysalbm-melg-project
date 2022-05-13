mod matrix;
mod tests;
mod vector;
mod rnn;
mod notes_rnn;

use midiparser::song::Song;
use crate::notes_rnn::NotesRNN;

fn main() {
    let maestro_dataset_path  = "./train-data/";
    let mut notes_rnn: NotesRNN = NotesRNN::new(64);
    let songs : Vec<Song> = midiparser::parse_midi_files(maestro_dataset_path);
    let songs_modified: Vec<Song> = vec![songs[0].clone()]; // To test that it works
    for epoch in 1..=1000 {
        let avg_train_loss: f32 = notes_rnn.train(songs_modified.clone(), 1, 2e-2);
        println!("--- Epoch {}", (epoch));
        println!("Train:\tLoss {:.20}", avg_train_loss);
    }
}
