#[cfg(test)]
use crate::matrix::Matrix;
#[cfg(test)]
use crate::vector::Vector;

#[cfg(test)]
mod tests {
    use super::*;

    //region Test vectors

    //region Outputting functions
    #[test]
    fn test_vector_sum() {
        assert_eq!(Vector::from_vec(vec![3.0, 2.0, 7.0]).sum(), 12.0);

        assert_ne!(Vector::from_vec(vec![4.0, 1.0, 5.0]).sum(), 7.0);
    }

    #[test]
    fn test_vector_arg_max() {
        assert_eq!(
            Vector::from_vec(vec![3.0, 2.0, 7.0]).arg_max(),
            2.0 as usize
        );

        assert_ne!(
            Vector::from_vec(vec![5.0, 1.0, 3.0]).arg_max(),
            1.0 as usize
        );
    }
    //endregion

    //region Producing functions
    #[test]
    fn test_vector_exp() {
        assert_eq!(
            Vector::from_vec(vec![3.0, 2.0, 7.0]).exp(),
            Vector::from_vec(vec![3.0_f32.exp(), 2.0_f32.exp(), 7.0_f32.exp()])
        );
    }

    #[test]
    fn test_vector_re_lu() {
        assert_eq!(
            Vector::from_vec(vec![-2.0, 0.6, 10.0]).re_lu(),
            Vector::from_vec(vec![0.0, 0.6, 10.0])
        );
    }

    #[test]
    fn test_vector_tanh() {
        assert_eq!(
            Vector::from_vec(vec![3.0, 2.0, 7.0]).tanh(),
            Vector::from_vec(vec![3.0_f32.tanh(), 2.0_f32.tanh(), 7.0_f32.tanh()])
        );
    }

    #[test]
    fn test_vector_t() {
        assert_eq!(
            Vector::from_vec(vec![3.0, 2.0, 7.0]).t(),
            Matrix::from_vecs(vec![vec![3.0, 2.0, 7.0]])
        );

        assert_ne!(
            Vector::from_vec(vec![6.0, 1.0, 5.0]).t(),
            Matrix::from_vecs(vec![vec![1.0, 5.0, 6.0]])
        );
    }
    //endregion

    //region Operators

