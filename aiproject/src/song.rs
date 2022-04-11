use midly::num::{u28, u7};
use midly::*;

#[derive(Debug)]
pub struct Song {
    pub notes: Vec<f32>,
    pub volumes: Vec<f32>,
    pub lengths: Vec<f32>,
    pub offsets: Vec<f32>,
}

impl Song {
    pub fn new() -> Song {
        Song {
            notes: vec![],
            volumes: vec![],
            lengths: vec![],
            offsets: vec![],
        }
    }

    // Takes in a track and converts it to a vector of data
    pub fn parse_midi(&mut self, track: &Vec<TrackEvent>) {
        let mut start_note = (u7::new(0), u7::new(0), u28::new(0)); // Key Volume Delta

        for track_event in track {
            let delta = track_event.delta;

            match track_event.kind {
                TrackEventKind::Midi {
                    channel: _,
                    message,
                } => match message {
                    MidiMessage::NoteOn { key, vel: volume }
                    | MidiMessage::NoteOff { key, vel: volume } => {
                        // Start note
                        if volume != 0 {
                            start_note = (key, volume, delta);
                        }
                        // End note
                        else {
                            // Accually create note
                            self.notes.push(start_note.0.as_int() as f32 / 100.0);
                            self.volumes.push(start_note.1.as_int() as f32);
                            self.lengths.push(delta.as_int() as f32);
                            self.offsets.push(start_note.2.as_int() as f32);
                        }
                    }
                    _ => continue,
                },
                _ => continue,
            }
        }
    }
}
