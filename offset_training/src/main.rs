use holy_rnns::OffsetRNN;
use midiparser::song::Song;

fn main() {
    let maestro_dataset_path: &str = "../data/train-data/";
    let offsets_weights_biases_file_path: String = "../data/offsets_weights_biases".into();
    // let mut offsets_rnn: OffsetRNN = OffsetRNN::new(64, offsets_weights_biases_file_path);
    let mut offsets_rnn: OffsetRNN = OffsetRNN::from_weights_biases_file(offsets_weights_biases_file_path);
    let songs: Vec<Song> = midiparser::parse_midi_files(maestro_dataset_path);

    // To test with only one song. Make sure to change "songs" into "songs_modified" in offsets_rnn.train()!
    // let songs_modified: Vec<Song> = vec![songs[9].clone()];

    println!("Training started");
    for epoch in 1..=1000 {
        let avg_train_loss: f32 = offsets_rnn.train(songs.clone(), 1, 2e-4);
        println!("--- Epoch {}", (epoch));
        println!("Train:\tLoss {:.20}", avg_train_loss);
    }
}
