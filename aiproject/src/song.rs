use midly::num::{u28, u7};
use midly::*;

#[derive(Debug)]
pub struct Song {
    pub notes: Vec<Note>,
}

#[derive(Debug, Copy, Clone)]
pub struct Note {
    note: u7,
    volume: u7,
    length: u28,
    offset: u28,
}

impl Song {
    // Takes in a track and converts it to a vector of data
    pub fn parse_midi(track: &Vec<TrackEvent>) -> Song {
        let mut notes = vec![];
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
                            notes.push(Note {
                                note: start_note.0,
                                volume: start_note.1,
                                length: delta,
                                offset: start_note.2,
                            })
                        }
                    }
                    _ => continue,
                },
                _ => continue,
            }
        }

        Song { notes }
    }
}
