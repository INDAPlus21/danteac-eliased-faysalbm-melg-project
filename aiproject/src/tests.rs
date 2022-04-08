use crate::matrix::Matrix;
use crate::vector::Vector;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vec_add() {
        assert_eq!(
            Vector::from_vec(vec![1.0, 3.0, 5.0]) + (Vector::from_vec(vec![1.0, 3.0, 5.0])),
            Vector::from_vec(vec![2.0, 6.0, 10.0])
        );

        assert_ne!(
            Vector::from_vec(vec![1.0, 5.0, 15.0]) + (Vector::from_vec(vec![1.0, 2.0, 2.0])),
            Vector::from_vec(vec![2.0, 10.0, 17.0])
        );
    }

    #[test]
    fn test_vec_dot() {
        assert_eq!(
            Vector::from_vec(vec![2.0, 4.0, 3.0]) * (Vector::from_vec(vec![1.0, 2.0, 5.0])),
            25.0
        );

        assert_eq!(
            Vector::from_vec(vec![15.0, 1.0, 2.0]) * (Vector::from_vec(vec![2.0, 3.0, 1.0])),
            35.0
        );
    }

    #[test]
    fn test_matrix_vector_mult() {
        let vector = Vector::from_vec(vec![2.0, 3.0, 4.0, 5.0]);
        let matrix = Matrix::from_vecs(vec![
            vec![1.0, 2.0, 3.0],
            vec![4.0, 5.0, 6.0],
            vec![1.0, 4.0, 2.0],
            vec![2.0, 5.0, 3.0],
        ]);
        let output = Vector::from_vec(vec![28.0, 60.0, 47.0]);
        assert_eq!(matrix * vector, output)
    }
}
