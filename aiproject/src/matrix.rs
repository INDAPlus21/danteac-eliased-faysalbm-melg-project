use crate::vector::Vector;
use std::fmt::{Debug, Formatter, Result};
use std::ops::{Add, AddAssign, Index, IndexMut, Mul, Sub, SubAssign};

#[derive(Clone, PartialEq)]
pub struct Matrix {
    vectors: Vec<Vector>,
}

impl Matrix {
    //region Getters
    pub fn get_height(&self) -> usize {
        self.vectors.len()
    }

    pub fn get_width(&self) -> usize {
        self.vectors[0].get_length()
    }

    pub fn get_size(&self) -> (usize, usize) {
        (self.get_height(), self.get_width())
    }
    //endregion

    //region Creation functions
    pub fn from_vecs(vecs: Vec<Vec<f32>>) -> Matrix {
        let mut vec_of_vectors: Vec<Vector> = vec![];
        for vec in vecs {
            vec_of_vectors.push(Vector::from_vec(vec));
        }
        Matrix {
            vectors: vec_of_vectors,
        }
    }

    pub fn with_dims(height: usize, width: usize) -> Matrix {
        let mut vec_of_vectors: Vec<Vector> = vec![];
        for _ in 0..height {
            vec_of_vectors.push(Vector::with_length(width));
        }
        Matrix {
            vectors: vec_of_vectors,
        }
    }

    pub fn with_size(size: (usize, usize)) -> Matrix {
        Matrix::with_dims(size.0, size.1)
    }

    pub fn with_random(height: usize, width: usize) -> Matrix {
        let mut vec_of_vectors: Vec<Vector> = vec![];
        for _ in 0..height {
            vec_of_vectors.push(Vector::with_random(width));
        }
        Matrix {
            vectors: vec_of_vectors,
        }
    }

    pub fn with_random_normal(
        height: usize,
        width: usize,
        mean: f32,
        standard_deviation: f32,
    ) -> Matrix {
        let mut vec_of_vectors: Vec<Vector> = vec![];
        for _ in 0..height {
            vec_of_vectors.push(Vector::with_random_normal(width, mean, standard_deviation));
        }
        Matrix {
            vectors: vec_of_vectors,
        }
    }
    //endregion

    //region Outputting functions
    pub fn sum(&self) -> f32 {
        let mut sum: f32 = 0.0;
        for row in 0..self.get_height() {
            for col in 0..self.get_width() {
                sum += self[row][col];
            }
        }
        sum
    }

    pub fn contains_nan(&self) -> bool {
        for row in 0..self.get_height() {
            for col in 0..self.get_width() {
                if self[row][col].is_nan() {
                    return true;
                }
            }
        }
        return false;
    }
    //endregion

    //region Producing functions
    pub fn clamp(&self, min: f32, max: f32) -> Matrix {
        let self_height: usize = self.get_height();
        let self_width: usize = self.get_width();
        let mut output: Matrix = Matrix::with_size(self.get_size());
        for row in 0..self_height {
            for col in 0..self_width {
                output[row][col] = self[row][col].clamp(min, max);
            }
        }
        output
    }

    pub fn t(&self) -> Matrix {
        let self_height: usize = self.get_height();
        let self_width: usize = self.get_width();
        let mut output = Matrix::with_dims(self_width, self_height);
        for row in 0..self_height {
            for col in 0..self_width {
                output[col][row] = self[row][col];
            }
        }
        output
    }

    // Concatenates all row vectors into one column vector.
    pub fn flatten(&self) -> Vector {
        let self_height: usize = self.get_height();
        let self_width: usize = self.get_width();
        let output_len: usize = self_height * self_width;
        let mut output: Vector = Vector::with_length(output_len);
        for row in 0..self_height {
            for col in 0..self_width {
                output[row * self_width + col] = self[row][col];
            }
        }
        output
    }
    //endregion
}

impl Debug for Matrix {
    // Print matrix as grid
    fn fmt(&self, formatter: &mut Formatter<'_>) -> Result {
        formatter.write_str("[")?;
        for y in 0..self.get_height() {
            for x in 0..self.get_width() {
                formatter.write_fmt(format_args!("{}", self[x][y]))?;
                if x < self.get_width() - 1 {
                    formatter.write_str(", ")?;
                }
            }

            if y < self.get_height() - 1 {
                formatter.write_str("\n")?;
            }
        }

        formatter.write_str("]")
    }
}

//region Operators

//region Index
impl Index<usize> for Matrix {
    type Output = Vector;

    fn index(&self, i: usize) -> &Self::Output {
        &self.vectors[i]
    }
}

impl IndexMut<usize> for Matrix {
    fn index_mut(&mut self, i: usize) -> &mut Self::Output {
        &mut self.vectors[i]
    }
}
//endregion

//region Addition
impl Add<Matrix> for Matrix {
    type Output = Matrix;

