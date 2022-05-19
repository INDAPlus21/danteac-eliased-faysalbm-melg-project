use js_sys::Array;
use wasm_bindgen::prelude::*;
use web_sys::console;
// use neon::prelude::*;
use midiparser::parse_midi;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use aiproject::NotesRNN;
// extern crate aiproject; 

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
        field3: [1., 2., 3., 4.],
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

// it's this that the AI wants in the end, has nothing to do with the midi parser
// and therefore unnecessary to have the song type here. but we need the song
// type... never in any communication with js? just in communication between the
// parser and the AI, and we of course still need the notes and volume arrays
// you create here
#[wasm_bindgen]
pub fn receive_notes(val: &JsValue) -> JsValue 
{
    let example: Vec<Vec<f32>> = val.into_serde().unwrap();
    // console::log_1(&example.into());
    console::log_1(&example[0][0].into());

    let mut notes: Vec<f32> = vec![];
    let mut volumes: Vec<f32> = vec![];
    let mut offsets: Vec<f32> = vec![];

    for event in example {
        notes.push(event[0]);
        offsets.push(event[1]);
    }
    
    // console::log_1(&notes[0].into());
    console::log_1(&JsValue::from_serde(&notes).unwrap());

    let mut notes_rnn: NotesRNN = NotesRNN::new(64);
    let generated_notes: Vec<f32> = notes_rnn.gen_notes(notes, 100); 

    return JsValue::from_serde(&generated_notes).unwrap(); // generated_notes.into() 

    /*  let track = Track {
        notes: notes,
        volumes: volumes,
        offsets: offsets
    };

    let song = Song { tracks: vec![track] }; */

    // let notes_rnn = Dante::NotesRNN::from_file("faysal-viktmatris.*")
    // let generated_notes = notes_rnn.generate_notes(notes)

    // let offset = Dante::OffsetRNN::from_file("faysal-viktmatris.*")
    // let generated_offsets = offset.generate_offsets(offsets)

    // return Vec<Vec<f32>>

    // .into_iter().map(JsValue::from).collect()
    // .into_iter().map(|x| x as u32).collect().into()
    // console::log_1(&notes[..].into());
    // ::Array()
    // let js_value : Array = notes.into(); 
    // console::log_1(&js_value);
    // console::log_1(notes.into_iter().map(JsValue::from).collect::<Array>().into());
}

#[wasm_bindgen]
pub fn process_send_ai(fileData: &[u8]) -> JsValue {
    console::log_1(&"hello send ai".into());

    let real_midi_file: Vec<u8> = fileData.to_vec();

    let song: midiparser::song::Song = parse_midi(real_midi_file).unwrap();

    let mut note_offsets: Vec<Vec<f32>> = vec![];
    let mut notes = vec![];

    let track = &song.tracks[1];
    for i in 0..track.notes.len() {
        let to_push = vec![track.notes[i], track.offsets[i]];
        note_offsets.push(to_push);
        if i < 10 {
            notes.push(track.notes[i] as f32)
        }
    }

    let mut notes_rnn: NotesRNN = NotesRNN::new(64);
    let generated_notes: Vec<f32> = notes_rnn.gen_notes(notes, 100); 

    return JsValue::from_serde(&generated_notes).unwrap();  
}

#[wasm_bindgen]
pub fn process_file(fileData: &[u8]) -> JsValue {
    console::log_1(&"hello process file".into());

    let real_midi_file: Vec<u8> = fileData.to_vec();
    console::log_1(&"hello real midi file".into());

    let song: midiparser::song::Song = parse_midi(real_midi_file).unwrap();

    console::log_1(&"hello parsed".into());

    // let front_end_format = convert_to_front_end_format(song);

    // console::log_1(&"hello front end format".into());

    let mut note_offsets: Vec<Vec<f32>> = vec![];

    let track = &song.tracks[1];
    for i in 0..track.notes.len() {
        // let note = hash_notes[&(track.notes[i] as i32)];
        let to_push = vec![track.notes[i], track.offsets[i]];
        note_offsets.push(to_push);
    }

    /* let mut notes: Vec<f32> = vec![];
    let mut volumes: Vec<f32> = vec![];
    let offsets: Vec<f32> = vec![];

    for event in example {
        notes.push(event[0]);
        offsets.push(event[1]);
    }

    send_to_ai(notes, offsets) */

    /* let mut note_offsets_two: Vec<Vec<f32>> = vec![];
    let track_two = &song.tracks[0];
    for i in 0..track_two.notes.len() {
        // let note = hash_notes[&(track.notes[i] as i32)];
        let to_push = vec![track.notes[i], track.offsets[i]];
        note_offsets.push(to_push);
    }  */

    /* let mut combined = vec![];

    combined.push(note_offsets);
    combined.push(note_offsets_two); */

    return JsValue::from_serde(&note_offsets).unwrap();
    // console::log_1(&song.tracks[0].volumes[0].into());
}

