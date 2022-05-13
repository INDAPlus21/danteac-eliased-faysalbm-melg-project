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
    let songs_modified: Vec<Song> = vec![songs[0].clone()];
    for epoch in 1..=1000 {
        let avg_train_loss: f32 = notes_rnn.train(songs_modified.clone(), 1, 2e-2);
        println!("--- Epoch {}", (epoch));
        println!("Train:\tLoss {:.20}", avg_train_loss);
    }

    // // Parse MIDI
    // if let Some(data) = midiparser::parse_midi("test-asset_Levels") {
    //     println!("DATA: {:?}", data);
    //     let song = &data.tracks[0];
    //
    //     // Sliding window of data
    //     let window_width = 10; // Send a sequence of 10 notes at a time as input
    //     let mut window: VecDeque<f32> = VecDeque::new();
    //     window.extend(song.notes[0..window_width].iter().copied());
    //     let mut label = song.notes[window_width + 1];
    //     for i in 0..(song.notes.len() - window_width - 2) {
    //         println!("{}: {:?} {:?}", i, window, label);
    //         // Send sequence to machine learning and predict next note
    //         // TODO
    //
    //         // Update window
    //         window.pop_front();
    //         window.push_back(label);
    //         label = song.notes[i + window_width];
    //     }
    // }
}
