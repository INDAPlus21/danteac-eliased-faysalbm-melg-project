use crate::Matrix;
use rand_distr::{Distribution, Normal};
use std::fmt::{Debug, Formatter, Result};
use std::ops::{Add, AddAssign, Index, IndexMut, Mul, Sub, SubAssign};

#[derive(Clone, PartialEq)]
pub struct Vector {
    vector: Vec<f32>,
}

impl Vector {
    //region Getters
    pub fn get_length(&self) -> usize {
        self.vector.len()
    }
    //endregion

    //region Creation functions
    pub fn from_vec(vec: Vec<f32>) -> Vector {
        Vector { vector: vec }
    }

    pub fn with_value(length: usize, value: f32) -> Vector {
        Vector {
            vector: vec![value; length],
        }
    }

    pub fn with_length(length: usize) -> Vector {
        Vector::with_value(length, 0.0)
    }

    pub fn with_random(length: usize) -> Vector {
        let mut vec: Vec<f32> = vec![0.0; length];
        for i in 0..vec.len() {
            vec[i] = rand::random::<f32>();
        }
        Vector { vector: vec }
    }

    pub fn with_random_normal(length: usize, mean: f32, std_dev: f32) -> Vector {
        let normal_distr: Normal<f32> = rand_distr::Normal::new(mean, std_dev).unwrap();
        let mut vec: Vec<f32> = vec![0.0; length];
        for i in 0..vec.len() {
            vec[i] = normal_distr.sample(&mut rand::thread_rng());
        }
        Vector { vector: vec }
    }
    //endregion

    //region Outputting functions
    pub fn sum(&self) -> f32 {
        let mut sum: f32 = 0.0;
        for i in 0..self.get_length() {
            sum += self[i]
        }
        sum
    }

    pub fn argmax(&self) -> usize {
        let mut index: usize = 0;
        for i in 0..(self.get_length() - 1) {
            if self[i + 1] > self[i] {
                index = i + 1;
            }
        }
        index
    }

    pub fn contains_nan(&self) -> bool {
        for i in 0..self.get_length() {
            if self[i].is_nan() {
                return true;
            }
        }
        return false;
    }
    //endregion

    //region Producing functions
    pub fn pow(&self, exponent: i32) -> Vector {
        let vector_len = self.get_length();
        let mut output: Vector = Vector::with_length(vector_len);
        for i in 0..vector_len {
            output[i] = self[i].powi(exponent);
        }
        output
    }

    pub fn elem_mult(&self, vector_operand: Vector) -> Vector {
        let self_len: usize = self.get_length();
        let operand_len: usize = vector_operand.get_length();
        if self_len == operand_len {
            let mut output: Vector = Vector::with_length(self_len);
            for i in 0..self_len {
                output[i] = self[i] * vector_operand[i];
            }
            output
        } else {
            panic!("Mismatching lengths for vector.elem_mult(vector).")
        }
    }

    pub fn exp(&self) -> Vector {
        let vector_len = self.get_length();
        let mut output: Vector = Vector::with_length(vector_len);
        for i in 0..vector_len {
            output[i] = self[i].exp();
        }
        output
    }

    pub fn re_lu(&self) -> Vector {
        let vector_len: usize = self.get_length();
        let mut output: Vector = Vector::with_length(vector_len);
        for i in 0..vector_len {
            output[i] = self[i].max(0.0);
        }
        output
    }

    pub fn tanh(&self) -> Vector {
        let vector_len: usize = self.get_length();
        let mut output = Vector::with_length(vector_len);
        for i in 0..vector_len {
            output[i] = self[i].tanh();
        }
        output
    }

    pub fn softmax(&self) -> Vector {
        let vector_len = self.get_length();
        let mut output: Vector = Vector::with_length(self.get_length());
        let sum_of_exps: f32 = self.exp().sum();
        for i in 0..vector_len {
            output[i] = self[i].exp() / sum_of_exps;
        }
        output
    }

    pub fn clamp(&self, min: f32, max: f32) -> Vector {
        let self_len: usize = self.get_length();
        let mut output: Vector = Vector::with_length(self_len);
        for i in 0..self_len {
            output[i] = self[i].clamp(min, max);
        }
        output
    }

    pub fn ln(&self) -> Vector {
        let self_len: usize = self.get_length();
        let mut output: Vector = Vector::with_length(self_len);
        for i in 0..self_len {
            output[i] = self[i].ln();
        }
        output
    }

    pub fn t(&self) -> Matrix {
        Matrix::from_vecs(vec![self.vector.clone()])
    }

    pub fn convert_to_string(&self) -> String {
        let mut string: String = "1".to_string();
        string.push_str(" ");
        string.push_str(&Vector::get_length(&self).to_string());
        string.push_str(" ");

        for i in 0..self.get_length() {
            string.push_str(&self.vector[i].to_string());
            string.push_str(" ");
        }
        string
    }
    //endregion
}

