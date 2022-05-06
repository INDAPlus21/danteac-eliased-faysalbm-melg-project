use std::cmp::min;
use std::fmt::{Debug, Formatter, Result};
use std::ops::{Add, AddAssign, Index, IndexMut, Mul, Sub, SubAssign};

#[derive(PartialEq, Clone)]
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
        Vector::with_value(length, 0.0)
    }

    // Create vector with value
    pub fn with_value(length: usize, value: f32) -> Vector {
        Vector {
            vector: vec![value; length],
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

    // Clamp every element
    pub fn clamp(&self, min: f32, max: f32) -> Vector {
        let mut output = Vector::with_size(self.get_length());
        for i in 0..self.get_length() {
            output[i] = self[i].clamp(min, max);
        }

        output
    }

    // Take 1 minus every element
    pub fn one_minus(self) -> Vector {
        let mut output = Vector::with_size(self.get_length());
        for i in 0..self.get_length() {
            output[i] = 1.0 - self[i];
        }

        output
    }
}

impl Debug for Vector {
    // Print vector as Vec
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        f.debug_list().entries(self.vector.clone()).finish()
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

impl AddAssign<Vector> for Vector {
    fn add_assign(&mut self, _rhs: Vector) {
        for i in 0..self.get_length() {
            self[i] = self[i] + _rhs[i];
        }
    }
}

impl Sub<Vector> for Vector {
    type Output = Vector;

    fn sub(self, _rhs: Vector) -> Vector {
        let length = min(self.vector.len(), _rhs.get_length());
        let mut output = Vector::with_size(length);
        for i in 0..length {
            output[i] = self[i] - _rhs[i];
        }

        output
    }
}

impl SubAssign<Vector> for Vector {
    fn sub_assign(&mut self, _rhs: Vector) {
        for i in 0..self.get_length() {
            self[i] = self[i] - _rhs[i];
        }
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

// Scalar multiplication
impl Mul<f32> for Vector {
    type Output = Vector;

    fn mul(self, _rhs: f32) -> Vector {
        let mut output = Vector::with_size(self.get_length());

        for i in 0..self.vector.len() {
            output[i] = self[i] * _rhs;
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