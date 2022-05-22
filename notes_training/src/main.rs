use holy_rnns::NotesRNN;
use midiparser::song::Song;

fn main() {
    let maestro_dataset_path: &str = "../data/train-data/";
    let notes_weights_biases_file_path: String = "../data/notes_weights_biases".into();
    let mut notes_rnn: NotesRNN = NotesRNN::from_weights_biases_file(notes_weights_biases_file_path);
    let songs: Vec<Song> = midiparser::parse_midi_files(maestro_dataset_path);

    // To test with only one song. Make sure to change "songs" into "songs_modified" in notes_rnn.train()!
    // let songs_modified: Vec<Song> = vec![songs[9].clone()]; // To test only

    println!("Training started");
    for epoch in 1..=1000 {
        let avg_train_loss: f32 = notes_rnn.train(songs.clone(), 1, 2e-4);
        println!("--- Epoch {}", (epoch));
        println!("Train:\tLoss {:.20}", avg_train_loss);
    }
}
