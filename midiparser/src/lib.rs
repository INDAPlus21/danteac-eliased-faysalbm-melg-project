pub mod song;
use core::convert::TryInto;
use song::{Song, Track};
use std::fs;

// Filename without extension suffix
pub fn parse_midi(filename: &str) -> Option<Song> {
    if let Ok(data) = fs::read(filename.to_owned()) {
        let mut tracks = vec![];

        let mut i = 0;
        let mut current_event_type = 0; // Support running status
        let mut current_delta_time = 0; // Support delta time for non-note events

        while i < data.len() {
            if i < data.len() - 4 && data[i..i + 4] == b"MThd".to_owned() {
                // Parse header
                i += 4;

                // Header length
                //let length = bytes_to_int(&data[i..i + 4]);
                i += 4;

                // Format
                //let format = data[i]; // 0: Single track 1: Parallel tracks 2: Sequental tracks
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
                    current_delta_time += delta;

                    // It is only a status byte if more or equal than 128
                    if data[i] >= 128 {
                        // Status byte (type and channel)
                        current_event_type = data[i] >> 4; // Top part of byte
                                                           //let channel = (data[i] << 4) >> 4; // Bottom part of byte
                        i += 1;
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
                    } else {
                        match current_event_type {
                            8 | 9 => {
                                // Note on/off event
                                offsets.push(current_delta_time as f32);
                                notes.push(data[i] as f32);
                                current_delta_time = 0;

                                // Note off should always have volume 0
                                if current_event_type == 8 {
                                    volumes.push(0f32);
                                } else {
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
                            _ => {
                                i += 1;
                            }
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
                current_delta_time = 0;
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
}

fn bytes_to_int(bytes: &[u8]) -> u32 {
    u32::from_be_bytes(bytes.try_into().unwrap())
}
