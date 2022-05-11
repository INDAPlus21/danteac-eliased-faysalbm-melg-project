mod matrix;
mod tests;
mod vector;
use std::collections::VecDeque;

fn main() {
    // Parse MIDI
    if let Some(data) = midiparser::parse_midi("test-asset_Levels") {
        println!("DATA: {:?}", data);
        let song = &data.tracks[0];

        // Sliding window of data
        let window_width = 10; // Send a sequence of 10 notes at a time as input
        let mut window: VecDeque<f32> = VecDeque::new();
        window.extend(song.notes[0..window_width].iter().copied());
        let mut label = song.notes[window_width + 1];
        for i in 0..(song.notes.len() - window_width - 2) {
            println!("{}: {:?} {:?}", i, window, label);
            // Send sequence to machine learning and predict next note
            // TODO

            // Update window
            window.pop_front();
            window.push_back(label);
            label = song.notes[i + window_width];
        }
    }
}
