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
    // println!("before {:?}", rnn.wxh);
    // RNN::load_memory(rnn, "rnnMemory2.txt");
    let deserialized = fs::read_to_string("serde_weights").expect("Unable to read file");
    let serde_RNN: RNN = serde_json::from_str(&deserialized).unwrap();
    // println!("serde RNN {:?}", serde_RNN);
    rnn.wxh = serde_RNN.wxh; 
    // println!("{:?}", rnn.wxh = serde_RNN.wxh);
    rnn.whh = serde_RNN.whh;
    rnn.why = serde_RNN.why; 
    rnn.bh = serde_RNN.bh; 
    rnn.by = serde_RNN.by; 

    /* 
    Vafan gör den det här för? (efter 180 epoker av ingenting, gick t.o.m tillbaks till 51)
    --- Epoch 180
    Train:  Loss 0.67533373832702636719 | Accuracy: 0.55172413587570190430
    Test:   Loss 0.72632354497909545898 | Accuracy: 0.55000001192092895508
    --- Epoch 190
    Train:  Loss 0.67096948623657226562 | Accuracy: 0.65517240762710571289
    Test:   Loss 0.72223389148712158203 | Accuracy: 0.69999998807907104492
    --- Epoch 200
    Train:  Loss 0.61948752403259277344 | Accuracy: 0.72413790225982666016
    Test:   Loss 0.68911123275756835938 | Accuracy: 0.69999998807907104492
    ----------------------------------------------------------------------
    --- Epoch 280
    Train:  Loss 0.30902650952339172363 | Accuracy: 0.84482759237289428711
    Test:   Loss 0.29384455084800720215 | Accuracy: 0.89999997615814208984
    --- Epoch 290
    Train:  Loss 0.23295341432094573975 | Accuracy: 0.89655172824859619141
    Test:   Loss 0.22838404774665832520 | Accuracy: 0.94999998807907104492
    --- Epoch 300
    Train:  Loss 0.19195929169654846191 | Accuracy: 0.91379308700561523438
    Test:   Loss 0.21535423398017883301 | Accuracy: 0.94999998807907104492
    Och nu efter några dussin epoker till är den uppe på 86/80, och går skitsnabbt uppåt
    */

    // println!("after {:?}", rnn.wxh);
    for epoch in 1..1000 {
        let (train_loss, train_acc) = process_data(
            train_data.to_owned(),
            vocab_size,
            words_to_id.to_owned(),
            true,
            &mut rnn,
        );

        if epoch % 10 == 9 /* epoch % 10 == 9 */  {
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

            let serialized = serde_json::to_string(&rnn).unwrap();
            fs::write("serde_weights", serialized).expect("Unable to write file");        
            // println!("before load save {:?}", rnn.wxh);
            // RNN::save_matrices(rnn, "rnnMemory2.txt");
            // RNN::load_memory(rnn, "rnnMemory2.txt");
           //  println!("after load {:?}", rnn.wxh);
            // RNN::save_matrices(rnn, "compare.txt");
            // println!("saved compare");
        }

        if epoch % 100 == 0 {
            let deserialized = fs::read_to_string("serde_weights").expect("Unable to read file");
            let serde_RNN: RNN = serde_json::from_str(&deserialized).unwrap();
            println!("serde RNN {:?}", serde_RNN);
            rnn.wxh = serde_RNN.wxh; 
            rnn.whh = serde_RNN.whh;
            rnn.why = serde_RNN.why; 
            rnn.bh = serde_RNN.bh; 
            rnn.by = serde_RNN.by; 

            /* RNN::save_matrices(rnn, "rnnMemory2.txt");
            RNN::load_memory(rnn, "rnnMemory2.txt"); */
        }
    }
}