    //region Addition
    #[test]
    fn test_vector_add() {
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
    fn test_vector_plus_f32() {
        assert_eq!(
            Vector::from_vec(vec![1.0, 3.0, 5.0]) + 1.0,
            Vector::from_vec(vec![2.0, 4.0, 6.0])
        );

        assert_ne!(
            Vector::from_vec(vec![1.0, 5.0, 15.0]) + 2.0,
            Vector::from_vec(vec![3.0, 4.0, 17.0])
        );
    }

    #[test]
    fn test_f32_plus_vector() {
        assert_eq!(
            1.0 + Vector::from_vec(vec![1.0, 3.0, 5.0]),
            Vector::from_vec(vec![2.0, 4.0, 6.0])
        );

        assert_ne!(
            2.0 + Vector::from_vec(vec![1.0, 5.0, 15.0]),
            Vector::from_vec(vec![3.0, 4.0, 17.0])
        );
    }

    #[test]
    fn test_vector_add_assign() {
        let mut vector1: Vector = Vector::from_vec(vec![1.0, 3.0, 5.0]);
        let vector2: Vector = Vector::from_vec(vec![1.0, 3.0, 5.0]);
        vector1 += vector2;
        assert_eq!(vector1, Vector::from_vec(vec![2.0, 6.0, 10.0]));

        assert_ne!(vector1, Vector::from_vec(vec![2.0, 6.0, 12.0]));
    }
    //endregion

    //region Subtraction
    #[test]
    fn test_vec_sub() {
        assert_eq!(
            Vector::from_vec(vec![1.0, 3.0, 5.0]) - Vector::from_vec(vec![1.0, 3.0, 5.0]),
            Vector::from_vec(vec![0.0, 0.0, 0.0])
        );

        assert_ne!(
            Vector::from_vec(vec![1.0, 5.0, 16.0]) - Vector::from_vec(vec![1.0, 2.0, 2.0]),
            Vector::from_vec(vec![0.0, 3.0, 18.0])
        );
    }

    #[test]
    fn test_vector_minus_f32() {
        assert_eq!(
            Vector::from_vec(vec![1.0, 3.0, 5.0]) - 1.0,
            Vector::from_vec(vec![0.0, 2.0, 4.0])
        );

        assert_ne!(
            Vector::from_vec(vec![1.0, 5.0, 15.0]) - 2.0,
            Vector::from_vec(vec![-1.0, 6.0, 13.0])
        );
    }

    #[test]
    fn test_f32_minus_vector() {
        assert_eq!(
            1.0 - Vector::from_vec(vec![1.0, 3.0, 5.0]),
            Vector::from_vec(vec![0.0, -2.0, -4.0])
        );

        assert_ne!(
            2.0 - Vector::from_vec(vec![1.0, 5.0, 15.0]),
            Vector::from_vec(vec![1.0, -3.0, -11.0])
        );
    }

    #[test]
    fn test_vector_sub_assign() {
        let mut vector1: Vector = Vector::from_vec(vec![1.0, 3.0, 5.0]);
        let vector2: Vector = Vector::from_vec(vec![1.0, 3.0, 5.0]);
        vector1 -= vector2;
        assert_eq!(vector1, Vector::from_vec(vec![0.0, 0.0, 0.0]));

        assert_ne!(vector1, Vector::from_vec(vec![2.0, 6.0, 12.0]));
    }
    //endregion

    //region Multiplication
    #[test]
    fn test_vector_mul() {
        // Dot product
        assert_eq!(
            Vector::from_vec(vec![2.0, 4.0, 3.0]) * Vector::from_vec(vec![1.0, 2.0, 5.0]),
            25.0
        );

        assert_eq!(
            Vector::from_vec(vec![15.0, 1.0, 2.0]) * Vector::from_vec(vec![2.0, 3.0, 1.0]),
            35.0
        );

        assert_ne!(
            Vector::from_vec(vec![8.0, 3.0, 2.0]) * Vector::from_vec(vec![7.0, 9.0, 1.0]),
            80.0
        )
    }

    #[test]
    fn test_vector_mul_f32() {
        assert_eq!(
            Vector::from_vec(vec![2.0, 4.0, 3.0]) * 3.0,
            Vector::from_vec(vec![6.0, 12.0, 9.0])
        );

        assert_ne!(
            Vector::from_vec(vec![6.0, 2.0, 3.0]) * 2.0,
            Vector::from_vec(vec![11.0, 3.0, 6.0])
        );
    }

    #[test]
    fn test_f32_mul_vector() {
        assert_eq!(
            3.0 * Vector::from_vec(vec![2.0, 4.0, 3.0]),
            Vector::from_vec(vec![6.0, 12.0, 9.0])
        );

        assert_ne!(
            2.0 * Vector::from_vec(vec![6.0, 2.0, 3.0]),
            Vector::from_vec(vec![11.0, 3.0, 6.0])
        );
    }

    #[test]
    fn test_vector_mul_matrix() {
        assert_eq!(
            Vector::from_vec(vec![2.0, 4.0, 3.0]) * Matrix::from_vecs(vec![vec![5.0, 2.0, 3.0]]),
            Matrix::from_vecs(vec![
                vec![10.0, 4.0, 6.0],
                vec![20.0, 8.0, 12.0],
                vec![15.0, 6.0, 9.0],
            ])
        );

        assert_ne!(
            Vector::from_vec(vec![5.0, 1.0, 8.0]) * Matrix::from_vecs(vec![vec![7.0, 1.0, 5.0]]),
            Matrix::from_vecs(vec![
                vec![35.0, 5.0, 25.0],
                vec![7.0, 8.0, 5.0],
                vec![15.0, 6.0, 41.0],
            ])
        );
    }
    //endregion

    //endregion Operators

    //endregion Test vectors

    //region Test matrices

    //region Getters
    #[test]
    fn test_matrix_get_column() {
        assert_eq!(
            Matrix::from_vecs(vec![
                vec![9.0, 3.0, 12.0, -5.0],
                vec![-4.0, 7.0, 1.0, 8.0],
                vec![2.0, 6.0, 10.0, -3.0],
            ])
            .get_column_vector(2),
            Vector::from_vec(vec![12.0, 1.0, 10.0])
        );
    }
    //endregion Getters

    //region Outputting functions
    #[test]
    fn test_matrix_sum() {
        assert_eq!(
            Matrix::from_vecs(vec![
                vec![9.0, 3.0, 12.0, -5.0],
                vec![-4.0, 7.0, 1.0, 8.0],
                vec![2.0, 6.0, 10.0, -3.0],
            ])
            .sum(),
            46.0
        );
    }
    //endregion

    //region Producing functions
    #[test]
    fn test_matrix_clamp() {
        let input = Matrix::from_vecs(vec![vec![1.0, 5.0], vec![3.0, 15.0]]);
        let output = Matrix::from_vecs(vec![vec![2.0, 5.0], vec![3.0, 7.0]]);
        assert_eq!(input.clamp(2.0, 7.0), output)
    }

    #[test]
    fn test_matrix_t() {
        assert_eq!(
            Matrix::from_vecs(vec![
                vec![4.0, 12.0, 6.0],
                vec![8.0, 1.0, 3.0],
                vec![2.0, 11.0, 9.0],
            ])
            .t(),
            Matrix::from_vecs(vec![
                vec![4.0, 8.0, 2.0],
                vec![12.0, 1.0, 11.0],
                vec![6.0, 3.0, 9.0],
            ])
        );
    }

    #[test]
    fn test_matrix_flatten() {
        assert_eq!(
            Matrix::from_vecs(vec![
                vec![4.0, 12.0, 3.0, 4.0],
                vec![8.0, 1.0, 5.0, -6.0],
                vec![-2.0, 9.0, 7.0, 11.0],
            ]).flatten_2d(),
            Vector::from_vec(vec![4.0, 12.0, 3.0, 4.0, 8.0, 1.0, 5.0, -6.0, -2.0, 9.0, 7.0, 11.0])
        );
    }
    //endregion

    //region Operators

    //region Addition
    #[test]
    fn test_matrix_add() {
        let a = Matrix::from_vecs(vec![vec![1.0, 5.0], vec![3.0, 15.0]]);
        let b = Matrix::from_vecs(vec![vec![2.0, 3.0], vec![2.0, 1.0]]);
        let output = Matrix::from_vecs(vec![vec![3.0, 8.0], vec![5.0, 16.0]]);
        assert_eq!(a + b, output);
    }

    #[test]
    fn test_matrix_plus_f32() {
        assert_eq!(
            Matrix::from_vecs(vec![vec![3.0, 6.0], vec![-2.0, 8.0]]) + 1.0,
            Matrix::from_vecs(vec![vec![4.0, 7.0], vec![-1.0, 9.0]])
        );
    }

    #[test]
    fn test_f32_plus_matrix() {
        assert_eq!(
            5.0 + Matrix::from_vecs(vec![vec![3.0, 6.0], vec![-2.0, 8.0]]),
            Matrix::from_vecs(vec![vec![8.0, 11.0], vec![3.0, 13.0]])
        );
    }

    #[test]
    fn test_matrix_add_assign() {
        let mut matrix1: Matrix = Matrix::from_vecs(vec![vec![3.0, -5.0], vec![-7.0, 6.0]]);
        let matrix2: Matrix = Matrix::from_vecs(vec![vec![4.0, 8.0], vec![-2.0, 9.0]]);
        matrix1 += matrix2;
        assert_eq!(
            matrix1,
            Matrix::from_vecs(vec![vec![7.0, 3.0], vec![-9.0, 15.0],])
        );

        assert_ne!(
            matrix1,
            Matrix::from_vecs(vec![vec![7.0, 2.0], vec![3.0, 14.0],])
        );
    }
    //endregion

    //region Subtraction
    #[test]
    fn test_matrix_sub() {
        let a = Matrix::from_vecs(vec![vec![1.0, 5.0], vec![3.0, 15.0]]);
        let b = Matrix::from_vecs(vec![vec![2.0, 3.0], vec![2.0, 1.0]]);
        let output = Matrix::from_vecs(vec![vec![-1.0, 2.0], vec![1.0, 14.0]]);
        assert_eq!(a - b, output);
    }

    #[test]
    fn test_matrix_minus_f32() {
        assert_eq!(
            Matrix::from_vecs(vec![vec![3.0, 6.0], vec![-2.0, 8.0]]) - 1.0,
            Matrix::from_vecs(vec![vec![2.0, 5.0], vec![-3.0, 7.0]])
        );
    }

    #[test]
    fn test_f32_minus_matrix() {
        assert_eq!(
            5.0 - Matrix::from_vecs(vec![vec![3.0, 6.0], vec![-2.0, 8.0]]),
            Matrix::from_vecs(vec![vec![2.0, -1.0], vec![7.0, -3.0]])
        );
    }

    #[test]
    fn test_matrix_sub_assign() {
        let mut matrix1: Matrix = Matrix::from_vecs(vec![vec![3.0, -5.0], vec![-7.0, 6.0]]);
        let matrix2: Matrix = Matrix::from_vecs(vec![vec![4.0, 8.0], vec![-2.0, 9.0]]);
        matrix1 -= matrix2;
        assert_eq!(
            matrix1,
            Matrix::from_vecs(vec![vec![-1.0, -13.0], vec![-5.0, -3.0],])
        );

        assert_ne!(
            matrix1,
            Matrix::from_vecs(vec![vec![-1.0, 4.0], vec![-13.0, 2.0],])
        );
    }
    //endregion

    //region Multiplication
    #[test]
    fn test_matrix_mul() {
        let a: Matrix = Matrix::from_vecs(vec![vec![1.0, 5.0, 4.0], vec![3.0, 15.0, -7.0]]);
        let b: Matrix = Matrix::from_vecs(vec![vec![2.0, 3.0], vec![4.0, -1.0], vec![-5.0, 8.0]]);
        let output: Matrix = Matrix::from_vecs(vec![vec![2.0, 30.0], vec![101.0, -62.0]]);
        assert_eq!(a * b, output);
    }

    #[test]
    fn test_matrix_mult_f32() {
        assert_eq!(
            Matrix::from_vecs(vec![
                vec![1.0, 5.0, 3.0],
                vec![-7.0, 6.0, 11.0],
                vec![5.0, 9.0, -13.0],
                vec![1.0, 8.0, 10.0]
            ]) * 2.0,
            Matrix::from_vecs(vec![
                vec![2.0, 10.0, 6.0],
                vec![-14.0, 12.0, 22.0],
                vec![10.0, 18.0, -26.0],
                vec![2.0, 16.0, 20.0]
            ])
        );
    }

    #[test]
    fn test_f32_mult_matrix() {
        assert_eq!(
            3.0 * Matrix::from_vecs(vec![
                vec![1.0, 5.0, 3.0],
                vec![-7.0, 6.0, 11.0],
                vec![5.0, 9.0, -13.0],
                vec![1.0, 8.0, 10.0]
            ]),
            Matrix::from_vecs(vec![
                vec![3.0, 15.0, 9.0],
                vec![-21.0, 18.0, 33.0],
                vec![15.0, 27.0, -39.0],
                vec![3.0, 24.0, 30.0],
            ])
        );
    }

    #[test]
    fn test_matrix_mult_vector() {
        let vector: Vector = Vector::from_vec(vec![4.0, -2.0, 1.0, 5.0]);
        let matrix: Matrix = Matrix::from_vecs(vec![
            vec![4.0, 1.0, -2.0, 12.0],
            vec![-7.0, 6.0, 11.0, -3.0],
            vec![5.0, 9.0, -13.0, 7.0],
            vec![1.0, 8.0, 10.0, 2.0],
        ]);
        let output: Vector = Vector::from_vec(vec![72.0, -44.0, 24.0, 8.0]);
        assert_eq!(matrix * vector, output)
    }
    //endregion

    //endregion Operators

    //endregion Test matrices
}
