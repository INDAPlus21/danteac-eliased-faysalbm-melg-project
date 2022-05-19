use midiparser::parse_midi_file;

fn main() {
    let parsed = parse_midi_file("musemario");
    println!("{:?}", parsed);  
}
