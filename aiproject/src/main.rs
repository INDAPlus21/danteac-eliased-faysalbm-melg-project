mod matrix;
mod notes_rnn;
mod rnn;
mod tests;
mod vector;
mod offset_rnn;

use crate::notes_rnn::NotesRNN;
use midiparser::song::Song;

fn main() {
    let maestro_dataset_path = "./train-data/";
    let weights_biases_file_path: String = "./src/notes_weights_biases".into();
    // let mut notes_rnn: NotesRNN = NotesRNN::new(64, weights_biases_file_path);
    let mut notes_rnn: NotesRNN = NotesRNN::from_weights_biases_file(weights_biases_file_path);
    let songs: Vec<Song> = midiparser::parse_midi_files(maestro_dataset_path);
    let songs_modified: Vec<Song> = vec![songs[1].clone()]; // To test that it works

    println!("Training started");
    for epoch in 1..=1000 {
        //let avg_train_loss: f32 = notes_rnn.train(songs_modified.clone(), 1, 2e-2);
        println!("--- Epoch {}", (epoch));
        //println!("Train:\tLoss {:.20}", avg_train_loss);

        println!("Notes generation.");
        let gen_notes: Vec<f32> = notes_rnn.gen_notes(vec![29.0, 78.0, 17.0, 3.0, 50.0, 32.0, 52.0, 11.0, 63.0, 36.0, 21.0, 66.0], 20);
        println!("Next epoch.");
    }
}
