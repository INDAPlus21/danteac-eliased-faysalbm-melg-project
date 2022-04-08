use crate::vector::Vector;
use std::cmp::min;
use std::ops::{Add, Index, IndexMut, Mul};

pub struct Matrix {
    vectors: Vec<Vector>,
}

impl Matrix {
    // Create empty matrix
    pub fn new() -> Matrix {
        Matrix { vectors: vec![] }
    }

    // Create prefilled matrix
    pub fn from_vecs(vecs: Vec<Vec<f32>>) -> Matrix {
        let mut vectors = vec![];
        for vec in vecs {
            vectors.push(Vector::from_vec(vec))
        }

        Matrix { vectors }
    }

    // Create matrix with size
    pub fn with_size(width: usize, height: usize) -> Matrix {
        let mut vectors = vec![];

        for _ in 0..width {
            vectors.push(Vector::with_size(height));
        }

        Matrix { vectors }
    }

    // Create randomized matrix with size
    pub fn with_random(width: usize, length: usize) -> Matrix {
        let mut vectors = vec![];

        for _ in 0..width {
            vectors.push(Vector::with_random(length));
        }

        Matrix { vectors }
    }

    pub fn get_width(&self) -> usize {
        self.vectors.len()
    }

    pub fn get_height(&self) -> usize {
        self.vectors[0].get_length()
    }

    // Converts a vector of vectors with one element each to a vector of elements
    pub fn flatten_2d(&self) -> Vector {
        let mut output = Vector::with_size(self.get_width());

        for column in 0..self.get_width() {
            output[column] = self[column][0];
        }

        output
    }
}

impl Mul<Vector> for Matrix {
    type Output = Vector;

    fn mul(self, _rhs: Vector) -> Vector {
        let length = min(self.get_width(), _rhs.get_length()); // Length of result vector
        let mut output_vector = Vector::with_size(self.get_height());

        for y in 0..self.get_height() {
            for x in 0..length {
                output_vector[y] += self[x][y] * _rhs[x];
            }
        }

        output_vector
    }
}

impl Index<usize> for Matrix {
    type Output = Vector;
    fn index(&self, i: usize) -> &Vector {
        &self.vectors[i]
    }
}

impl IndexMut<usize> for Matrix {
    fn index_mut(&mut self, i: usize) -> &mut Vector {
        &mut self.vectors[i]
    }
}
