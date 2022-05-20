use midiparser::song::Song;
use rnns::NotesRNN;
use rnns::OffsetRNN;
use std::fs;
use std::fs::File;
use rand::prelude::*;

fn main() {
    // let maestro_dataset_path = "../data/train-data/";
    // let mut notes_rnn: NotesRNN = NotesRNN::new(64); //from_weights_biases_file();
    // notes_rnn.save_weights_biases_to_file(); 

    let mut notes_rnn: NotesRNN = NotesRNN::from_weights_biases_file(); 
    // let mut notes_rnn: OffsetRNN = OffsetRNN::from_weights_biases_file(); // :new(64);  // ::new(64);
    // notes_rnn.save_weights_biases_to_file();1

    // println!("{:?}", vec![0.0; 3]);

    /* let mut rng = rand::thread_rng();
    let y: f64 = rng.gen(); // generates a float between 0 and 1

    let mut nums: Vec<f32> = (0..88).map(|x| x as f32).collect();
    nums.shuffle(&mut rng);
    let random_vec: Vec<f32> = nums.drain(..10).collect(); 

    println!("{:?}", random_vec); */

    let gen_notes = notes_rnn.gen_notes(/* random_vec */
        vec![
            29.0, 78.0, 1.0, 53.0, 55.0, 32.0, 52.0, 11.0, 63.0, 36.0, 21.0, 21.0,
        ],
        10,
    );

    println!("{:?}", gen_notes);

    // let songs: Vec<Song> = midiparser::parse_midi_files(maestro_dataset_path);

    /* println!("Training started");
    for epoch in 1..=1000 {
        let avg_train_loss: f32 = notes_rnn.train(songs.clone(), 1, 0.1 /* 2e-2 */);
        println!("--- Epoch {}", (epoch));
        println!("Train:\tLoss {:.20}", avg_train_loss);
    } */
}