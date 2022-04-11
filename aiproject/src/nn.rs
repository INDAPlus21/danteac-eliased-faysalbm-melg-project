use crate::matrix::Matrix;
use crate::vector::Vector;
use std::collections::VecDeque;

// Based on https://www.analyticsvidhya.com/blog/2019/01/fundamentals-deep-learning-recurrent-neural-networks-scratch-python/
const learning_rate: f32 = 0.0001; // How quick does the weights update every iteration
const iterations: i8 = 25; // Amount of times to go through entire data
const hidden_dimensions: usize = 100; // Amount of hidden layers
const sequence_length: usize = 10;

const truncated_bptt_steps: usize = 5; // Tructated backwards propagation through time steps
const min_clip_value: f32 = -10.0;
const max_clip_value: f32 = 10.0;

pub struct NeuralNetwork {
    input_weights: Matrix,
    hidden_weights: Matrix,
    output_weights: Vector,
}

impl NeuralNetwork {
    pub fn new() -> NeuralNetwork {
        NeuralNetwork {
            input_weights: Matrix::with_random(sequence_length, hidden_dimensions),
            hidden_weights: Matrix::with_random(hidden_dimensions, hidden_dimensions),
            output_weights: Vector::with_random(hidden_dimensions),
        }
    }

    pub fn train(&mut self, sequence: &VecDeque<f32>, label: f32) {
        //let loss = 0.0;
        println!("{:?}", sequence);
        // Forward pass
        //let sequence_vec = Vector::from_vec(Vec::from(sequence.as_slices().0)); // Convert deque to vector
        // Save for use in backwards propagation
        let mut multiplication_output = 0.0;
        let mut add = Vector::with_size(sequence.len());
        let mut multiplication_input = Vector::with_size(hidden_dimensions);
        let mut multiplication_hidden = Vector::with_size(hidden_dimensions);

        // Save previous s values
        let mut layers: Vec<SHistory> = vec![];
        let mut previous_s = Vector::with_size(hidden_dimensions);
        // Forward pass
        for t in 0..sequence.len() {
            // Create input vector with only input of current t
            let mut input = Vector::with_size(sequence.len());
            input[t] = sequence[t];
            // Multiply with matrixes
            multiplication_input = self.input_weights.to_owned() * input;
            multiplication_hidden = self.hidden_weights.to_owned() * previous_s.clone();
            add = multiplication_input + multiplication_hidden;
            // Squeeze to prevent huge values
            let s = sigmoid_squeeze(&add);
            // Multiply with output weights
            multiplication_output = self.output_weights.to_owned() * s.to_owned();
            // Save history for backwards propagation
            layers.push(SHistory {
                s: s.clone(),
                previous_s: previous_s.clone(),
            });
            previous_s = s;
        }

        let loss_per_record = (label - multiplication_output).powf(2.0) / 2.0;
        println!("LOSS {}", loss_per_record);
        //println!("LAYERS {:?}", layers);

        // Save change in weights
        let mut delta_input_weights = Matrix::with_size_tuple(self.input_weights.get_size());
        let mut delta_hidden_weights = Matrix::with_size_tuple(self.hidden_weights.get_size());
        let mut delta_output_weights = Vector::with_size(self.output_weights.get_length());

        let mut delta_input_weights_t = Matrix::with_size_tuple(self.input_weights.get_size());
        let mut delta_hidden_weights_t = Matrix::with_size_tuple(self.hidden_weights.get_size());
        let mut delta_output_weights_t = Vector::with_size(self.output_weights.get_length());

        let mut delta_input_weights_i = Vector::with_size(sequence.len());
        let mut delta_hidden_weights_i = Vector::with_size(hidden_dimensions);
        // Backwards pass (through time)
        // Go through x steps back in sequence instead of entire sequence
        // Uses gradient descent
        /*Scalar*/
        let delta_multiplication_output = multiplication_output - label;

        for t in 0..sequence.len() {
            /*Vec*/
            delta_output_weights_t = layers[t].s.to_owned() * delta_multiplication_output;
            /*Vec*/
            let delta_s_output = self.output_weights.to_owned() * delta_multiplication_output;
            /*Vec*/
            let mut delta_s = delta_s_output;
            /*Vec*/
            let delta_add = delta_s * (add * add.one_minus());
            /*Scalar*/
            let delta_multiplication_hidden =
                delta_add * Vector::with_value(self.hidden_weights.get_width(), 1.0);
            /*Scalar*/
            let delta_multiplication_input =
                delta_add * Vector::with_value(self.input_weights.get_width(), 1.0);
            /*Matrix*/
            let delta_previous_s = self.hidden_weights.to_owned() * delta_multiplication_hidden;
            // TODO: make sure loop uses correct indexes
            for i in (t..=0.max(t - truncated_bptt_steps)).rev() {
                /*Vec (Fix)*/
                delta_s = (delta_previous_s + delta_s_output).flatten_2d();
                /*Scalar*/
                delta_add = add * (delta_s * add.one_minus());
                /*Scalar*/
                delta_multiplication_hidden =
                    delta_add * Vector::with_value(multiplication_hidden.get_length(), 1.0);
                /*Scalar*/
                delta_multiplication_input =
                    delta_add * Vector::with_value(multiplication_input.get_length(), 1.0);
                // Fix
                delta_hidden_weights_i = self.hidden_weights * layers[t].previous_s.to_owned();
                /*Matrix*/
                delta_previous_s = self.hidden_weights * delta_multiplication_hidden;
                /*Vec*/
                let mut input = Vector::with_size(sequence.len());
                input[t] = sequence[t];
                // Fix
                delta_input_weights_i = self.input_weights * input;
                /*Matrix*/
                //let delta_x = self.input_weights * delta_multiplication_input;
                delta_input_weights_t += delta_input_weights_i;
                delta_hidden_weights_t += delta_hidden_weights_i;
            }

            // Apply new weights to delta weights
            delta_input_weights += delta_hidden_weights_t;
            delta_hidden_weights += delta_hidden_weights_t;
            delta_output_weights += delta_output_weights_t;
        }

        // Clamp values to avoid exploding gradient problem
        delta_input_weights = delta_input_weights.clamp(min_clip_value, max_clip_value);
        delta_hidden_weights = delta_hidden_weights.clamp(min_clip_value, max_clip_value);
        delta_output_weights = delta_output_weights.clamp(min_clip_value, max_clip_value);

        // Update weights
        self.input_weights -= delta_input_weights * learning_rate;
        self.hidden_weights -= delta_hidden_weights * learning_rate;
        self.output_weights -= delta_output_weights * learning_rate;
        // TODO: Clamp finished weights?
    }

    // Predicts next element in the sequence
    pub fn get_prediction(&mut self, sequence: &VecDeque<f32>) -> f32 {
        let mut previous_s = Vector::with_size(hidden_dimensions);
        let mut multiplication_output = 0.0;
        let input = Vector::from_vec(sequence.to_owned().as_mut_slices().0.to_vec());

        // Forward pass
        for _ in 0..sequence.len() {
            // Multiply with matrices
            let multiplication_input = self.input_weights.to_owned() * input.to_owned();
            let multiplication_hidden = self.hidden_weights.to_owned() * previous_s;
            let add = multiplication_input + multiplication_hidden;
            // Squeeze
            let s = sigmoid_squeeze(&add);
            multiplication_output = self.output_weights.to_owned() * s.to_owned();
            previous_s = s;
        }

        // Return output
        multiplication_output
    }
}

// Squeezes values to limit extremely large values without just cutting off
pub fn sigmoid_squeeze(values: &Vector) -> Vector {
    let mut output = Vector::with_size(values.get_length());
    for value in 0..values.get_length() {
        output[value] = 1.0 / (1.0 + (-values[value]).exp());
    }

    output
}

#[derive(Debug)]
pub struct SHistory {
    s: Vector,
    previous_s: Vector,
}
