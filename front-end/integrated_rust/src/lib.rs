use wasm_bindgen::prelude::*;
use js_sys::Array;
use web_sys::console;
// use neon::prelude::*;
use std::collections::HashMap;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
pub fn say(s: String) -> String {
  let r = String::from("hello ");
  return r + &s;
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

// #[wasm_bindgen]
// pub struct Dummy {}

#[wasm_bindgen]
pub fn return_song_vectors() -> Array {
    let dummies: Vec<f32> = vec![12.0, 3.0, 5.0];
    dummies.into_iter().map(JsValue::from).collect()
}

#[derive(Serialize, Deserialize)]
pub struct Example {
    pub field1: HashMap<u32, String>,
    pub field2: Vec<Vec<f32>>,
    pub field3: [f32; 4],
}

#[wasm_bindgen]
pub fn send_example_to_js() -> JsValue {
    let mut field1 = HashMap::new();
    field1.insert(0, String::from("ex"));
    let example = Example {
        field1,
        field2: vec![vec![1., 2.], vec![3., 4.]],
        field3: [1., 2., 3., 4.]
    };

    JsValue::from_serde(&example).unwrap()
}

#[wasm_bindgen]
pub fn send_vec_just_numbers() -> JsValue {
    let example: Vec<Vec<u32>> = vec![vec![22, 22], vec![25, 30]];

    JsValue::from_serde(&example).unwrap()
}

#[derive(Debug)]
pub struct Song {
    pub tracks: Vec<Track>,
}

#[derive(Debug)]
pub struct Track {
    pub notes: Vec<f32>,
    pub volumes: Vec<f32>,
    pub offsets: Vec<f32>,
}


#[wasm_bindgen]
pub fn receive_example_from_js(val: &JsValue) {
    let example: Vec<Vec<f32>> = val.into_serde().unwrap();
    // console::log_1(&example.into());
    console::log_1(&example[0][0].into());

    let mut notes: Vec<f32> = vec![]; 
    let mut volumes: Vec<f32> = vec![]; 
    let offsets: Vec<f32> = vec![]; 

    for event in example {
        notes.push(event[0]);
        volumes.push(event[0]);
    }

    let track = Track {
        notes: notes,
        volumes: volumes, 
        offsets: offsets
    }; 

    let song = Song { tracks: vec![track] };

    console::log_1(&song.tracks[0].volumes[0].into());
}

#[wasm_bindgen]
pub fn process_file(fileData: &[u8]) {
    let real_midi_file = fileData.to_vec(); 
}
