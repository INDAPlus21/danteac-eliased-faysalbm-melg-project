var played_notes = []
var songs = {
    test: ["C", "D", "E"],
    fur_elise: ["E", "Eb", "E", "Eb", "E", "B", "D", "C", "A", "C", "E", "A", "B", "E", "Ab", "B", "C", "E", "E", "Eb", "E", "Eb", "E", "B", "D", "C", "A", "C", "E", "A", "B", "E", "C", "B", "A", "B", "C", "D", "E", "G", "F", "E", "D", "F", "E", "D", "C", "E", "D", "C", "B", "E", "Eb", "E", "Eb", "E", "B", "D", "C", "A", "C", "E", "A", "B", "E", "Ab", "B", "C", "E", "E", "Eb", "E", "Eb", "E", "B", "D", "C", "A", "C", "E", "A", "B", "E", "C", "B", "A"],
    mario: ["E", "E", "E", "C", "E", "G", "G", "C", "G", "E", "A", "B", "Bb", "A", "G", "E", "G", "A", "F", "G", "E", "C", "D", "C", "G", "E", "A", "B", "Bb", "A", "G", "E", "G", "A", "F", "G", "E", "C", "D", "G", "Gb", "F", "D", "E", "G", "A", "C", "A", "C", "D", "G", "Gb", "F", "D", "E", "C", "C", "G", "Gb", "F", "D", "E", "G", "A", "C", "A", "C", "D", "Eb", "D", "C", "C", "C", "C", "D", "E", "C", "A", "G", "C", "C", "C", "C", "D", "C", "C", "C", "C", "D", "E", "C", "A", "G", "E", "E", "E", "C", "E", "G", "C", "G", "E", "A", "B", "Bb", "A", "G", "E", "G", "A", "F", "G", "E", "C", "D", "C", "G", "E", "A", "B", "Bb", "A", "G", "E", "G", "A", "F", "G", "E", "C", "D", "E", "C", "G", "G", "A", "F", "F", "A", "B", "A", "A", "A", "G", "F", "E", "C", "A", "E", "C", "G", "G", "A", "F", "F", "A", "B", "F", "F", "F", "E", "D", "C", "G", "E", "C", "G", "E", "A", "B", "A", "G#", "Bb", "G#", "G", "Gb", "G"],
    // vampire_killer: ["G", "Bb", "D5", "D5", "D5", "D5", "C5", "C5", "B4", "D4", "B4", "D4", "E4", "E4", "F4", "F4", "G4", "G4", "A4", "D4", "A4", "D4", "A4", "G4", "A4", "G4", "C5", "C5", "D5", "D5", "D5", "D5", "C5", "C5", "B4", "D4", "B4", "D4", "E4", "E4", "F4", "F4", "G4", "G4", "A4", "D4", "A4", "D4", "A4", "G4", "A4", "G4", "D5", "D5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "F5", "Ab5/Ab5", "F5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "G5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "G5", "D5", "D5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "F5", "Ab5/Ab5", "F5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "G5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "Db5", "G5", "Db5", "E5", "E5", "Bb5", "A5", "Bb5", "F5", "A5", "D5", "F5", "Db5", "D5", "Db5", "E5", "E5", "Bb5", "A5", "Bb5", "D5", "A5", "D5", "Db5", "Db5", "E5", "E5", "Bb5", "A5", "Bb5", "F5", "A5", "D5", "F5", "D5", "E5", "E5", "G5", "G5", "Bb5", "A5", "Bb5", "A5", "B5", "B5", "Db6", "Db6", "D6", "D6", "D6", "D5", "D6", "D5", "D5", "Bb3", "D5", "Bb3", "Bb3", "Bb3", "D4", "D4", "F4", "C4", "F4", "C4", "C4", "C4", "E4", "E4", "G4", "G4", "D6", "D6", "D6", "D5", "D6", "D5", "D5", "Bb3", "D5", "Bb3", "Bb3", "Bb3", "D4", "D4", "F4", "C4", "F4", "A3", "C4", "A3", "C4", "C4", "D5", "D5", "D5", "D5", "C5", "C5", "B4", "D4", "B4", "D4", "E4", "E4", "F4", "F4", "G4", "G4", "A4", "D4", "A4", "D4", "A4", "G4", "A4", "G4", "C5", "C5", "D5", "D5", "D5", "D5", "C5", "C5", "B4", "D4", "B4", "D4", "E4", "E4", "F4", "F4", "G4", "G4", "A4", "D4", "A4", "D4", "A4", "G4", "A4", "G4", "D5", "D5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "F5", "Ab5/Ab5", "F5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "G5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "G5", "D5", "D5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "F5", "Ab5/Ab5", "F5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "G5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "Db5", "G5", "Db5", "E5", "E5", "Bb5", "A5", "Bb5", "F5", "A5", "D5", "F5", "Db5", "D5", "Db5", "E5", "E5", "Bb5", "A5", "Bb5", "D5", "A5", "D5", "Db5", "Db5", "E5", "E5", "Bb5", "A5", "Bb5", "F5", "A5", "D5", "F5", "D5", "E5", "E5", "G5", "G5", "Bb5", "A5", "Bb5", "A5", "B5", "B5", "Db6", "Db6", "D6", "D6", "D6", "D5", "D6", "D5", "D5", "Bb3", "D5", "Bb3", "Bb3", "Bb3", "D4", "D4", "F4", "C4", "F4", "C4", "C4", "C4", "E4", "E4", "G4", "G4", "D6", "D6", "D6", "D5", "D6", "D5", "D5", "Bb3", "D5", "Bb3", "Bb3", "Bb3", "D4", "D4", "F4", "C4", "F4", "A3", "C4", "A3", "C4", "C4", "D5", "D5", "D5", "D5", "C5", "C5", "B4", "D4", "B4", "D4", "E4", "E4", "F4", "F4", "G4", "G4", "A4", "D4", "A4", "D4", "A4", "G4", "A4", "G4", "C5", "C5", "D5", "D5", "D5", "D5", "C5", "C5", "B4", "D4", "B4", "D4", "E4", "E4", "F4", "F4", "G4", "G4", "A4", "D4", "A4", "D4", "A4", "G4", "A4", "G4", "D5", "D5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "F5", "Ab5/Ab5", "F5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "G5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "G5", "D5", "D5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "A5", "F5", "Ab5/Ab5", "F5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "G5", "A5", "A5", "A5", "Ab5/Ab5", "A5", "Ab5/Ab5", "Ab5/Ab5", "G5", "Ab5/Ab5", "Db5", "G5", "Db5", "E5", "E5", "Bb5", "A5", "Bb5", "F5", "A5", "D5", "F5", "Db5", "D5", "Db5", "E5", "E5", "Bb5", "A5", "Bb5", "D5", "A5", "D5", "Db5", "Db5", "E5", "E5", "Bb5", "A5", "Bb5", "F5", "A5", "D5", "F5", "D5", "E5", "E5", "G5", "G5", "Bb5", "A5", "Bb5", "A5", "B5", "B5", "Db6", "Db6", "D6", "D6", "D6", "D5", "D6", "D5", "D5", "Bb3", "D5", "Bb3", "Bb3", "Bb3", "D4", "D4", "F4", "C4", "F4", "C4", "C4", "C4", "E4", "E4", "G4", "G4", "D6", "D6", "D6", "D5", "D6", "D5", "D5", "Bb3", "D5", "Bb3", "Bb3", "Bb3", "D4", "D4", "F4", "C4", "F4", "A3", "C4", "A3", "C4", "C4"],
    give_up: ["Db9", "C-1", "Ab1", "G", "Bb", "B", "G6", "A6", "F7", "E7", "Gb", "F7", "E7", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "C4", "Ab3", "Eb4", "Eb4", "Ab3", "C4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Bb3", "F4", "Db4", "Gb3", "Gb3", "Db4", "F4", "Bb3", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "F4", "Gb3", "Bb3", "Db4", "Db4", "Bb3", "Gb3", "F4", "Db4", "Ab4", "F4", "Bb3", "Bb3", "F4", "Ab4", "Db4", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "Bb3", "Gb3", "F4", "Db4", "Db4", "F4", "Gb3", "Bb3", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "Gb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Gb3", "Gb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Gb3", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Bb4", "Eb4", "Db4", "Gb4", "Gb4", "Db4", "Eb4", "Bb4", "Ab4", "Eb4", "F4", "C4", "C4", "F4", "Eb4", "Ab4", "Bb4", "Db4", "Eb4", "Gb4", "Gb4", "Eb4", "Db4", "Bb4", "Bb4", "Eb4", "Db4", "Gb4", "Gb4", "Db4", "Eb4", "Bb4", "Bb4", "Eb4", "Db4", "Gb4", "Gb4", "Db4", "Eb4", "Bb4", "Eb4", "Ab4", "C5", "C5", "Ab4", "Eb4", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "C4", "Ab3", "Eb4", "Eb4", "Ab3", "C4", "F3", "Ab3", "C4", "C4", "Ab3", "F3", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "C4", "F3", "Ab3", "Ab3", "F3", "C4", "F4", "Db4", "Bb3", "Bb3", "Db4", "F4", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "F3", "Ab3", "C4", "C4", "Ab3", "F3", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Eb4", "Ab3", "C4", "C4", "Ab3", "Eb4", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Bb3", "F4", "Db4", "Gb3", "Gb3", "Db4", "F4", "Bb3", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "F4", "Gb3", "Bb3", "Db4", "Db4", "Bb3", "Gb3", "F4", "Db4", "Ab4", "F4", "Bb3", "Bb3", "F4", "Ab4", "Db4", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "Bb3", "Gb3", "F4", "Db4", "Db4", "F4", "Gb3", "Bb3", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "Gb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Gb3", "Gb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Gb3", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Bb4", "Eb4", "Db4", "Gb4", "Gb4", "Db4", "Eb4", "Bb4", "Ab4", "Eb4", "F4", "C4", "C4", "F4", "Eb4", "Ab4", "Bb4", "Db4", "Eb4", "Gb4", "Gb4", "Eb4", "Db4", "Bb4", "Bb4", "Eb4", "Db4", "Gb4", "Gb4", "Db4", "Eb4", "Bb4", "Bb4", "Eb4", "Db4", "Gb4", "Gb4", "Db4", "Eb4", "Bb4", "Eb4", "Ab4", "C5", "C5", "Ab4", "Eb4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Ab3", "C4", "F3", "F3", "C4", "Ab3", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Ab3", "C4", "F3", "F3", "C4", "Ab3", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "Ab3", "C4", "F3", "F3", "C4", "Ab3", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Gb4", "Bb4", "Db4", "Eb4", "Eb4", "Db4", "Bb4", "Gb4", "F4", "Ab4", "C4", "Eb4", "Eb4", "C4", "Ab4", "F4", "Gb4", "Eb4", "Bb4", "Db4", "Db4", "Bb4", "Eb4", "Gb4", "Gb4", "Bb4", "Db4", "Eb4", "Eb4", "Db4", "Bb4", "Gb4", "Gb4", "Bb4", "Eb4", "Db4", "Db4", "Eb4", "Bb4", "Gb4", "Ab4", "C5", "Eb4", "Eb4", "C5", "Ab4", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "C4", "Ab3", "Eb4", "Eb4", "Ab3", "C4", "F3", "Ab3", "C4", "C4", "Ab3", "F3", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "C4", "F3", "Ab3", "Ab3", "F3", "C4", "F4", "Db4", "Bb3", "Bb3", "Db4", "F4", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "F3", "Ab3", "C4", "C4", "Ab3", "F3", "Db4", "Bb3", "F4", "F4", "Bb3", "Db4", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Eb4", "Ab3", "C4", "C4", "Ab3", "Eb4", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Bb3", "Db4", "F4", "F4", "Db4", "Bb3", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "C4", "Eb4", "Ab3", "Ab3", "Eb4", "C4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "F4", "Db4", "Bb3", "Bb3", "Db4", "F4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Eb4", "C4", "Ab3", "Ab3", "C4", "Eb4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Eb4", "Ab3", "C4", "C4", "Ab3", "Eb4", "Eb4", "Ab3", "C4", "C4", "Ab3", "Eb4", "F4", "Db4", "Bb3", "Bb3", "Db4", "F4", "Db4", "F4", "Bb3", "Bb3", "F4", "Db4", "Eb4", "Ab3", "C4", "C4", "Ab3", "Eb4", "Eb4", "Ab3", "C4", "C4", "Ab3", "Eb4", "F4", "Db4", "Bb3", "Ab4", "Ab4", "Bb4", "Bb4", "Db5", "Db5", "Bb3", "Db4", "F4", "Bb4", "Bb4", "Db5", "F5", "Bb4", "Bb4", "F5", "Db5", "Db5", "Bb4", "F5", "F5", "Bb4", "Db5", "Ab4", "Eb5", "C5", "C5", "Eb5", "Ab4", "Eb5", "Ab5/Ab5", "C5", "C5", "Ab5/Ab5", "Eb5", "Eb5", "F4", "Ab4", "C5", "C5", "Ab4", "F4", "Eb5"]
    , entertainer: ["Db9", "E4", "G6", "Bb", "G", "Db9", "E4", "G6", "Bb", "G", "C5", "C4", "D5", "D4", "C5", "C4", "Bb4", "Bb3", "D5", "D4", "G4", "G3", "Bb4", "Bb3", "A4", "A3", "G4", "G3", "F4", "F3", "A4", "A3", "F4", "F3", "C4", "C3", "D4", "D3", "C4", "C3", "Bb3", "Bb2", "D4", "D3", "G3", "G2", "Bb3", "Bb2", "A3", "A2", "G3", "G2", "G3", "G2", "A3", "A2", "Gb3", "Gb2", "G3", "G2", "F3", "F2", "Gb3", "Gb2", "F3", "F2", "A4", "F5", "F2", "F3", "A4", "F5", "F2", "F3", "Bb2", "Bb2", "F3", "Bb3", "D4", "F3", "Bb3", "D4", "D3", "D3", "Ab3", "Bb3", "D4", "Ab3", "Bb3", "D4", "Eb3", "Eb3", "G3", "Bb3", "Eb4", "G3", "Bb3", "G3", "Bb3", "Eb4", "G3", "Bb3", "D3", "D4", "Bb4", "D4", "Bb4", "D3", "Eb4", "C5", "F3", "Bb3", "Eb4", "C5", "E4", "Db5", "E4", "Db5", "F3", "Bb3", "F4", "D5", "F3", "F4", "D5", "D4", "Bb4", "D4", "Bb4", "F3", "Eb4", "C5", "Bb3", "D4", "Eb4", "C5", "F4", "D5", "Bb3", "D4", "F3", "F4", "D5", "C4", "A4", "C4", "A4", "F3", "Eb4", "C5", "A3", "Eb4", "Eb4", "C5", "A3", "Eb4", "D4", "Bb4", "Bb3", "D4", "Bb4", "Bb3", "F3", "F3", "Bb2", "Bb2", "Bb2", "Bb2", "F3", "Bb3", "D4", "F3", "Bb3", "D4", "D3", "D3", "Ab3", "Bb3", "D4", "Ab3", "Bb3", "D4", "Eb3", "Eb3", "G3", "Bb3", "Eb4", "G3", "Bb3", "G3", "Bb3", "Eb4", "G3", "Bb3", "D3", "D3", "G4", "Db3", "G4", "F4", "F4", "Db3", "E4", "C3", "E4", "G4", "G4", "C3", "Bb4", "E3", "G3", "Bb4", "D5", "E3", "G3", "C3", "D5", "C5", "C5", "C3", "Bb4", "E3", "G3", "Bb4", "G4", "G4", "E3", "G3", "C5", "F3", "A3", "F3", "A3", "F2", "F2", "G2", "C5", "G2", "A2", "A2", "Bb2", "Bb2", "F3", "Bb3", "D4", "F3", "Bb3", "D4", "D3", "D3", "Ab3", "Bb3", "D4", "Ab3", "Bb3", "D4", "Eb3", "Eb3", "G3", "Bb3", "Eb4", "G3", "Bb3", "Eb4", "D3", "D4", "Bb4", "D4", "Bb4", "D3", "Eb4", "C5", "F3", "Bb3", "Eb4", "C5", "E4", "Db5", "E4", "Db5", "F3", "Bb3", "F4", "D5", "F3", "F4", "D5", "D4", "Bb4", "D4", "Bb4", "F3", "Eb4", "C5", "Bb3", "D4", "Eb4", "C5", "F4", "D5", "Bb3", "D4", "F3", "F4", "D5", "C4", "A4", "C4", "A4", "F3", "Eb4", "C5", "A3", "Eb4", "Eb4", "C5", "A3", "Eb4", "D4", "Bb4", "Bb3", "Bb3", "F3", "F3", "Bb2", "D4", "Bb4", "Bb2", "Bb4", "Bb4", "C5", "C5", "D5", "Bb2", "D5", "Bb4", "Bb4", "Bb2", "C5", "Bb3", "D4", "C5", "D5", "Bb3", "D4", "Ab2", "D5", "Bb4", "Bb4", "Ab2", "C5", "Bb3", "D4", "C5", "Bb4", "Bb4", "Bb3", "D4", "D5", "G2", "D5", "Bb4", "Bb4", "G2", "C5", "Bb3", "Eb4", "C5", "D5", "Bb3", "Eb4", "Gb2", "D5", "Bb4", "Bb4", "Gb2", "C5", "Bb3", "Eb4", "C5", "Bb4", "Bb4", "Bb3", "Eb4", "D5", "F2", "D5", "Bb4", "Bb4", "F2", "C5", "Bb3", "D4", "C5", "D5", "Bb3", "D4", "F2", "D5", "A4", "A4", "F2", "C5", "Eb3", "A3", "C5", "Eb3", "A3", "Bb4", "D3", "Bb3", "D3", "Bb3", "F2", "F2", "Bb1", "Bb4", "Bb1", "Bb4", "D5", "Bb4", "D5", "C5", "Eb5", "C5", "Eb5", "Db5", "E5", "Db5", "E5", "D5", "F5", "Bb2", "D5", "F5", "Bb2", "Eb5", "G5", "F3", "Bb3", "D4", "Eb5", "G5", "D5", "F5", "F3", "Bb3", "D4", "F2", "D5", "F5", "Bb4", "D5", "Bb4", "D5", "F2", "C5", "Eb5", "F3", "Bb3", "D4", "C5", "Eb5", "Db5", "E5", "Db5", "E5", "F3", "Bb3", "D4", "D5", "F5", "Bb2", "D5", "F5", "Bb2", "Eb5", "G5", "F3", "Bb3", "D4", "Eb5", "G5", "D5", "F5", "F3", "Bb3", "D4", "F2", "D5", "F5", "F2", "F3", "Bb3", "D4", "F3", "Bb3", "D4", "Eb2", "Eb2", "Eb4", "G4", "Bb4", "Eb5", "Eb4", "G4", "Bb4", "Eb5", "Eb3", "Eb3", "Eb4", "Gb4", "Bb4", "Eb4", "Gb4", "Bb4", "D3", "D3", "D5", "F3", "Bb3", "D5", "Eb5", "Eb5", "F3", "Bb3", "G5", "F2", "G5", "F5", "F5", "F2", "D5", "A3", "D5", "Eb5", "Eb5", "A3", "D5", "F5", "Bb2", "D5", "F5", "Bb2", "Eb5", "G5", "F3", "Bb3", "D4", "Eb5", "G5", "D5", "F5", "F3", "Bb3", "D4", "F2", "D5", "F5", "Bb4", "D5", "F2", "C5", "Eb5", "F3", "Bb3", "D4", "Bb4", "D5", "Db5", "E5", "C5", "Eb5", "F3", "Bb3", "D4", "D5", "F5", "Bb2", "Db5", "E5", "Bb2", "Eb5", "G5", "F3", "Bb3", "D4", "D5", "F5", "D5", "F5", "Eb5", "G5", "F3", "Bb3", "D4", "F2", "D5", "F5", "F2", "F3", "Bb3", "D4", "F3", "Bb3", "D4", "C5", "F5", "A5", "C2", "C5", "F5", "A5", "C5", "F5", "A5", "C2", "F3", "A3", "C4", "C5", "F5", "A5", "Bb4", "E5", "A5", "F3", "A3", "C4", "C2", "C2", "G3", "Bb3", "C4", "Bb4", "E5", "A5", "G3", "Bb3", "C4", "A4", "F5", "F2", "F2", "Eb2", "Eb2", "D2", "A4", "F5", "Bb4", "D5", "Bb4", "D5", "D2", "C5", "Eb5", "C2", "C5", "Eb5", "Db5", "E5", "Db5", "E5", "C2", "D5", "F5", "Bb1", "D5", "F5", "Bb1", "Eb5", "G5", "F3", "Bb3", "D4", "Eb5", "G5", "D5", "F5", "F3", "Bb3", "D4", "F2", "D5", "F5", "Bb4", "D5", "Bb4", "D5", "F2", "C5", "Eb5", "F3", "Bb3", "D4", "C5", "Eb5", "Db5", "E5", "Db5", "E5", "F3", "Bb3", "D4", "D5", "F5", "Bb1", "D5", "F5", "Bb1", "Eb5", "G5", "F3", "Bb3", "D4", "Eb5", "G5", "D5", "F5", "F3", "Bb3", "D4", "F2", "D5", "F5", "F2", "F3", "Bb3", "D4", "F3", "Bb3", "D4", "Eb2", "Eb2", "Eb4", "G4", "Bb4", "Eb5", "Eb4", "G4", "Bb4", "Eb5", "Eb3", "Eb3", "Eb4", "Gb4", "Bb4", "Eb4", "Gb4", "Bb4", "D3", "D3", "F4", "Bb4", "D5", "F4", "Bb4", "D5", "Bb2", "Bb2", "Ab4", "Bb4", "D5", "Ab4", "Bb4", "D5", "G4", "Bb4", "Eb5", "Eb3", "G4", "Bb4", "Eb5", "Eb3", "G4", "Bb4", "Eb5", "Eb3", "G4", "Bb4", "Eb5", "Eb3", "G4", "Bb4", "Db5", "E3", "G4", "Bb4", "Db5", "E3", "G4", "Bb4", "Db5", "E3", "G4", "Bb4", "Db5", "E3", "F4", "Bb4", "D5", "F3", "F4", "Bb4", "D5", "F3", "F4", "Bb4", "D5", "F3", "F4", "Bb4", "D5", "F3", "F4", "Bb4", "D5", "F3", "F4", "Bb4", "D5", "F3", "F4", "Bb4", "D5", "F3", "F4", "Bb4", "D5", "F3", "E4", "G4", "C3", "C3", "C3", "E4", "G4", "C3", "Eb4", "A4", "F3", "Eb4", "A4", "Eb4", "F4", "A4", "F3", "F3", "Eb4", "F4", "A4", "D4", "Bb4", "F3", "Bb3", "Bb3", "F3", "D4", "Bb4", "F3", "Bb2", "Bb2", "Bb2", "Bb2", "F3", "Bb3", "D4", "F3", "Bb3", "D4", "D3", "D3", "Ab3", "Bb3", "D4", "Ab3", "Bb3", "D4", "Eb3", "Eb3", "G3", "Bb3", "Eb4", "G3", "Bb3", "G3", "Bb3", "Eb4", "G3", "Bb3", "D3", "D4", "Bb4", "D4", "Bb4", "D3", "Eb4", "C5", "F3", "Bb3", "Eb4", "C5", "E4", "Db5", "E4", "Db5", "F3", "Bb3", "F4", "D5", "F3", "F4", "D5", "D4", "Bb4", "D4", "Bb4", "F3", "Eb4", "C5", "Bb3", "D4", "Eb4", "C5", "F4", "D5", "Bb3", "D4", "F3", "F4", "D5", "C4", "A4", "C4", "A4", "F3", "Eb4", "C5", "A3", "Eb4", "Eb4", "C5", "A3", "Eb4", "D4", "Bb4", "Bb3", "D4", "Bb4", "Bb3", "F3", "F3", "Bb2", "Bb2", "Bb2", "Bb2", "F3", "Bb3", "D4", "F3", "Bb3", "D4", "D3", "D3", "Ab3", "Bb3", "D4", "Ab3", "Bb3", "D4", "Eb3", "Eb3", "G3", "Bb3", "Eb4", "G3", "Bb3", "G3", "Bb3", "Eb4", "G3", "Bb3", "D3", "D3", "G4", "Db3", "G4", "F4", "F4", "Db3", "E4", "C3", "E4", "G4", "G4", "C3", "Bb4", "E3", "G3", "Bb4", "D5", "E3", "G3", "C3", "D5", "C5", "C5", "C3", "Bb4", "E3", "G3", "Bb4", "G4", "G4", "E3", "G3", "C5", "F3", "A3", "F3", "A3", "F2", "F2", "G2", "C5", "G2", "A2", "A2", "Bb2", "Bb2", "F3", "Bb3", "D4", "F3", "Bb3", "D4", "D3", "D3", "Ab3", "Bb3", "D4", "Ab3", "Bb3", "D4", "Eb3", "Eb3", "G3", "Bb3", "Eb4", "G3", "Bb3", "Eb4", "D3", "D4", "Bb4", "D4", "Bb4", "D3", "Eb4", "C5", "F3", "Bb3", "Eb4", "C5", "E4", "Db5", "E4", "Db5", "F3", "Bb3", "F4", "D5", "F3", "F4", "D5", "D4", "Bb4", "D4", "Bb4", "F3", "Eb4", "C5", "Bb3", "D4", "Eb4", "C5", "F4", "D5", "Bb3", "D4", "F3", "F4", "D5", "C4", "A4", "C4", "A4", "F3", "Eb4", "C5", "A3", "Eb4", "Eb4", "C5", "A3", "Eb4", "D4", "Bb4", "Bb3", "Bb3", "F3", "F3", "Bb2", "D4", "Bb4", "Bb2", "Bb4", "Bb4", "C5", "C5", "D5", "Bb2", "D5", "Bb4", "Bb4", "Bb2", "C5", "Bb3", "D4", "C5", "D5", "Bb3", "D4", "Ab2", "D5", "Bb4", "Bb4", "Ab2", "C5", "Bb3", "D4", "C5", "Bb4", "Bb4", "Bb3", "D4", "D5", "G2", "D5", "Bb4", "Bb4", "G2", "C5", "Bb3", "Eb4", "C5", "D5", "Bb3", "Eb4", "Gb2", "D5", "Bb4", "Bb4", "Gb2", "C5", "Bb3", "Eb4", "C5", "Bb4", "Bb4", "Bb3", "Eb4", "D5", "F2", "D5", "Bb4", "Bb4", "F2", "C5", "Bb3", "D4", "C5", "D5", "Bb3", "D4", "F2", "D5", "A4", "A4", "F2", "C5", "Eb3", "A3", "C5", "Eb3", "A3", "Bb4", "D3", "Bb3", "D3", "Bb3", "F2", "F2", "Bb1", "Bb4", "Bb1"]
}
// this is so goddamn confusing reading a letter and pressing a different letter! 
// why does it stop changing the color??? 
var should_play = songs["entertainer"].slice(0, 100) // ["E", "Eb", "E", "Eb", "E"] // Fur Elise // ["C", "D", "E"]
var challenge_element = document.getElementById("challenge")
var has_won = false
challenge_element.innerHTML = "Play " // + should_play.join(" ")
var number_correct = 0
var number_incorrect = 0
for (var i = 0; i < should_play.length; i++) {
    note_to_play = document.createElement("div");
    note_to_play.innerHTML = should_play[i]
    note_to_play.className = "note-to-play"
    challenge_element.append(note_to_play)
}

/* if (should_play[0] == "E") {
    document.getElementById("play-now").style.marginLeft = "465px"
} */

// sheet music would be an enourmous project in an of itself, let's just do synethesia 
/* for (var i = 0; i < should_play.length; i++) {
    var quarter = document.createElement("img")
    quarter.id = "sheet1"
    quarter.className = "sheet-note"
    quarter.src = "quarter_note.png"
    var order = ["C", "D", "E", "F", "G", "A", "B"]
    if (should_play[i] == "C") {
        quarter.src = "c.png"
    }
    console.log({ quarter })
    quarter.style.left = i * 40 + "px"
    console.log(order.indexOf(should_play[i]))
    quarter.style.top = ((order.length - order.indexOf(should_play[i])) * 10 + 55) + "px"

    document.getElementById("sheet-music").append(quarter)
} */

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function challengeFunc(key, octave) {
    console.log({ octave })
    played_notes.push(key + octave)
    if (should_play[number_correct] == key) {
        console.log("one more correct")
        var note_elem = document.getElementsByClassName("note-to-play")[number_correct]
        note_elem.style.backgroundColor = "#58cf62"
        number_correct++
        var order = ["C", "D", "E", "F", "G", "A", "B"]
        var flat_order = ["Db", "Eb", "Gb", "Ab", "Bb"]

        /* if (should_play[number_correct] == "C") {
            quarter.src = "c.png"
        } */
        /* console.log({ quarter })
        quarter.style.left = i * 40 + "px"
        console.log(order.indexOf(should_play[i])) */
        /* var index = order.indexOf(should_play[number_correct])
        
        if (index == -1) {
            index = flat_order.indexOf(should_play[number_correct])
            // WHOAH. JUST GET THE POSITION OF THE KEY ELEMENT ON THE SCREEN!!! 
            document.getElementById("play-now").style.marginLeft = 30 + (7 + index) * 50 + "px"
        } else {
            document.getElementById("play-now").style.marginLeft = 5 + (7 + index) * 50 + "px"
        }
        console.log({ index }) */
        /* if (should_play[number_correct] == "C") {
            document.getElementById("play-now").style.marginLeft = 5 + 7 * 50 + "px"
        } else if (should_play[number_correct] == "E") {
            document.getElementById("play-now").style.marginLeft = 5 + 9 * 50 + "px"
        } */

    } else {
        number_incorrect++
    }
    if (number_correct == should_play.length && !has_won /* arraysEqual(played_notes, should_play)*/) {
        has_won = true
        console.log("challenge completed")
        var stats = document.createElement("div")
        stats.id = "accuracy"
        var notes = document.getElementsByClassName("note-to-play")
        var white_tiles = document.getElementsByClassName("white")
        console.log({ stats })
        console.log(should_play.length / number_incorrect)
        console.log(should_play.length, { number_incorrect })
        var accuracy = Math.round((number_correct / (number_correct + number_incorrect)) * 100)
        if (accuracy == Infinity) accuracy = 100
        console.log({ accuracy })
        stats.innerHTML = "Accuracy: " + accuracy + "%"
        console.log(notes[notes.length - 1])
        notes[notes.length - 1].after(stats)

        setTimeout(() => {
            playSound("./piano-mp3/C5.mp3")
            playSound("./piano-mp3/E5.mp3")
            playSound("./piano-mp3/G5.mp3")
            console.log(white_tiles.length)
            for (var i = 0; i < white_tiles.length; i++) {
                white_tiles[i].style.backgroundColor = "#58cf62"
            }
        }, 400)
        setTimeout(() => {
            playSound("./piano-mp3/C5.mp3")
            playSound("./piano-mp3/E5.mp3")
            playSound("./piano-mp3/G5.mp3")
        }, 500)
        setTimeout(() => {
            for (var i = 0; i < white_tiles.length; i++) {
                white_tiles[i].style.backgroundColor = "white"
            }
        }, 1000)

    }
    console.log({ played_notes }, { should_play })
}

function setUpKeyboard() {
    var tiles = document.getElementsByClassName("tile");

    var container = document.getElementById("container");
    const template = document.getElementById("template");

    for (var i = 1; i < 7; i++) {
        const clone = template.content.cloneNode(true);
        console.log(clone)
        clone.className += " " + i
        console.log(clone.className)
        var is_something = container.appendChild(clone);
        console.log({ is_something })
    }

    // set up lower 
    var container = document.getElementById("lower-container");
    for (var i = 0; i < 2; i++) {
        const clone = template.content.cloneNode(true);
        console.log(clone)
        clone.className += " " + i
        console.log(clone.className)
        var is_something = container.appendChild(clone);
        console.log({ is_something })
    }

    var octaves = document.getElementsByClassName("octave-container")
    for (var i = 0; i < octaves.length; i++) {
        console.log(octaves[i])
        octaves[i].className += " " + i
    }

    tiles[0].style.borderTopLeftRadius = "5px";
    tiles[tiles.length - 1].style.borderTopRightRadius = "5px";

    function playTile(event) {
        var id = event.srcElement.classList[1] // depracated?? 
        var octave = event.srcElement.parentNode.classList[1]
        var url = "./piano-mp3/" + id + (parseInt(octave) + 2) + ".mp3"
        console.log({ url })
        challengeFunc(id, octave)
        playSound(url)
    }

    for (var i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', (event) => {
            playTile(event)
        });

        // Make it possible to roll on keys with the mouse 
        var should_press_key = false

        tiles[i].addEventListener("mousedown", (event) => {
            // console.log("mousedown", {event})
            should_press_key = true
            playTile(event)
        });

        var should_press_key = false
        tiles[i].addEventListener("mouseover", function (event) {
            // console.log("mouseover", {event})
            if (should_press_key) {
                playTile(event)
            }
        });

        tiles[i].addEventListener("mouseup", function (event) {
            // console.log("mouseup", {event})
            should_press_key = false
        });
    }
}

