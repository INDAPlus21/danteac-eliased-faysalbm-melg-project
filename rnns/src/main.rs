use midiparser::song::Song;
use rnns::NotesRNN;
use std::fs;
use std::fs::File;

fn main() {
    let maestro_dataset_path = "../data/train-data/";
    let mut notes_rnn: NotesRNN = NotesRNN::from_weights_biases_file();
    let songs: Vec<Song> = midiparser::parse_midi_files(maestro_dataset_path);

    println!("Training started");
    for epoch in 1..=1000 {
        // let avg_train_loss: f32 = notes_rnn.train(songs.clone(), 1, 2e-2);
        println!("--- Epoch {}", (epoch));
        // println!("Train:\tLoss {:.20}", avg_train_loss);
        notes_rnn.save_weights_biases_to_file();
        println!("test");
    }
}
