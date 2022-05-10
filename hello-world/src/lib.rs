use wasm_bindgen::prelude::*;
use js_sys::Array;
use web_sys::console;
// use neon::prelude::*;
use std::collections::HashMap;
use serde::{Serialize, Deserialize};
use midiparser::parse_midi;
use midiparser::convert_to_front_end_format;

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

    parse_midi("musemario");
}

/* #[derive(Debug)]
#[derive(Serialize, Deserialize)]
pub enum Thing {
    String(String),
    Number(f32)
}

#[wasm_bindgen]
pub fn send_complex_vec() -> JsValue {
    let example: Vec<Vec<f32>> = vec![vec![Thing::String("Hello".to_string()), Thing::Number(12.0)], vec![Thing::String("Hello".to_string()), Thing::Number(12.0)]];

    JsValue::from_serde(&example).unwrap()
} */


/* #[wasm_bindgen]
pub fn receive_midi(array: Array) {
    // let rust_vec: Vec<f32> = &array.into_iter().map(|x| x.as_f64().unwrap()).collect();

    // let iterator = js_sys::try_iter(&array).map(|x| x.unwrap());

    // console::log_1(&array.into());
}

 */
/* #[derive(Debug)]2
pub enum Thing {
    Number(f32),
    String(String)
}

pub fn convert_to_front_end_format() -> Array {
    
    let hash_notes = HashMap::from([
        (127, "G9"),( 126, "Gb9"),( 125, "F9"),( 124, "E9"),( 123, "Eb9"),( 122, "D9"),( 121, "Db9"),( 120, "C9"),( 119, "B8"),( 118, "Bb8"),( 117, "A8	 "),( 116, "Ab8"),( 115, "G8"),( 114, "Gb8"),( 113, "F8"),( 112, "E8"),( 111, "Eb8"),( 110, "D8"),( 109, "Db8"),( 108, "C8"),( 107, "B7"),( 106, "Bb7"),( 105, "A7"),( 104, "Ab7"),( 103, "G7"),( 102, "Gb7"),( 101, "F7"),( 100, "E7"),( 99, "Eb7"),( 98, "D7"),( 97, "Db7"),( 96, "C7"),( 95, "B6"),( 94, "Bb6"),( 93, "A6"),( 92, "Ab6"),( 91, "G6"),( 90, "Gb6"),( 89, "F6"),( 88, "E6"),( 87, "Eb6"),( 86, "D6"),( 85, "Db6"),( 84, "C6"),( 83, "B5"),( 82, "Bb5"),( 81, "A5"),( 80, "Ab5"),( 79, "G5"),( 78, "Gb5"),( 77, "F5"),( 76, "E5"),( 75, "Eb5"),( 74, "D5"),( 73, "Db5"),( 72, "C5"),( 71, "B4"),( 70, "Bb4"),( 69, "A4"),( 68, "Ab4"),( 67, "G4"),( 66, "Gb4"),( 65, "F4"),( 64, "E4"),( 63, "Eb4"),( 62, "D4"),( 61, "Db4"),( 60, "C4"),( 59, "B3"),( 58, "Bb3"),( 57, "A3"),( 56, "Ab3"),( 55, "G3"),( 54, "Gb3"),( 53, "F3"),( 52, "E3"),( 51, "Eb3"),( 50, "D3"),( 49, "Db3"),( 48, "C3"),( 47, "B2"),( 46, "Bb2"),( 45, "A2"),( 44, "Ab2"),( 43, "G2"),( 42, "Gb2"),( 41, "F2"),( 40, "E2"),( 39, "Eb2"),( 38, "D2"),( 37, "Db2"),( 36, "C2"),( 35, "B1"),( 34, "Bb1"),( 33, "A1"),( 32, "Ab1"),( 31, "G1"),( 30, "Gb1"),(
        29, "F1"),( 28, "E1"),( 27, "Eb1"),( 26, "D1"),( 25, "Db1"),( 24, "C1"),( 23, "B0"),( 22, "Bb0"),( 21, "A0"),( 20, "Ab"),( 19, "G"),( 18, "Gb"),( 17, "F"),( 16, "E"),( 15, "Eb"),( 14, "D"),( 13, "C#"),( 12, "C0"),( 11, "B"),( 10, "Bb"),( 9, "A"),( 8, "Ab"),( 7, "G"),( 6, "Gb"),( 5, "F"),( 4, "E"),( 3, "Eb"),( 2, "D"),( 1, "C#"),( 0, "C-1") 
    ]);

    hash_notes.into_iter().map(JsValue::from).collect()

    /* let mut note_offsets = vec![]; 
    /* for (i, note) in song.tracks[0].notes.iter().enumerate() {
        println!("{}", i);
        note_offsets.push(vec![note); 
    } */

    let track = &song.tracks[1];
    for i in 0..track.notes.len() {
        // println!("{}", i);
        let note = hash_notes[&(track.notes[i] as i32)];
        let to_push = vec![Thing::String(note.to_string()), Thing::Number(track.offsets[i])];
        note_offsets.push(to_push);
    }

    return note_offsets //vec![vec![12 as f32]]; */
} */

