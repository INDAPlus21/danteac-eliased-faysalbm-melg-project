pub mod song;
use core::convert::TryInto;
use song::{Song, Track};
use std::fs;
use std::collections::HashMap;

// Filename without extension suffix
pub fn parse_midi(filename: &str) -> Option<Song> {
    if let Ok(data) = fs::read(filename.to_owned() + ".mid") {
        let mut tracks = vec![];

        let mut i = 0;
        while i < data.len() {
            if i < data.len() - 4 && data[i..i + 4] == b"MThd".to_owned() {
                // Parse header
                i += 4;

                // Header length
                //let length = bytes_to_int(&data[i..i + 4]);
                i += 4;

                // Format
                let format = data[i]; // 0: Single track 1: Parallel tracks 2: Sequental tracks
                match format {
                    0 => println!("Single tracks"),
                    1 => println!("Parallel tracks"),
                    2 => println!("Sequential tracks"),
                    _ => println!("Unknown format")
                }

                i += 1;

                // Chunk count (will always be 6)
                //let chunk_count = data[i];
                i += 1;

                // Tempo (tick division)
                // TODO
                i += 4;
            } else if i < data.len() - 4 && data[i..i + 4] == b"MTrk".to_owned() {
                // Parse track (only note on and off events)
                // Expects songs with format 1 (parallel)
                i += 4;

                let mut notes = vec![];
                let mut volumes = vec![];
                let mut offsets = vec![];

                // Byte count
                let byte_count = bytes_to_int(&data[i..i + 4]);
                i += 4;
                let start_i = i;

                // Read track events (doesn't account for SysEx messages)
                while i - start_i < byte_count as usize {

                    let delta = variable_length_bytes_to_int(&data, &mut i);

                    // Status byte (type and channel)
                    let event_type = data[i] >> 4; // Top part of byte
                                                   //let channel = (data[i] << 4) >> 4; // Bottom part of byte
                    
                    if i < 100 {
                        println!("{:?} event {:?}", i, event_type); 
                    }
                    
                    i += 1;

                    match event_type {
                       8 | 9 => {
                            // Note on/off event
                            offsets.push(delta as f32);
                            notes.push(data[i] as f32);

                            // Note off should always have volume 0
                            if event_type == 8 {
                                println!("eight!"); 
                                volumes.push(0f32);
                            } else {
                                println!("nine!"); 
                                volumes.push(data[i + 1] as f32);
                            }

                            i += 2;
                        }
                        10 | 11 | 14 => {
                            // Skip event
                            i += 2;
                        }
                        12 | 13 => {
                            // Skip event
                            i += 1;
                        }
                        _ => {}
                    }
                    if data[i - 1] == 255 {
                        // Meta events
                        let message_type = data[i];
                        i += 1;

                        let length = data[i];
                        i += (1 + length) as usize;

                        // End of track, ignore other messages
                        if message_type == 47 {
                            break;
                        }
                    }
                }

                // Only add tracks with note data
                if notes.len() > 0 {
                    tracks.push(Track {
                        notes,
                        volumes,
                        offsets,
                    });
                }
            } else {
                i += 1;
            }
        }

        Some(Song { tracks })
    } else {
        println!("Error: File {}.mid not found!", filename);
        None
    }
}

#[derive(Debug)]
pub enum Thing {
    String(String),
    Number(f32)
}

pub fn convert_to_front_end_format(song: Song) -> Vec<Vec<Thing>> {
    
    let hash_notes = HashMap::from([
        (127, "G9"),( 126, "Gb9"),( 125, "F9"),( 124, "E9"),( 123, "Eb9"),( 122, "D9"),( 121, "Db9"),( 120, "C9"),( 119, "B8"),( 118, "Bb8"),( 117, "A8	 "),( 116, "Ab8"),( 115, "G8"),( 114, "Gb8"),( 113, "F8"),( 112, "E8"),( 111, "Eb8"),( 110, "D8"),( 109, "Db8"),( 108, "C8"),( 107, "B7"),( 106, "Bb7"),( 105, "A7"),( 104, "Ab7"),( 103, "G7"),( 102, "Gb7"),( 101, "F7"),( 100, "E7"),( 99, "Eb7"),( 98, "D7"),( 97, "Db7"),( 96, "C7"),( 95, "B6"),( 94, "Bb6"),( 93, "A6"),( 92, "Ab6"),( 91, "G6"),( 90, "Gb6"),( 89, "F6"),( 88, "E6"),( 87, "Eb6"),( 86, "D6"),( 85, "Db6"),( 84, "C6"),( 83, "B5"),( 82, "Bb5"),( 81, "A5"),( 80, "Ab5"),( 79, "G5"),( 78, "Gb5"),( 77, "F5"),( 76, "E5"),( 75, "Eb5"),( 74, "D5"),( 73, "Db5"),( 72, "C5"),( 71, "B4"),( 70, "Bb4"),( 69, "A4"),( 68, "Ab4"),( 67, "G4"),( 66, "Gb4"),( 65, "F4"),( 64, "E4"),( 63, "Eb4"),( 62, "D4"),( 61, "Db4"),( 60, "C4"),( 59, "B3"),( 58, "Bb3"),( 57, "A3"),( 56, "Ab3"),( 55, "G3"),( 54, "Gb3"),( 53, "F3"),( 52, "E3"),( 51, "Eb3"),( 50, "D3"),( 49, "Db3"),( 48, "C3"),( 47, "B2"),( 46, "Bb2"),( 45, "A2"),( 44, "Ab2"),( 43, "G2"),( 42, "Gb2"),( 41, "F2"),( 40, "E2"),( 39, "Eb2"),( 38, "D2"),( 37, "Db2"),( 36, "C2"),( 35, "B1"),( 34, "Bb1"),( 33, "A1"),( 32, "Ab1"),( 31, "G1"),( 30, "Gb1"),(
        29, "F1"),( 28, "E1"),( 27, "Eb1"),( 26, "D1"),( 25, "Db1"),( 24, "C1"),( 23, "B0"),( 22, "Bb0"),( 21, "A0"),( 20, "Ab"),( 19, "G"),( 18, "Gb"),( 17, "F"),( 16, "E"),( 15, "Eb"),( 14, "D"),( 13, "C#"),( 12, "C0"),( 11, "B"),( 10, "Bb"),( 9, "A"),( 8, "Ab"),( 7, "G"),( 6, "Gb"),( 5, "F"),( 4, "E"),( 3, "Eb"),( 2, "D"),( 1, "C#"),( 0, "C-1") 
    ]);

    let mut note_offsets = vec![]; 
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

    return note_offsets //vec![vec![12 as f32]];
}

// Source: https://stackoverflow.com/questions/24711585/decode-midi-variable-length-field
// Returns bytes as integer
fn variable_length_bytes_to_int(data: &[u8], index: &mut usize) -> u32 {
    let mut ret = 0;

    loop {
        let byte_in = data[*index];
        *index += 1;
        if byte_in == 0 {
            return 0;
        }

        // Continue if top bit is one
        ret = (ret << 7) | (byte_in & 0x7f);
        if (byte_in & 0x80) == 0 {
            return ret as u32;
        }
    }

    0
}

fn bytes_to_int(bytes: &[u8]) -> u32 {
    u32::from_be_bytes(bytes.try_into().unwrap())
}
