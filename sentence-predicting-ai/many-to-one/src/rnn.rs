use crate::linalg::{Matrix, Vector};
use crate::memory_reader;
use std::fs::File;
use std::fs::OpenOptions;
use std::io::{Read, Write};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
#[derive(Clone, PartialEq)]
pub struct RNN {
    pub wxh: Matrix,
    pub whh: Matrix,
    pub why: Matrix,
    pub bh: Vector,
    pub by: Vector,
}

impl RNN {
    pub fn new(input_size: usize, hidden_size: usize, output_size: usize) -> RNN {
        let factor: f32 = 1.0 / 1000.0;
        RNN {
            // Standard normal distribution.
            /* wxh: Matrix::with_random_normal(hidden_size, input_size, 0.0, 1.0) * factor,
            whh: Matrix::with_random_normal(hidden_size, hidden_size, 0.0, 1.0) * factor,
            why: Matrix::with_random_normal(output_size, hidden_size, 0.0, 1.0) * factor,
            bh: Vector::with_length(hidden_size),
            by: Vector::with_length(output_size) */

            wxh: Matrix::from_vecs(vec![]),
            whh:  Matrix::from_vecs(vec![]),
            why:  Matrix::from_vecs(vec![]),
            bh: Vector::with_length(0),
            by: Vector::with_length(0)
        }
    }

    pub fn forward(&self, inputs: Matrix) -> (Vector, Matrix) {
        let inputs_height: usize = inputs.get_height();
        let mut h: Vector = Vector::with_length(self.whh.get_height());

        let mut last_hs: Matrix = Matrix::with_dims(inputs_height + 1, h.get_length());
        last_hs[0] = h.clone();
        for i in 0..inputs_height {
            let temp1: Vector = self.wxh.clone() * inputs[i].clone();
            let temp2: Vector = self.whh.clone() * h.clone();
            let temp3: Vector = temp1 + temp2 + self.bh.clone();
            h = temp3.tanh();
            last_hs[i + 1] = h.clone();
        }

        let y: Vector = self.why.clone() * h.clone() + self.by.clone();

        (y, last_hs)
    }

    pub fn backward(&mut self, inputs: Matrix, d_y: Vector, last_hs: Matrix, learn_rate: f32) {
        let mut d_whh: Matrix = Matrix::with_size(self.whh.get_size());
        let mut d_wxh: Matrix = Matrix::with_size(self.wxh.get_size());
        let mut d_bh: Vector = Vector::with_length(self.bh.get_length());
        let input_len: usize = inputs.get_height();

        let d_why: Matrix = d_y.clone() * last_hs[input_len].clone().t();
        let d_by: Vector = d_y.clone();

        let mut d_h: Vector = self.why.t() * d_y.clone();

        for t in (0..input_len).rev() {
            let h_square: Vector = (last_hs[t + 1].pow(2));
            let temp: Vector = d_h.clone().elem_mult((1.0 - h_square));

            d_bh += temp.clone();
            d_whh += temp.clone() * last_hs[t].clone().t();
            d_wxh += temp.clone() * inputs[t].clone().t();

            d_h = self.whh.clone() * temp.clone();
        }

        self.why -= learn_rate * d_why.clamp(-1.0, 1.0);
        self.whh -= learn_rate * d_whh.clamp(-1.0, 1.0);
        self.wxh -= learn_rate * d_wxh.clamp(-1.0, 1.0);
        self.by -= learn_rate * d_by.clamp(-1.0, 1.0);
        self.bh -= learn_rate * d_bh.clamp(-1.0, 1.0);
    }

    // saves memory to a memory file
    /* pub fn save_matrices(rnn: &mut RNN, path: &str) {
        if let Ok(file) = File::create(path) {
            let wxh: &Matrix = &rnn.wxh;
            let whh: &Matrix = &rnn.whh;
            let why: &Matrix = &rnn.why;
            let bh: &Vector = &rnn.bh;
            let by: &Vector = &rnn.by;

            let mut file = OpenOptions::new()
                .write(true)
                .append(true)
                .open(path)
                .unwrap();

            for matrix in vec![&wxh, &whh, &why].iter() {
                if let Err(error) = writeln!(file, "{}", &Matrix::convert_to_string(matrix)) {
                    eprintln!("Couldn't write to file: {}", error);
                }
            }

            for vector in vec![&bh, &by].iter() {
                if let Err(error) = writeln!(file, "{}", &Vector::convert_to_string(vector)) {
                    eprintln!("Couldn't write to file: {}", error);
                }
            }
        } else {
            println!("file error or smth");
        }
    } */

    // loads memory from memory file
    /* ub fn load_memory(rnn: &mut RNN, path: &str) {
        // get memory string
        // använder samma openoptions objet att den inte readar/writer! 
        // .seek(SeekFrom::Current(0))
        let mut file = OpenOptions::new()
        .read(true)
        .open(path)
        .unwrap();  
        // let mut file = File::open(path).expect("file error or something");
        let mut content = String::new();
        file.read_to_string(&mut content)
            .expect("file read error or something");
        let mut b_matrix: Matrix;
        // read dimensions
        let mut next_index: usize = 0;
        (rnn.wxh, next_index) = RNN::load_matrix(&content, &next_index);
        // println!("after {:?}", rnn.wxh);
        // println!("wxh {}", next_index);
        (rnn.whh, next_index) = RNN::load_matrix(&content, &next_index);
        println!("whh {}", next_index);
        // println!("after {:?}", rnn.whh);
        (rnn.why, next_index) = RNN::load_matrix(&content, &next_index);
        println!("why {}", next_index);
        // println!("why {:?}", rnn.why);
        (b_matrix, next_index) = RNN::load_matrix(&content, &next_index);
        println!("bh {}", next_index);
        rnn.bh = b_matrix.flatten();
        println!("bh {:?}", rnn.bh);
        (b_matrix, next_index) = RNN::load_matrix(&content, &next_index);
        println!("by {}", next_index);
        rnn.by = b_matrix.flatten();
        println!("by {:?}", rnn.by);
        // println!("bh after {:?}", rnn.bh);
    } */

    /* fn load_matrix(content: &String, next_index: &usize) -> (Matrix, usize) {
        let (height, next_index): (f32, usize) =
            memory_reader::read_number(&content, next_index);
        let (width, mut next_index): (f32, usize) =
            memory_reader::read_number(&content, &next_index);

        let width = width as usize;
        let height = height as usize;

        // read contents and create matrix
        let mut vec_of_vecs: Vec<Vec<f32>> = vec![];
        for _ in 0..height {
            let row = vec![0.0; width];
            vec_of_vecs.push(row);
        }

        let mut num: f32;
        for n in 0..height {
            for m in 0..width {
                (num, next_index) = memory_reader::read_number(&content, &next_index);
                vec_of_vecs[n][m] = num;
            }
        }

        (Matrix::from_vecs(vec_of_vecs), next_index)
    } */
}
