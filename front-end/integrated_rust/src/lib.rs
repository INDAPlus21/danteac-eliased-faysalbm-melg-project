use js_sys::Array;
use wasm_bindgen::prelude::*;
use web_sys::console;
// use neon::prelude::*;
use aiproject::NotesRNN;
use midiparser::parse_midi;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

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

#[wasm_bindgen]
pub fn receive_notes(val: &JsValue) -> JsValue {
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

    let notes_rnn: NotesRNN = NotesRNN::new(64);
    let generated_notes: Vec<f32> = notes_rnn.gen_notes(notes, 10);

    return JsValue::from_serde(&generated_notes).unwrap(); // generated_notes.into()
}

#[wasm_bindgen]
pub fn process_send_ai(file_data: &[u8]) -> JsValue {
    console::log_1(&"hello send ai".into());

    let real_midi_file: Vec<u8> = file_data.to_vec();

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

    let notes_rnn: NotesRNN = NotesRNN::new(64);
    let generated_notes: Vec<f32> = notes_rnn.gen_notes(notes, 10);

    return JsValue::from_serde(&generated_notes).unwrap();
}

#[wasm_bindgen]
pub fn process_file(file_data: &[u8]) -> JsValue {
    console::log_1(&"hello process file".into());

    let real_midi_file: Vec<u8> = file_data.to_vec();
    console::log_1(&"hello real midi file".into());

    let song: midiparser::song::Song = parse_midi(real_midi_file).unwrap();

    console::log_1(&"hello parsed".into());

    /* let mut note_offsets: Vec<Vec<f32>> = vec![];

    let track = &song.tracks[1];
    for i in 0..track.notes.len() {
        // let note = hash_notes[&(track.notes[i] as i32)];
        let to_push = vec![track.notes[i], track.offsets[i]];
        note_offsets.push(to_push);
    }

    return JsValue::from_serde(&note_offsets).unwrap(); */

    let mut combined_note_offsets: Vec<Vec<Vec<f32>>> = vec![];

    for track in song.tracks {
        let mut track_note_offsets: Vec<Vec<f32>> = vec![];
        for i in 0..track.notes.len() {
            let to_push = vec![track.notes[i], track.offsets[i]];
            track_note_offsets.push(to_push);
        }
        combined_note_offsets.push(track_note_offsets);
    }

    return JsValue::from_serde(&combined_note_offsets).unwrap();

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

    // return JsValue::from_serde(&note_offsets).unwrap();
    // console::log_1(&song.tracks[0].volumes[0].into());
}

#[wasm_bindgen]
pub fn process_file_2(file_data: &[u8]) -> JsValue {
    console::log_1(&"hello 2".into());

    let real_midi_file: Vec<u8> = file_data.to_vec();

    let song: midiparser::song::Song = parse_midi(real_midi_file).unwrap();

    let mut note_offsets: Vec<Vec<f32>> = vec![];

    let track = &song.tracks[0];
    for i in 0..track.notes.len() {
        let to_push = vec![track.notes[i], track.offsets[i]];
        note_offsets.push(to_push);
    }

    return JsValue::from_serde(&note_offsets).unwrap();
}
