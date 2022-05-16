mod data;
mod linalg;
mod memory_reader;
mod rnn;

use crate::linalg::{Matrix, Vector};
use crate::rnn::RNN;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::fs::File;
use std::io::{Read, Write};

fn main() {
    let train_data: HashMap<&str, bool> = data::gen_train_data();
    let test_data: HashMap<&str, bool> = data::gen_test_data();
    let (words_to_id, vocab_size): (HashMap<&str, usize>, usize) =
        data::gen_words_to_id(train_data.to_owned());

    let mut rnn: RNN = RNN::new(vocab_size, 64, 2);

    run_epochs(
        train_data.to_owned(),
        test_data,
        vocab_size,
        words_to_id,
        &mut rnn,
    );
}

fn create_inputs(text: &str, vocab_size: usize, words_to_id: HashMap<&str, usize>) -> Matrix {
    let mut inputs_vec: Vec<Vec<f32>> = vec![];
    for word in text.split_whitespace() {
        let mut word_vec: Vec<f32> = vec![0.0; vocab_size];
        let target: usize = words_to_id[word];
        word_vec[target] = 1.0;
        inputs_vec.push(word_vec);
    }
    Matrix::from_vecs(inputs_vec)
}

fn process_data(
    data: HashMap<&str, bool>,
    vocab_size: usize,
    words_to_id: HashMap<&str, usize>,
    backward: bool,
    mut rnn: &mut RNN,
) -> (f32, f32) {
    let mut loss: f32 = 0.0;
    let mut num_correct: f32 = 0.0;
    for (str, boolean) in data.to_owned() {
        let inputs: Matrix = create_inputs(str, vocab_size, words_to_id.to_owned());
        let target: usize = boolean.into();

        let (out, last_hs): (Vector, Matrix) = rnn.forward(inputs.to_owned());

        let probs: Vector = out.softmax();
        if backward {
            let mut pd_L_pd_y: Vector = probs.clone();
            pd_L_pd_y[target] -= 1.0;

            rnn.backward(inputs.to_owned(), pd_L_pd_y, last_hs, 2e-2);
        }

        loss -= probs[target].ln();
        num_correct += ((probs.argmax() == target) as i32) as f32;
    }
    let total_loss = loss / (data.len() as f32);
    let accuracy = num_correct / (data.len() as f32);
    (total_loss, accuracy)
}

fn run_epochs(
    train_data: HashMap<&str, bool>,
    test_data: HashMap<&str, bool>,
    vocab_size: usize,
    words_to_id: HashMap<&str, usize>,
    mut rnn: &mut RNN,
) {
    RNN::load_memory(rnn, "rnnMemory2.txt");

    // if we want to use serde instead 
    /* let deserialized = fs::read_to_string("serde_weights").expect("Unable to read file");
    let serde_RNN: RNN = serde_json::from_str(&deserialized).unwrap();
    rnn.wxh = serde_RNN.wxh;
    rnn.whh = serde_RNN.whh;
    rnn.why = serde_RNN.why;
    rnn.bh = serde_RNN.bh;
    rnn.by = serde_RNN.by; */

    for epoch in 1..1000 {
        let (train_loss, train_acc) = process_data(
            train_data.to_owned(),
            vocab_size,
            words_to_id.to_owned(),
            true,
            &mut rnn,
        );

        if epoch % 10 == 9 {
            println!("--- Epoch {}", (epoch + 1));
            println!(
                "Train:\tLoss {:.20} | Accuracy: {:.20}",
                train_loss, train_acc
            );
            let (test_loss, test_acc) = process_data(
                test_data.to_owned(),
                vocab_size,
                words_to_id.to_owned(),
                false,
                &mut rnn,
            );
            println!("Test:\tLoss {:.20} | Accuracy: {:.20}", test_loss, test_acc);

            // if we want to use serde instead
            let serialized = serde_json::to_string(&rnn).unwrap();
            fs::write("serde_weights", serialized).expect("Unable to write file");

            RNN::save_matrices(rnn, "rnnMemory2.txt");
        }
    }
}
