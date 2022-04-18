use core::convert::TryInto;
use std::fs;
use std::io::{BufRead, BufReader};
mod song;
use song::{Song, Track};

fn main() {
    parse_midi("test");
    parse_midi("test-asset_Levels");
}

// Filename without extension suffix
fn parse_midi(filename: &str) -> Option<Song> {
    if let Ok(data) = fs::read(filename.to_owned() + ".mid") {
        let mut tracks = vec![];
        println!("{:?}", data);

        let mut i = 0;
        while i < data.len() {
            if i < data.len() - 4 && data[i..i + 4] == b"MThd".to_owned() {
                // Parse header
                print!("Header");
                i += 4;

                // Header length
                //let length = bytes_to_int(&data[i..i + 4]);
                i += 4;

                // Format
                //let format = data[i]; // 0: Single track 1: Parallel tracks 2: Sequental tracks
                i += 1;

                // Chunk count
                //let chunk_count = data[i];
                i += 1;

                // Tempo (tick division)
                // TODO
                i += 4;
            } else if i < data.len() - 4 && data[i..i + 4] == b"MTrk".to_owned() {
                // Parse track (only note on and off events)
                // Expects songs with format 1 (parallel)
                println!("TRACK!");
                i += 4;
                let mut notes = vec![];
                let mut volumes = vec![];
                let mut offsets = vec![];
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

fn bytes_to_int(bytes: &[u8]) -> u32 {
    u32::from_be_bytes(bytes.try_into().unwrap())
}