impl Debug for Vector {
    // Print vector as Vec
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        f.debug_list().entries(self.vector.clone()).finish()
    }
}

//region Operators

//region Index
impl Index<usize> for Vector {
    type Output = f32;

    fn index(&self, i: usize) -> &Self::Output {
        &self.vector[i]
    }
}

impl IndexMut<usize> for Vector {
    fn index_mut(&mut self, i: usize) -> &mut Self::Output {
        &mut self.vector[i]
    }
}
//endregion

//region Addition
impl Add<Vector> for Vector {
    type Output = Vector;

    fn add(self, rhs: Vector) -> Self::Output {
        let self_len: usize = self.get_length();
        let operand_len: usize = rhs.get_length();
        if self_len == operand_len {
            let mut output: Vector = Vector::with_length(self_len);
            for i in 0..self_len {
                output[i] = self[i] + rhs[i];
            }
            output
        } else {
            panic!("Mismatching lengths for vector + vector.")
        }
    }
}

impl Add<f32> for Vector {
    type Output = Vector;

    fn add(self, rhs: f32) -> Self::Output {
        let vector_len: usize = self.get_length();
        let mut output: Vector = Vector::with_length(vector_len);
        for i in 0..vector_len {
            output[i] = self[i] + rhs;
        }
        output
    }
}

impl Add<Vector> for f32 {
    type Output = Vector;

    fn add(self, rhs: Vector) -> Self::Output {
        rhs + self
    }
}

impl AddAssign<Vector> for Vector {
    fn add_assign(&mut self, rhs: Vector) {
        for i in 0..self.get_length() {
            self[i] = self[i] + rhs[i];
        }
    }
}
//endregion

//region Subtraction
impl Sub<Vector> for Vector {
    type Output = Vector;

    fn sub(self, rhs: Vector) -> Self::Output {
        let self_len: usize = self.get_length();
        let operand_len: usize = rhs.get_length();
        if self_len == operand_len {
            let mut output: Vector = Vector::with_length(self_len);
            for i in 0..self_len {
                output[i] = self[i] - rhs[i];
            }
            output
        } else {
            panic!("Mismatching lengths for vector - vector.");
        }
    }
}

impl Sub<f32> for Vector {
    type Output = Vector;

    fn sub(self, rhs: f32) -> Self::Output {
        let vector_len: usize = self.get_length();
        let mut output: Vector = Vector::with_length(vector_len);
        for i in 0..vector_len {
            output[i] = self[i] - rhs;
        }
        output
    }
}

impl Sub<Vector> for f32 {
    type Output = Vector;

    fn sub(self, rhs: Vector) -> Self::Output {
        let vector_len: usize = rhs.get_length();
        let mut output: Vector = Vector::with_length(vector_len);
        for i in 0..vector_len {
            output[i] = self - rhs[i];
        }
        output
    }
}

impl SubAssign<Vector> for Vector {
    fn sub_assign(&mut self, rhs: Vector) {
        for i in 0..self.get_length() {
            self[i] = self[i] - rhs[i];
        }
    }
}
//endregion

//region Multiplication

// Dot Product
impl Mul<Vector> for Vector {
    type Output = f32;

    fn mul(self, rhs: Vector) -> Self::Output {
        let self_len: usize = self.get_length();
        let operand_len: usize = rhs.get_length();
        if self_len == operand_len {
            let mut output: f32 = 0.0;
            for i in 0..self_len {
                output += self[i] * rhs[i];
            }
            output
        } else {
            panic!("Mismatching lengths for vector * vector (dot).")
        }
    }
}

// Scalar multiplication: vector * scalar
impl Mul<f32> for Vector {
    type Output = Vector;

    fn mul(self, rhs: f32) -> Self::Output {
        let vector_len: usize = self.get_length();
        let mut output: Vector = Vector::with_length(vector_len);
        for i in 0..vector_len {
            output[i] = rhs * self[i];
        }
        output
    }
}

// Scalar multiplication: scalar * vector
impl Mul<Vector> for f32 {
    type Output = Vector;

    fn mul(self, rhs: Vector) -> Self::Output {
        rhs * self
    }
}

// Column vector * Row vector
impl Mul<Matrix> for Vector {
    type Output = Matrix;

    fn mul(self, rhs: Matrix) -> Self::Output {
        let operand_height: usize = rhs.get_height();
        let operand_width: usize = rhs.get_width();
        if operand_height == 1 {
            let self_len: usize = self.get_length();
            let mut output: Matrix = Matrix::with_size((self_len, operand_width));
            for self_out_row in 0..self_len {
                for operand_out_col in 0..operand_width {
                    output[self_out_row][operand_out_col] =
                        self[self_out_row] * rhs[0][operand_out_col];
                }
            }
            output
        } else {
            panic!("Mismatching dimensions for vector * matrix (row vector).")
        }
    }
}

//endregion

//endregion