setUpKeyboard()

// YES!!! that's a great idea! be able to play two-handed... yes... may actually work 
// implement something guitar-hero like (would be so much fun!)

var playSound = function (url) {
    const audio = new Audio(url);
    audio.play();
}

function computerKeyboardPress(event) {
    var key = event.code.replace("Key", "")
    // console.log({event})

    if (["Numpad4", "Numpad6"].includes(event.code)) {
        event.preventDefault();
    }

    // semicolon = ö, quote = ä, backslash = * 
    var key_octave_1 = { "A": "C", "S": "D", "D": "E", "F": "F", "G": "G", "H": "A", "J": "B" }
    var flats_octave_1 = { "W": "Db", "E": "Eb", "T": "Gb", "Y": "Ab", "U": "Bb" }
    var key_octave_2 = { "K": "C", "L": "D", "Semicolon": "E", "Quote": "F", "Backslash": "G", "Enter": "Ab", "Numpad4": "A", "Numpad5": "B" }
    var key_octave_3 = { "Numpad6": "C", "NumpadAdd": "Db" }
    var flats_octave_2 = { "O": "Db", "P": "Eb", "BracketRight": "Gb", "Numpad8": "Bb" }
    function determinePlay(keys, octave) {
        if (Object.keys(keys).includes(key)) {
            var elem_with_key = document.getElementsByClassName(keys[key])
            var key_elem = elem_with_key[octave - 2]

            // console.log({ elem_with_key }, { key_elem })
            if (key_elem.className.includes("white")) {
                key_elem.style.backgroundColor = "rgb(228, 228, 228)"
                setTimeout(function () {
                    key_elem.style.backgroundColor = "white"
                }, 200);
            } else {
                key_elem.style.backgroundColor = "rgb(59, 58, 58)"
                setTimeout(function () {
                    key_elem.style.backgroundColor = "black"
                }, 200);
            }
            var url = "./piano-mp3/" + keys[key] + octave + ".mp3"
            console.log({ key_elem }, { url })
            challengeFunc(keys[key], octave)
            playSound(url)
        }
    }

    determinePlay(key_octave_1, 2)
    determinePlay(key_octave_2, 3)
    determinePlay(flats_octave_1, 2)
    determinePlay(flats_octave_2, 3)
    determinePlay(key_octave_3, 4)
}

document.addEventListener('keydown', computerKeyboardPress);