mod matrix;
mod nn;
mod song;
mod tests;
mod vector;
use midly::num::{u15, u28, u4, u7};
use midly::*;
use nn::NeuralNetwork;
use song::Song;
use std::collections::VecDeque;
use std::fs;

fn main() {
    // Parse MIDI
    let path = "test-asset_Levels.mid";
    if let Ok(data) = fs::read(path) {
        //println!("{:?}", Smf::parse(&data));
        if let Ok(smf) = Smf::parse(&data) {
            let mut song = Song::new();
            song.parse_midi(&smf.tracks[4]);
            let mut nn = NeuralNetwork::new();

            // Sliding window of data
            println!("START TRAINING");
            let window_width = 10; // Send a sequence of 10 notes at a time as input
            let mut window: VecDeque<f32> = VecDeque::new();
            window.extend(song.notes[0..window_width].iter().copied());
            let mut label = song.notes[window_width + 1];
            for i in 0..(song.notes.len() - window_width - 2) {
                println!("{}: {:?} {:?}", i, window, label);
                // Send sequence to machine learning and predict next note
                nn.train(&window, label);
                println!("PREDICTION {}", nn.get_prediction(&window));
                break;

                // Update window
                window.pop_front();
                window.push_back(label);
                label = song.notes[i + window_width];
            }
        }
    }

    // create_midi()
}

fn create_midi() {
    let header = Header::new(Format::Parallel, Timing::Metrical(u15::new(10))); // Set timing (ticks per beat)
    let mut smf = Smf::new(header); // Smf = Standard midi file

    let mut track = vec![]; // Track is a vector of TrackEvent
    start_note(&mut track, 100, 0, 255);
    end_note(&mut track, 100, 20, 255);
    track.push(TrackEvent {
        delta: u28::new(1),
        kind: TrackEventKind::Meta(MetaMessage::EndOfTrack),
    });

    smf.tracks.push(track);
    println!("Custom MIDI: {:?}", smf);

    // Save to MIDI file (there is no player for Rust but this will be done in the front end Javascript anyways)
    smf.save("test.mid").unwrap();
    println!("Midi file successfully saved");
}

// Add a new trackevent (that starts playing a note)
// Volume is how hard the key is pressed
// Key 0 is the darkest and 128 the lightest
fn start_note(track: &mut Track, note: u8, offset: u32, volume: u8) {
    append_note(
        track,
        offset,
        MidiMessage::NoteOn {
            key: u7::new(note),
            vel: u7::new(volume),
        },
    );
}

// Add a new trackevent (that starts stops a note)
// Volume is how hard the key is pressed
// Key 0 is the darkest and 128 the lightest
fn end_note(track: &mut Track, note: u8, offset: u32, volume: u8) {
    append_note(
        track,
        offset,
        MidiMessage::NoteOff {
            key: u7::new(note),
            vel: u7::new(volume),
        },
    );
}

fn append_note(track: &mut Track, offset: u32, message: MidiMessage) {
    track.push(TrackEvent {
        delta: u28::new(offset),
        kind: TrackEventKind::Midi {
            channel: u4::new(0), // Channel is for multiple connected devices
            message: message,
        },
    });
}
