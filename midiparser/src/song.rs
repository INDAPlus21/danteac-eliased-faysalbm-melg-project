#[derive(Debug, Clone)]
pub struct Song {
    pub tracks: Vec<Track>,
}

#[derive(Debug, Clone)]
pub struct Track {
    pub notes: Vec<f32>,
    pub volumes: Vec<f32>,
    pub offsets: Vec<f32>,
}
