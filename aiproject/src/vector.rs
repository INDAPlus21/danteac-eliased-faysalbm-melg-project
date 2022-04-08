use std::cmp::min;
use std::ops::{Add, Index, IndexMut, Mul};

#[derive(PartialEq, Debug)]
pub struct Vector {
    vector: Vec<f32>,
}

impl Vector {
    // Create empty vector
    pub fn new() -> Vector {
        Vector { vector: vec![] }
    }

    // Create pre-filled vector
    pub fn from_vec(vec: Vec<f32>) -> Vector {
        Vector { vector: vec }
    }

    // Create vector with size
    pub fn with_size(length: usize) -> Vector {
        Vector {
            vector: vec![Default::default(); length],
        }
    }

    // Create randomized vector with size
    pub fn with_random(length: usize) -> Vector {
        let mut vector = vec![0.0; length];

        for i in 0..vector.len() {
            vector[i] = rand::random::<f32>();
        }

        Vector { vector: vector }
    }

    pub fn get_length(&self) -> usize {
        self.vector.len()
    }
}

impl Add<Vector> for Vector {
    type Output = Vector;

    fn add(self, _rhs: Vector) -> Vector {
        let length = min(self.vector.len(), _rhs.get_length());
        let mut output = Vector::with_size(length);
        for i in 0..length {
            output[i] = self[i] + _rhs[i];
        }

        output
    }
}

// Dot product
impl Mul<Vector> for Vector {
    type Output = f32;

    fn mul(self, _rhs: Vector) -> f32 {
        let length = min(self.vector.len(), _rhs.get_length());
        let mut output = 0.0;

        for i in 0..length {
            output += self[i] * _rhs[i];
        }

        output
    }
}

impl Index<usize> for Vector {
    type Output = f32;
    fn index(&self, i: usize) -> &f32 {
        &self.vector[i]
    }
}

impl IndexMut<usize> for Vector {
    fn index_mut(&mut self, i: usize) -> &mut f32 {
        &mut self.vector[i]
    }
}
