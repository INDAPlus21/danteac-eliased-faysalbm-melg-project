#[derive(Debug)]
pub struct Song {
    pub tracks: Vec<Track>,
}

#[derive(Debug)]
pub struct Track {
    pub notes: Vec<f32>,
    pub volumes: Vec<f32>,
    pub offsets: Vec<f32>,
}