#[wasm_bindgen]
pub fn process_file_2(fileData: &[u8]) -> JsValue {
    console::log_1(&"hello 2".into());

    let real_midi_file: Vec<u8> = fileData.to_vec();

    let song: midiparser::song::Song = parse_midi(real_midi_file).unwrap();

    let mut note_offsets: Vec<Vec<f32>> = vec![];

    let track = &song.tracks[0];
    for i in 0..track.notes.len() {
        let to_push = vec![track.notes[i], track.offsets[i]];
        note_offsets.push(to_push);
    }

    return JsValue::from_serde(&note_offsets).unwrap();
}

/*  let hash_notes = HashMap::from([
    (127, "G9"),( 126, "Gb9"),( 125, "F9"),( 124, "E9"),( 123, "Eb9"),( 122, "D9"),( 121, "Db9"),( 120, "C9"),( 119, "B8"),( 118, "Bb8"),( 117, "A8	 "),( 116, "Ab8"),( 115, "G8"),( 114, "Gb8"),( 113, "F8"),( 112, "E8"),( 111, "Eb8"),( 110, "D8"),( 109, "Db8"),( 108, "C8"),( 107, "B7"),( 106, "Bb7"),( 105, "A7"),( 104, "Ab7"),( 103, "G7"),( 102, "Gb7"),( 101, "F7"),( 100, "E7"),( 99, "Eb7"),( 98, "D7"),( 97, "Db7"),( 96, "C7"),( 95, "B6"),( 94, "Bb6"),( 93, "A6"),( 92, "Ab6"),( 91, "G6"),( 90, "Gb6"),( 89, "F6"),( 88, "E6"),( 87, "Eb6"),( 86, "D6"),( 85, "Db6"),( 84, "C6"),( 83, "B5"),( 82, "Bb5"),( 81, "A5"),( 80, "Ab5"),( 79, "G5"),( 78, "Gb5"),( 77, "F5"),( 76, "E5"),( 75, "Eb5"),( 74, "D5"),( 73, "Db5"),( 72, "C5"),( 71, "B4"),( 70, "Bb4"),( 69, "A4"),( 68, "Ab4"),( 67, "G4"),( 66, "Gb4"),( 65, "F4"),( 64, "E4"),( 63, "Eb4"),( 62, "D4"),( 61, "Db4"),( 60, "C4"),( 59, "B3"),( 58, "Bb3"),( 57, "A3"),( 56, "Ab3"),( 55, "G3"),( 54, "Gb3"),( 53, "F3"),( 52, "E3"),( 51, "Eb3"),( 50, "D3"),( 49, "Db3"),( 48, "C3"),( 47, "B2"),( 46, "Bb2"),( 45, "A2"),( 44, "Ab2"),( 43, "G2"),( 42, "Gb2"),( 41, "F2"),( 40, "E2"),( 39, "Eb2"),( 38, "D2"),( 37, "Db2"),( 36, "C2"),( 35, "B1"),( 34, "Bb1"),( 33, "A1"),( 32, "Ab1"),( 31, "G1"),( 30, "Gb1"),(
    29, "F1"),( 28, "E1"),( 27, "Eb1"),( 26, "D1"),( 25, "Db1"),( 24, "C1"),( 23, "B0"),( 22, "Bb0"),( 21, "A0"),( 20, "Ab"),( 19, "G"),( 18, "Gb"),( 17, "F"),( 16, "E"),( 15, "Eb"),( 14, "D"),( 13, "C#"),( 12, "C0"),( 11, "B"),( 10, "Bb"),( 9, "A"),( 8, "Ab"),( 7, "G"),( 6, "Gb"),( 5, "F"),( 4, "E"),( 3, "Eb"),( 2, "D"),( 1, "C#"),( 0, "C-1")
]);
let mut note_offsets = vec![];
/* for (i, note) in song.tracks[0].notes.iter().enumerate() {
    println!("{}", i);
    note_offsets.push(vec![note);
} */ */

/* for i in 0..track.notes.len() {
    // let note = hash_notes[&(track.notes[i] as i32)];
    let to_push = vec![note, track.offsets[i]];
    note_offsets.push(to_push);
}  */
