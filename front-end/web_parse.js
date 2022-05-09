import { combineTracks } from "./combineTracks.js"
// const midiParser = require('midi-parser-js');
import MidiParser from './node_modules/midi-parser-js/src/midi-parser.js'

export function parseFile(raw_data) {
    const tracks = []
    // Parse the obtainer base64 string ...
    const midiArray = MidiParser.parse(raw_data);

    console.log(midiArray); // useful information 
    console.log(midiArray.track[0]);

    // maybe the 121 byte is there in every midi to estabish the upper range? 
    function getNotesAndTimes(track) {
        const notes_and_times = []
        for (let i = 0; i < track.length; i++) {
            const data = track[i].data
            const type = track[i].type
            const deltaTime = track[i].deltaTime
            if (type == 9) {
                parseFile(midi_file)
                const note = notes[data[0]]
                notes_and_times.push([note, deltaTime]) // keep the ms, already in right format. well, not necessarily (it's in time ticks), not even usually, but the most relevant thing is the time relation between notes anyways 
            }
        }
        return notes_and_times
    }


    for (let i = 0; i < midiArray.track.length; i++) {
        const track = midiArray.track[i].event
        const notes_and_times = getNotesAndTimes(track)

        if (notes_and_times.length) {
            tracks.push(notes_and_times)
        }
    }

    console.log(tracks.length)
    const combined = combineTracks(tracks[0], tracks[1])

    return combined
}