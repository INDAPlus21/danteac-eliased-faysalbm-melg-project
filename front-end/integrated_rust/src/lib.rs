use js_sys::Array;
use wasm_bindgen::prelude::*;
use web_sys::console;
// use neon::prelude::*;
// use aiproject::NotesRNN;
use rnns::NotesRNN; 
use rnns::OffsetRNN; 
use midiparser::parse_midi;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
extern crate console_error_panic_hook;

fn send_to_rnn(notes: Vec<f32>, offsets: Vec<f32>) -> JsValue {
    console::log_2(&"sending to rnn from wasm: ".into(), &JsValue::from_serde(&notes).unwrap());

    let notes_rnn: NotesRNN = NotesRNN::from_weights_biases_file();
    let generated_notes: Vec<f32> = notes_rnn.gen_notes(notes, 100);
    let offset_rnn: OffsetRNN = OffsetRNN::from_weights_biases_file(); // new(64); 
    let generated_offsets: Vec<f32> = offset_rnn.gen_offsets(offsets, 100);

    let combined: Vec<Vec<f32>> = vec![generated_notes, generated_offsets];

    return JsValue::from_serde(&combined).unwrap();
}

#[wasm_bindgen]
pub fn receive_notes(val: &JsValue) -> JsValue {
    console_error_panic_hook::set_once();

    let received_notes: Vec<Vec<f32>> = val.into_serde().unwrap();

    console::log_1(&received_notes[0][0].into());

    let mut notes: Vec<f32> = vec![];
    let mut volumes: Vec<f32> = vec![];
    let mut offsets: Vec<f32> = vec![];

    for event in received_notes {
        notes.push(event[0]);
        offsets.push(event[1]);
    }

    send_to_rnn(notes, offsets)
}

#[wasm_bindgen]
pub fn process_send_ai(file_data: &[u8]) -> JsValue {
    console::log_1(&"hello send ai".into());

    let real_midi_file: Vec<u8> = file_data.to_vec();

    let song: midiparser::song::Song = parse_midi(real_midi_file).unwrap();

    let mut note_offsets: Vec<Vec<f32>> = vec![];
    let mut notes = vec![];
    let mut offsets = vec![]; 

    let track = &song.tracks[1];
    for i in 0..track.notes.len() {
        let to_push = vec![track.notes[i], track.offsets[i]];
        note_offsets.push(to_push);
        if i < 10 {
            notes.push(track.notes[i] as f32); 
            offsets.push(track.offsets[i] as f32);
        }
    }

    send_to_rnn(notes, offsets)
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