/* // The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
use wasm_bindgen::prelude::*;
// extern crate serde_json;
extern crate wasm_bindgen;
use web_sys::console;
extern crate console_error_panic_hook;
// use std::collections::HashMap;

// #[macro_use]
// extern crate serde_derive;
use serde_wasm_bindgen; 

// Our Add function
// wasm-pack requires "exported" functions
// to include #[wasm_bindgen]
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

#[wasm_bindgen]
pub fn subtract(a: i32, b: i32) -> i32 {
    return a - b;
}

#[wasm_bindgen]
pub fn return_string() -> String {
    String::from("hello") 
}

#[wasm_bindgen]
pub fn return_js_value() -> JsValue {
    JsValue::NULL
}

/* #[derive(Serialize, Deserialize)]
pub struct Example {
    pub field1: HashMap<u32, String>,
    pub field2: Vec<Vec<f32>>,
    pub field3: [f32; 4],
}

#[wasm_bindgen]
pub fn receive_example_from_js(val: &JsValue) {
    console_error_panic_hook::set_once();

    let example: Example = val.into_serde().unwrap();

    /*     let js: JsValue = example.into();
       console::log_2(&"Logging arbitrary values looks like".into(), &js);
    */
} */

/* #[wasm_bindgen]
pub fn pass_value_to_js() -> Result<(), JsValue> {
	let some_supported_rust_value = ("Hello, world!", 42);
	let js_value = serde_wasm_bindgen::to_value(&some_supported_rust_value)?;
	
	Ok(())
}

#[wasm_bindgen]
pub fn get_value_from_js(value: JsValue) -> Result<(), JsValue> {
  console_error_panic_hook::set_once();

	let value: Vec<f32> = serde_wasm_bindgen::from_value(value)?;

  console::log_1(&"in get value from js".into());

  // let js: JsValue = value.into();
  // console::log_2(&"value: ".into(), &js);

	// ...
	Ok(())
} */


/* #[wasm_bindgen]
pub fn test(js_objects: &JsValue)  {
    console_error_panic_hook::set_once();

    console::log_1(&"in test".into());

    let elements: Vec<i32> = js_objects.into_serde().unwrap();

    console::log_1(&"after elements".into());
    /* elements
        .iter()
        .map(|e| {
            let id = e.id.parse::<i32>().unwrap_or(0);
            let parent_id = e.parent_id.parse::<i32>().unwrap_or(0);
            id + parent_id
        })
        .sum() */
} */

#[wasm_bindgen]
pub fn using_web_sys() {
    console::log_1(&"Hello using web-sys".into());

    let js: JsValue = 4.into();
    console::log_2(&"Logging arbitrary values looks like".into(), &js);
}
 */