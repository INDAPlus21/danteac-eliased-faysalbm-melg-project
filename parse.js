let midiParser = require('midi-parser-js');
let fs = require('fs')
var notes = {
    127: "G9", 126: "Gb9", 125: "F9", 124: "E9", 123: "Eb9", 122: "D9", 121: "Db9", 120: "C9", 119: "B8", 118: "Bb8", 117: "A8	 ", 116: "Ab8", 115: "G8", 114: "Gb8", 113: "F8", 112: "E8", 111: "Eb8", 110: "D8", 109: "Db8", 108: "C8", 107: "B7", 106: "Bb7", 105: "A7", 104: "Ab7", 103: "G7", 102: "Gb7", 101: "F7", 100: "E7", 99: "Eb7", 98: "D7", 97: "Db7", 96: "C7", 95: "B6", 94: "Bb6", 93: "A6", 92: "Ab6", 91: "G6", 90: "Gb6", 89: "F6", 88: "E6", 87: "Eb6", 86: "D6", 85: "Db6", 84: "C6", 83: "B5", 82: "Bb5", 81: "A5", 80: "Ab5", 79: "G5", 78: "Gb5", 77: "F5", 76: "E5", 75: "Eb5", 74: "D5", 73: "Db5", 72: "C5", 71: "B4", 70: "Bb4", 69: "A4", 68: "Ab4", 67: "G4", 66: "Gb4", 65: "F4", 64: "E4", 63: "Eb4", 62: "D4", 61: "Db4", 60: "C4", 59: "B3", 58: "Bb3", 57: "A3", 56: "Ab3", 55: "G3", 54: "Gb3", 53: "F3", 52: "E3", 51: "Eb3", 50: "D3", 49: "Db3", 48: "C3", 47: "B2", 46: "Bb2", 45: "A2", 44: "Ab2", 43: "G2", 42: "Gb2", 41: "F2", 40: "E2", 39: "Eb2", 38: "D2", 37: "Db2", 36: "C2", 35: "B1", 34: "Bb1", 33: "A1", 32: "Ab1", 31: "G1", 30: "Gb1",
    29: "F1", 28: "E1", 27: "Eb1", 26: "D1", 25: "Db1", 24: "C1", 23: "B0", 22: "Bb0", 21: "A0", 20: "Ab", 19: "G", 18: "Gb", 17: "F", 16: "E", 15: "Eb", 14: "D", 13: "C#", 12: "C0", 11: "B", 10: "Bb", 9: "A", 8: "Ab", 7: "G", 6: "Gb", 5: "F", 4: "E", 3: "Eb", 2: "D", 1: "C#", 0: "C-1"
}

// seems to correspond... but there's ghost notes 0-21 and 108-127 
// the other site also agrees that only those 88 are for piano, but where do the ghost notes come from, still? 

// console.log(notes)

// read a .mid binary (as base64)
fs.readFile('./sax_medley.mid', 'base64', function (err, data) {
    // Parse the obtainer base64 string ...
    var midiArray = midiParser.parse(data);

    var json_content = JSON.stringify(midiArray)
    fs.writeFile("./giveup.json", json_content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

    // done!
    console.log(midiArray);

    var track = midiArray.track[0].event // [2].event
    // console.log(track )
    var data_array = []
    var notes_array = []
    var delta_times = []
    // var notes_and_times = {} 
    var notes_and_times = []

    for (var i = 0; i < track.length; i++) {
        // console.log(track[i])
        var data = track[i].data
        // console.log(data)
        if (true /* track[i].channel == 3 */) { // 3 most promising, definitely not 5 (base), not 1 (too few), not 2 (too low)
            if (data && data[0] != 121 && data.length == 2 && data[0] >= 21 && data[0] <= 128) {
                // data_array.push(data)
                var note = notes[data[0]]
                // var notes_len = Object.keys(notes_array).length
                if (notes_array[notes_array.length-1] == note) {
                    // console.log(notes_len)
                    notes_and_times.push([note, track[i].deltaTime]) // right!!! it will overwrite!!! 
                } else if (track[i].deltaTime != 0 && track[i].deltaTime != 1) {
                    notes_and_times.push(["Pause", track[i].deltaTime])
                }
                notes_array.push(note)
                delta_times.push(track[i].deltaTime)
                // notes_array.push(track[i].deltaTime)
            } else {
                // console.log("not 2: ", data)
            }
        }
    }

    // first byte (yes, reasonable) is note number, second is velocity (force in which which a note is played)
    // you only care about the note number 
    // console.log({ data_array })
    console.log({ delta_times })
    console.log({ notes_array })
    console.log({notes_and_times})

    // midiArray.events.

    // const jsonContent = JSON.stringify(notes_array);
    const jsonContent = JSON.stringify(notes_and_times);

    fs.writeFile("./notes_array.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

});