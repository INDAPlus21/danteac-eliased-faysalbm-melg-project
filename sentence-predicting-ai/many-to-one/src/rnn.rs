use std::os::unix::raw::ino_t;
use crate::linalg::{Vector, Matrix};

#[derive(Clone, PartialEq)]
pub struct RNN {
    wxh: Matrix,
    whh: Matrix,
    why: Matrix,
    bh: Vector,
    by: Vector,
}

impl RNN {
    pub fn new(input_size: usize, hidden_size: usize, output_size: usize) -> RNN {
        let factor: f32 = (1.0/1000.0);
        RNN {
            // Standard normal distribution.
            wxh: Matrix::with_random_normal(hidden_size, input_size, 0.0, 1.0) * factor,
            whh: Matrix::with_random_normal(hidden_size, hidden_size, 0.0, 1.0) * factor,
            why: Matrix::with_random_normal(output_size, hidden_size, 0.0, 1.0) * factor,
            bh: Vector::with_length(hidden_size),
            by: Vector::with_length(output_size),
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

        let mut d_why: Matrix = d_y.clone() * last_hs[input_len].clone().t();
        let mut d_by: Vector = d_y.clone();

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
}