use midiparser::song::Song;
use rnns::NotesRNN;
use rnns::OffsetRNN;
use std::fs;
use std::fs::File;

fn main() {
    let maestro_dataset_path = "../data/train-data/";
    // let mut notes_rnn: NotesRNN = NotesRNN::new(64); //from_weights_biases_file();
    // let mut notes_rnn: NotesRNN = NotesRNN::new(64); // from_weights_biases_file();
    let mut notes_rnn: OffsetRNN = OffsetRNN::new(64); // from_weights_biases_file();
    notes_rnn.save_weights_biases_to_file();

    /* notes_rnn.gen_notes(
        vec![
            40.0, 48.0, 24.0, 44.0, 42.0, 25.0, 25.0, 42.0, 42.0, 25.0, 25.0, 80.0,
        ],
        10,
    ); */

    let songs: Vec<Song> = midiparser::parse_midi_files(maestro_dataset_path);

    println!("Training started");
    for epoch in 1..=1000 {
        let avg_train_loss: f32 = notes_rnn.train(songs.clone(), 1, 0.1 /* 2e-2 */);
        println!("--- Epoch {}", (epoch));
        println!("Train:\tLoss {:.20}", avg_train_loss);
    }
}
