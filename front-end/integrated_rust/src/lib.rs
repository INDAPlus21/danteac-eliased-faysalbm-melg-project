use js_sys::Array;
use wasm_bindgen::prelude::*;
use web_sys::console;
// use neon::prelude::*;
use aiproject::NotesRNN;
use midiparser::parse_midi;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[wasm_bindgen]
pub fn receive_notes(val: &JsValue) -> JsValue {
    let received_notes: Vec<Vec<f32>> = val.into_serde().unwrap();

    console::log_1(&received_notes[0][0].into());

    let mut notes: Vec<f32> = vec![];
    let mut volumes: Vec<f32> = vec![];
    let mut offsets: Vec<f32> = vec![];

    for event in received_notes {
        notes.push(event[0]);
        offsets.push(event[1]);
    }

    console::log_1(&JsValue::from_serde(&notes).unwrap());

    let notes_rnn: NotesRNN = NotesRNN::new(64);
    let generated_notes: Vec<f32> = notes_rnn.gen_notes(notes, 10);

    return JsValue::from_serde(&generated_notes).unwrap(); 
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
    // console::log_1(&"hello process file".into());

    let real_midi_file: Vec<u8> = file_data.to_vec();

    let song: midiparser::song::Song = parse_midi(real_midi_file).unwrap();

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
}