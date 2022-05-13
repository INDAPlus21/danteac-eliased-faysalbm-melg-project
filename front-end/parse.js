import { combineTracks } from "./combineTracks.js"

import { createRequire } from "module";

const require = createRequire(import.meta.url);

const midiParser = require('midi-parser-js');
const fs = require('fs')

// second row in Fur Elise midi file it switches to G clef! 
export function parseFile() {
    const tracks = []
    fs.readFile(midi_file, 'base64', function (err, raw_data) {
        // Parse the obtainer base64 string ...
        const midiArray = midiParser.parse(raw_data);

        console.log(midiArray); // useful information 
        console.log(midiArray.track[0]);
        console.log(midiArray.track[1]);

        // maybe the 121 byte is there in every midi to estabish the upper range? 
        function getNotesAndTimes(track) {
            const notes_and_times = []
            for (let i = 0; i < track.length; i++) {
                const data = track[i].data
                const type = track[i].type
                const deltaTime = track[i].deltaTime
                if (type == 9) {
                    const note = notes[data[0]]
                    notes_and_times.push([note, deltaTime]) // keep the ms, already in right format. well, not necessarily (it's in time ticks), not even usually, but the most relevant thing is the time relation between notes anyways 
                } else if (deltaTime != 0) {
                    notes_and_times.push(["no_note", deltaTime]) // keep the ms, already in right format. well, not necessarily (it's in time ticks), not even usually, but the most relevant thing is the time relation between notes anyways 
                } /*  else if (type == 8) {
                    console.log("eight!")
                }  */
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
        console.log("left hand: ", tracks[1], "right hand: ", tracks[0])
        const combined = combineTracks(tracks[0], tracks[1])
        console.log("combined: ", combined)
        // const combined = tracks[1]

        fs.writeFile("./song.js", "export const song = " + JSON.stringify(combined), 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });

        return combined
    });
}


const notes = {
    127: "G9", 126: "Gb9", 125: "F9", 124: "E9", 123: "Eb9", 122: "D9", 121: "Db9", 120: "C9", 119: "B8", 118: "Bb8", 117: "A8	 ", 116: "Ab8", 115: "G8", 114: "Gb8", 113: "F8", 112: "E8", 111: "Eb8", 110: "D8", 109: "Db8", 108: "C8", 107: "B7", 106: "Bb7", 105: "A7", 104: "Ab7", 103: "G7", 102: "Gb7", 101: "F7", 100: "E7", 99: "Eb7", 98: "D7", 97: "Db7", 96: "C7", 95: "B6", 94: "Bb6", 93: "A6", 92: "Ab6", 91: "G6", 90: "Gb6", 89: "F6", 88: "E6", 87: "Eb6", 86: "D6", 85: "Db6", 84: "C6", 83: "B5", 82: "Bb5", 81: "A5", 80: "Ab5", 79: "G5", 78: "Gb5", 77: "F5", 76: "E5", 75: "Eb5", 74: "D5", 73: "Db5", 72: "C5", 71: "B4", 70: "Bb4", 69: "A4", 68: "Ab4", 67: "G4", 66: "Gb4", 65: "F4", 64: "E4", 63: "Eb4", 62: "D4", 61: "Db4", 60: "C4", 59: "B3", 58: "Bb3", 57: "A3", 56: "Ab3", 55: "G3", 54: "Gb3", 53: "F3", 52: "E3", 51: "Eb3", 50: "D3", 49: "Db3", 48: "C3", 47: "B2", 46: "Bb2", 45: "A2", 44: "Ab2", 43: "G2", 42: "Gb2", 41: "F2", 40: "E2", 39: "Eb2", 38: "D2", 37: "Db2", 36: "C2", 35: "B1", 34: "Bb1", 33: "A1", 32: "Ab1", 31: "G1", 30: "Gb1",
    29: "F1", 28: "E1", 27: "Eb1", 26: "D1", 25: "Db1", 24: "C1", 23: "B0", 22: "Bb0", 21: "A0", 20: "Ab", 19: "G", 18: "Gb", 17: "F", 16: "E", 15: "Eb", 14: "D", 13: "C#", 12: "C0", 11: "B", 10: "Bb", 9: "A", 8: "Ab", 7: "G", 6: "Gb", 5: "F", 4: "E", 3: "Eb", 2: "D", 1: "C#", 0: "C-1"
}

// seems to correspond... but there's ghost notes 0-21 and 108-127 
// the other site also agrees that only those 88 are for piano, but where do the ghost notes come from, still? 
// this is nice, docs: https://github.com/colxi/midi-parser-js/wiki/MIDI-File-Format-Specifications
// "Events unaffected by time are still preceded by a delta time, but should always use a value of 0 and come first in the stream of track events. Examples of this type of event include track titles and copyright information. The most important thing to remember about delta"

// read a .mid binary (as base64)
const midi_file = "./midis/Rush_E.mid"

parseFile(midi_file)
