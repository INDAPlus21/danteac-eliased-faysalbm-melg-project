use midiparser::parse_midi;
use midiparser::convert_to_front_end_format;

fn main() {
    println!("hello world");
    let parsed = parse_midi("musemario");
    println!("{:?}", parsed);  
    println!("{:?}", convert_to_front_end_format(parsed.unwrap()));
}