    fn add(self, rhs: Matrix) -> Self::Output {
        let self_size: (usize, usize) = self.get_size();
        let operand_size: (usize, usize) = rhs.get_size();
        if self_size == operand_size {
            let self_height: usize = self_size.0;
            let mut output: Matrix = Matrix::with_size(self_size);
            for row in 0..self_height {
                output[row] = self[row].clone() + rhs[row].clone();
            }
            output
        } else {
            panic!("Mismatching sizes for matrix + matrix.")
        }
    }
}

impl Add<f32> for Matrix {
    type Output = Matrix;

    fn add(self, rhs: f32) -> Self::Output {
        let self_size: (usize, usize) = self.get_size();
        let self_height: usize = self_size.0;
        let self_width: usize = self_size.1;
        let mut output: Matrix = Matrix::with_size(self_size);
        for row in 0..self_height {
            for col in 0..self_width {
                output[row][col] = self[row][col] + rhs;
            }
        }
        output
    }
}

impl Add<Matrix> for f32 {
    type Output = Matrix;

    fn add(self, rhs: Matrix) -> Self::Output {
        rhs + self
    }
}

impl AddAssign<Matrix> for Matrix {
    fn add_assign(&mut self, rhs: Matrix) {
        for row in 0..self.get_height() {
            self[row] = self[row].clone() + rhs[row].clone();
        }
    }
}
//endregion

//region Subtraction
impl Sub<Matrix> for Matrix {
    type Output = Matrix;

    fn sub(self, rhs: Matrix) -> Self::Output {
        let self_size: (usize, usize) = self.get_size();
        let operand_size: (usize, usize) = rhs.get_size();
        if self_size == operand_size {
            let self_height: usize = self_size.0;
            let mut output: Matrix = Matrix::with_size(self_size);
            for row in 0..self_height {
                output[row] = self[row].clone() - rhs[row].clone();
            }
            output
        } else {
            panic!("Mismatching sizes for matrix - matrix.")
        }
    }
}

impl Sub<f32> for Matrix {
    type Output = Matrix;

    fn sub(self, rhs: f32) -> Self::Output {
        let self_size: (usize, usize) = self.get_size();
        let self_height: usize = self_size.0;
        let self_width: usize = self_size.1;
        let mut output: Matrix = Matrix::with_size(self_size);
        for row in 0..self_height {
            for col in 0..self_width {
                output[row][col] = self[row][col] - rhs;
            }
        }
        output
    }
}

impl Sub<Matrix> for f32 {
    type Output = Matrix;

    fn sub(self, rhs: Matrix) -> Self::Output {
        let operand_size: (usize, usize) = rhs.get_size();
        let operand_height: usize = operand_size.0;
        let operand_width: usize = operand_size.1;
        let mut output: Matrix = Matrix::with_size(operand_size);
        for row in 0..operand_height {
            for col in 0..operand_width {
                output[row][col] = self - rhs[row][col];
            }
        }
        output
    }
}

impl SubAssign<Matrix> for Matrix {
    fn sub_assign(&mut self, rhs: Matrix) {
        for row in 0..self.get_height() {
            self[row] = self[row].clone() - rhs[row].clone();
        }
    }
}
//endregion

//region Multiplication
impl Mul<Matrix> for Matrix {
    type Output = Matrix;

    fn mul(self, rhs: Matrix) -> Self::Output {
        let self_width: usize = self.get_width();
        let operand_height: usize = rhs.get_height();

        if self_width == operand_height {
            let self_height: usize = self.get_height();
            let operand_width: usize = rhs.get_width();

            let mut output: Matrix = Matrix::with_size((self_height, operand_width));

            for self_out_row in 0..self_height {
                for operand_out_col in 0..operand_width {
                    for self_col_operand_row in 0..self_width {
                        output[self_out_row][operand_out_col] += self[self_out_row]
                            [self_col_operand_row]
                            * rhs[self_col_operand_row][operand_out_col];
                    }
                }
            }
            output
        } else {
            panic!("Mismatching dimensions for matrix * matrix.");
        }
    }
}

impl Mul<f32> for Matrix {
    type Output = Matrix;

    fn mul(self, rhs: f32) -> Self::Output {
        let self_height: usize = self.get_height();
        let self_width: usize = self.get_width();
        let mut output = Matrix::with_size((self_height, self_width));
        for row in 0..self_height {
            for col in 0..self_width {
                output[row][col] = rhs * self[row][col];
            }
        }
        output
    }
}

impl Mul<Matrix> for f32 {
    type Output = Matrix;

    fn mul(self, rhs: Matrix) -> Self::Output {
        rhs * self
    }
}

impl Mul<Vector> for Matrix {
    type Output = Vector;

    fn mul(self, rhs: Vector) -> Self::Output {
        let self_width: usize = self.get_width();
        let operand_length: usize = rhs.get_length();
        if self_width == operand_length {
            let self_height: usize = self.get_height();
            let mut output = Vector::with_length(self_height);
            for row in 0..self_height {
                output[row] = self[row].clone() * rhs.clone();
            }
            output
        } else {
            panic!("Mismatching dimensions for matrix * vector.");
        }
    }
}
//endregion

//endregion
