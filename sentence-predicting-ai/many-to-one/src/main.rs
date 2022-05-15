mod rnn;
mod data;
mod linalg;
mod memorymanager;

use crate::linalg::{Vector, Matrix};
use crate::rnn::RNN;
use crate::memorymanager::Memorymanager;
use std::collections::{HashMap, HashSet};
use std::io::{Read, Write};
use std::fs::File;
use std::fs;


fn main() {
    let train_data: HashMap<&str, bool> = data::gen_train_data();
    let test_data: HashMap<&str, bool> = data::gen_test_data();
    let (words_to_id, vocab_size): (HashMap<&str, usize>, usize) = data::gen_words_to_id(train_data.to_owned());

    let mut rnn: RNN = RNN::new(vocab_size, 64, 2);

    run_epochs(train_data.to_owned(), test_data, vocab_size, words_to_id, &mut rnn);
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

fn process_data(data: HashMap<&str, bool>, vocab_size: usize, words_to_id: HashMap<&str, usize>, backward: bool, mut rnn: &mut RNN) -> (f32, f32) {
    let mut loss: f32 = 0.0;
    let mut num_correct: f32 = 0.0;
    for (str, boolean) in data.to_owned() {
        let inputs: Matrix = create_inputs(str, vocab_size, words_to_id.to_owned());
        let target: usize = boolean.into();

        let (out, last_hs) : (Vector, Matrix) = rnn.forward(inputs.to_owned());

        let probs: Vector = out.softmax();
        if backward {
            let mut pd_L_pd_y: Vector = probs.clone();
            pd_L_pd_y[target] -= 1.0;

            rnn.backward(inputs.to_owned(), pd_L_pd_y, last_hs, 2e-2);
        }

        loss -= probs[target].ln();
        num_correct += ((probs.argmax() == target) as i32) as f32;
    }
    let total_loss = loss/(data.len() as f32);
    let accuracy = num_correct/(data.len() as f32);
    (total_loss, accuracy)
}

fn run_epochs(train_data: HashMap<&str, bool>, test_data: HashMap<&str, bool>, vocab_size: usize, words_to_id: HashMap<&str, usize>, mut rnn: &mut RNN) {
    load_matrices(rnn, "rnnMemory.txt");
    for epoch in 1..1000 {
        let (train_loss, train_acc) = process_data(train_data.to_owned(), vocab_size, words_to_id.to_owned(), true, &mut rnn);

        if epoch % 10 == 9 {
            println!("--- Epoch {}", (epoch + 1));
            println!("Train:\tLoss {:.20} | Accuracy: {:.20}", train_loss, train_acc);
            let (test_loss, test_acc) = process_data(test_data.to_owned(), vocab_size, words_to_id.to_owned(), false, &mut rnn);
            println!("Test:\tLoss {:.20} | Accuracy: {:.20}", test_loss, test_acc);
            save_matrices(rnn);
        }
    }
}


// saves memory to a memory file
fn save_matrices(rnn: &mut RNN) {
    if let Ok(mut file) = File::create("rnnMemory.txt") {
        let mut wxh: &Matrix = &rnn.wxh;
        /*if let Ok(mut file) = file.write_all(b"Hello\n") {

        }*/
        write!(file, "{}",&Matrix::get_content_as_string(&wxh));

        
    } else {
        println!("file error or smth");
    }
}

// loads memory from memory file

fn load_matrices(rnn: &mut RNN, path: &str){
    // get memoery string
    let mut file = File::open(path).expect("file error or something");
    let mut content = String::new();
    file.read_to_string(&mut content).expect("file read error or something");
    // read dimensions
    let mut next_index: usize;
    let (width, mut next_index): (f32, usize) = Memorymanager::read_number(&content, 0);
    let (height, mut next_index): (f32, usize) = Memorymanager::read_number(&content, next_index);

    let width = width as usize;
    let height = height as usize;
    println!("width {}, height{}", width, height);

    // read contents and create matrix
    let mut vec_of_vecs: Vec<Vec<f32>> = vec![];
    for i in 0..height{
        let mut row = vec![0.0; width];
        vec_of_vecs.push(row);
    }
    
    let mut num: f32;
    for n in 0..(height - 1){
        for m in 0..(width - 1){
            (num, next_index) = Memorymanager::read_number(&content, next_index);
            vec_of_vecs[n][m] = num;
        }
    }

    rnn.wxh = Matrix::from_vecs(vec_of_vecs);

    write!(file, "\n\n\n");
    write!(file, "{}",&Matrix::get_content_as_string(&rnn.wxh));

    // repeat for other memory components
}
