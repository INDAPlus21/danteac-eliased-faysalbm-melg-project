import { songs } from "../songs.js"
import { song } from "../song.js"
import { parseFile } from "../web_parse.js"
import init, { receive_notes, process_file, process_send_ai } from './integrated_rust/pkg/integrated_rust.js';
import { combineTracks } from "./combineTracks.js"

const cached = {}

// s for state 
const s = {
    played_notes: [],
    notes_audios: {},
    notes_elems: {},
    previous_heights: 0,
    self_play: false,
    time_last_event: performance.now(), // should really be reinitialized the first note user 
    time_since_mouse_move: performance.now(),
    notes: {
        255: "no_note", 127: "G9", 126: "Gb9", 125: "F9", 124: "E9", 123: "Eb9", 122: "D9", 121: "Db9", 120: "C9", 119: "B8", 118: "Bb8", 117: "A8", 116: "Ab8", 115: "G8", 114: "Gb8", 113: "F8", 112: "E8", 111: "Eb8", 110: "D8", 109: "Db8", 108: "C8", 107: "B7", 106: "Bb7", 105: "A7", 104: "Ab7", 103: "G7", 102: "Gb7", 101: "F7", 100: "E7", 99: "Eb7", 98: "D7", 97: "Db7", 96: "C7", 95: "B6", 94: "Bb6", 93: "A6", 92: "Ab6", 91: "G6", 90: "Gb6", 89: "F6", 88: "E6", 87: "Eb6", 86: "D6", 85: "Db6", 84: "C6", 83: "B5", 82: "Bb5", 81: "A5", 80: "Ab5", 79: "G5", 78: "Gb5", 77: "F5", 76: "E5", 75: "Eb5", 74: "D5", 73: "Db5", 72: "C5", 71: "B4", 70: "Bb4", 69: "A4", 68: "Ab4", 67: "G4", 66: "Gb4", 65: "F4", 64: "E4", 63: "Eb4", 62: "D4", 61: "Db4", 60: "C4", 59: "B3", 58: "Bb3", 57: "A3", 56: "Ab3", 55: "G3", 54: "Gb3", 53: "F3", 52: "E3", 51: "Eb3", 50: "D3", 49: "Db3", 48: "C3", 47: "B2", 46: "Bb2", 45: "A2", 44: "Ab2", 43: "G2", 42: "Gb2", 41: "F2", 40: "E2", 39: "Eb2", 38: "D2", 37: "Db2", 36: "C2", 35: "B1", 34: "Bb1", 33: "A1", 32: "Ab1", 31: "G1", 30: "Gb1",
        29: "F1", 28: "E1", 27: "Eb1", 26: "D1", 25: "Db1", 24: "C1", 23: "B0", 22: "Bb0", 21: "A0", 20: "Ab", 19: "G", 18: "Gb", 17: "F", 16: "E", 15: "Eb", 14: "D", 13: "C#", 12: "C0", 11: "B", 10: "Bb", 9: "A", 8: "Ab", 7: "G", 6: "Gb", 5: "F", 4: "E", 3: "Eb", 2: "D", 1: "C#", 0: "C-1"
    },
    reverse_notes: {
        'C-1': '0', 'C#': '13', D: '14', Eb: '15', E: '16', F: '17', Gb: '18', G: '19', Ab: '20', A: '9', Bb: '10', B: '11', C0: '12', A0: '21', Bb0: '22', B0: '23', C1: '24', Db1: '25', D1: '26', Eb1: '27', E1: '28', F1: '29', Gb1: '30', G1: '31', Ab1: '32', A1: '33', Bb1: '34', B1: '35', C2: '36', Db2: '37', D2: '38', Eb2: '39', E2: '40', F2: '41', Gb2: '42', G2: '43', Ab2: '44', A2: '45', Bb2: '46', B2: '47', C3: '48', Db3: '49', D3: '50',
        Eb3: '51', E3: '52', F3: '53', Gb3: '54', G3: '55', Ab3: '56', A3: '57', Bb3: '58', B3: '59', C4: '60', Db4: '61', D4: '62', Eb4: '63', E4: '64', F4: '65', Gb4: '66', G4: '67', Ab4: '68', A4: '69', Bb4: '70', B4: '71', C5: '72', Db5: '73', D5: '74', Eb5: '75', E5: '76', F5: '77', Gb5: '78', G5: '79', Ab5: '80', A5: '81', Bb5: '82', B5: '83', C6: '84', Db6: '85', D6: '86', Eb6: '87', E6: '88', F6: '89', Gb6: '90', G6: '91', Ab6: '92', A6: '93', Bb6: '94', B6: '95', C7: '96', Db7: '97', D7: '98', Eb7: '99', E7: '100', F7: '101', Gb7: '102', G7: '103', Ab7: '104', A7: '105', Bb7: '106', B7: '107', C8: '108', Db8: '109', D8: '110', Eb8: '111', E8: '112', F8: '113', Gb8: '114', G8: '115', Ab8: '116', A8: '117', Bb8: '118', B8: '119', C9: '120', Db9: '121', D9: '122', Eb9: '123', E9: '124', F9: '125', Gb9: '126', G9: '127', no_note: '255'
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function getKeyOctave(key) {
    const octave = key.match(/\d+/)[0]
    key = key.replace(/\d+/, "")
    return [key, octave]
}

function setTempo(tempo, song_to_play, original_song_to_play) {
    console.log({ tempo })
    for (let i = 0; i < song_to_play.length; i++) {
        song_to_play[i][1] = original_song_to_play[i][1] / tempo
    }
    // console.log("new tempo: ", original_song_to_play[i - 1][1] / tempo)
}

function transposeUp(song_to_play) {
    for (let i = 0; i < song_to_play.length; i++) {
        song_to_play[i][0] = song_to_play[i][0].replace(/\d+$/, function (n) { return ++n })
    }
}

// do not use audio elements!!! 
// https://stackoverflow.com/questions/54509959/how-do-i-play-audio-files-synchronously-in-javascript

function playNote(note, keyboard = false) {
    const url = (note.includes("piano-mp3")) ? note : "./piano-mp3/" + note + ".mp3"
    // console.log(url)
    const audio = new Audio(url) // (notes_audios[note]) ? notes_audios[note] : 
    audio.addEventListener("canplaythrough", (event) => {
        audio.play()
    })

    if (keyboard) {
        setTimeout(() => {
            audio.pause()
        }, 1000)
    }

    s.notes_audios[note] = audio // is unneccessary for already assigned  
}

// it's only self-play which calls this 
function pauseNote(note) {
    const audio = s.notes_audios[note]

    // without timeout it just sounds bad, wayyyy to short and robotic, not natural 
    setTimeout(() => {
        audio.pause()
    }, 800)

    delete s.notes_audios[note]
}

function colorTile(key, octave, hand) {
    const key_tiles = document.getElementsByClassName(key)
    const key_tile = key_tiles[octave - 1]
    if (key_tile) { /* (if it's outside the display, should be fixed) */
        if (hand == 0) /* left */ {
            key_tile.style.background = "linear-gradient(180deg, rgba(15,51,208,1) 0%, rgba(0,249,255,1) 100%)";
        } else {
            key_tile.style.background = "linear-gradient(180deg, rgba(201,0,0,1) 0%, rgba(252,203,0,1) 100%)"; // "linear-gradient(180deg, rgba(255,7,7,1) 0%, rgba(240,181,108,1) 100%)";
        }
        if (key_tile.className.includes("white")) {
            key_tile.style.boxShadow = "1px 1px 5px #555 inset";
        }
    }
}

function unColorTile(key, octave) {
    const key_tiles = document.getElementsByClassName(key)
    const key_tile = key_tiles[octave - 1]
    if (key_tile) { /* (if it's outside the display, should be fixed) */
        if (key_tile.className.includes("white")) {
            key_tile.style.background = "white"
            key_tile.style.boxShadow = "";
        } else {
            key_tile.style.background = "black"
        }
    }
}

export async function selfPlay(song_to_play) {
    /* let notes_container = document.getElementById("falling-tiles-container")
    notes_container.remove()
    const new_notes_container = document.createElement("div")
    new_notes_container.id = "falling-tiles-container" 
    document.getElementById("piano-display").prepend(new_notes_container)

    console.log({ song_to_play }) */

    const notes_container = document.getElementById("falling-tiles-container")

    const num_tiles_start = Math.min(song_to_play.length, 90)

    for (let i = 0; i < num_tiles_start; i++) {
        addEventToDisplay(song_to_play, i)
    }

    let total_delta_height = 0

    console.log({ song_to_play }, { num_tiles_start })

    // iterate through all the notes in the song 
    for (let i = 0; i < song_to_play.length; i++) {
        const note = song_to_play[i][0]
        const delta_time = song_to_play[i][1]

        notes_container.animate([
            { transform: 'translateY(' + (total_delta_height + delta_time * 0.4) + 'px)' }
        ], {
            duration: delta_time,
            iterations: 1,
            fill: 'forwards'
        });

        total_delta_height += delta_time * 0.4

        const sleep_time = performance.now()

        if (delta_time) {
            await sleep(delta_time)
        }
        // console.log("sleep took %fms, should have taken %sms", ((performance.now() - sleep_time)).toString().slice(0, 4), delta_time)

        const time = performance.now()

        const [key, octave] = getKeyOctave(note)

        if (s.notes_audios[note]) {
            addEventToDisplay(song_to_play, i + num_tiles_start)

            pauseNote(note)

            unColorTile(key, octave)
        } else {
            addEventToDisplay(song_to_play, i + num_tiles_start)

            playNote(note)
            colorTile(key, octave, song_to_play[i][2])
        }

        // console.log("midi event took %fms", ((performance.now() - time)).toString().slice(0, 4))
    }

    notes_container.innerHTML = ""

    /* setTimeout(async function() {
        const response = await fetch("/midis/Never_Gonna_Give_You_Up.mid");
        const content = await response.arrayBuffer();

        bufferToParser(content)
    }, 1000) */
}

// one idea is to replace this with WebGL  
// ??r f??r att settimeout blir helt disturbed av att man renderar om ej async
async function addEventToDisplay(song_to_play, i) {
    if (song_to_play[i]) {
        const key = song_to_play[i][0]

        const height = song_to_play[i][1] * 0.4
        s.previous_heights += height

        if (!s.notes_elems[key]) {
            const falling_tile = document.createElement("div")

            falling_tile.className = "falling-tile"
            if (song_to_play[i][0].includes("b")) {
                falling_tile.className += " black-falling-tile"
            }

            falling_tile.style.display = "none"
            falling_tile.style.bottom = s.previous_heights + "px"
            document.getElementById("falling-tiles-container").prepend(falling_tile)

            if (song_to_play[i][2] == 1) {
                falling_tile.style.background = "linear-gradient(180deg, rgba(201,0,0,1) 0%, rgba(252,203,0,1) 100%)";
            }

            s.notes_elems[key] = falling_tile
            return
        }

        for (const individual_key in s.notes_elems) {
            const current_height = parseFloat(s.notes_elems[individual_key].style.height) || 0
            s.notes_elems[individual_key].style.height = current_height + height + "px"
        }

        const [key_without_octave, octave] = getKeyOctave(key)

        // position it directly above a piano keyboard key 
        const key_elements = document.getElementsByClassName(key_without_octave)

        // returns rectangel with rect.top, rect.right, rect.bottom, rect.left
        // should be fixed 

        const key_octave_tile = key_elements[octave - 1]

        // if key octave tile 
        // by default getBoudningClientRect returns width+padding+border
        let left_margin = key_elements[octave - 1].getBoundingClientRect().left
        // left_margin += parseInt(key_elements[octave - 1].style.marginLeft)

        if (key_without_octave == "E") {
            left_margin += 10;
        } else if (key_without_octave == "D") {
            left_margin += 5;
        } else if (key_without_octave == "B") {
            left_margin += 7;
        } else if (key_without_octave == "A") {
            left_margin += 5;
        } else if (key_without_octave == "G") {
            left_margin += 5;
        } else if (key_without_octave == "F") {
            left_margin += 2;
        } else if (key_without_octave == "C") {
            left_margin += 1;
        }
        /* if (["D", "E", "F", "G", "A", "B"].includes(key_without_octave)) {
            left_margin += 5; 
        } */

        s.notes_elems[key].style.left = left_margin + "px"

        s.notes_elems[key].style.display = "block"

        delete s.notes_elems[key]

        // you only need to check the bottom element here... 
        // and the number here is dependent on the height above the piano line 
        // negative top values means over piano_top, we want to remove high values 

        const child = document.getElementById("falling-tiles-container").lastChild
        const tile_top = child.getBoundingClientRect().top;
        const top = tile_top - cached.piano_top;

        if (top > 200) {
            // console.log("removing")
            child.remove()
        }
    }
}


function setUpKeyboard() {
    // set up song selection 
    /* for (let elem in songs) {
        let opt = document.createElement("option")
        opt.value = elem
        opt.innerHTML = elem
        document.getElementById("select-song").appendChild(opt)
    } 
    
    window.setTempo = setTempo
    */

    const tiles = document.getElementsByClassName("tile")

    const container = document.getElementById("keyboard-container")
    const template = document.getElementById("template")

    for (let i = 0; i < 8; i++) {
        const clone = template.content.cloneNode(true)
        clone.className += " " + i
        container.appendChild(clone)
    }

    const octaves = document.getElementsByClassName("octave-container")
    const letter_mapping = [
        [">", "A", "Z", "S", "X", "C", "F", "V", "G", "B", "H", "N"],
        ["M", "K", ",", "L", ".", "??", "-", "???", "*", "???", "n4", "n1"],
        ["Q", "2", "W", "3", "E", "R", "5", "T", "6", "Y", "7", "U"],
        ["I", "9", "O", "0", "P", "??", "`", "^", "???", "???", "Lk", "n7"],
        ["n8", "n/", "n9"]
    ]

    for (let i = 0; i < octaves.length; i++) {
        octaves[i].className += " " + i
        const children = octaves[i].children
        for (let j = 0; j < children.length; j++) {
            const letter = document.createElement("div")
            letter.className = "new-letter"
            if (children[j].className.includes("black")) {
                letter.className += " new-letter-black"
            }
            if (i > 0 && i < 6 && !(i == 5 && j > 2)) { // so you don't painting undefined
                letter.innerHTML = letter_mapping[i - 1][j]
            }
            children[j].append(letter)
        }
    }

    tiles[0].style.borderTopLeftRadius = "5px"
    tiles[tiles.length - 1].style.borderTopRightRadius = "5px"
    tiles[tiles.length - 1].style.borderRightWidth = "2px"

    function getNote(event) {
        const key = event.srcElement.classList[1]
        const octave = parseInt(event.srcElement.parentNode.classList[1]) + 2
        return key + octave
    }

    function playTile(event) {
        const note = getNote(event)
        const url = "./piano-mp3/" + note + ".mp3"
        console.log({ url })
        playNote(url, true)
    }

    for (let i = 0; i < tiles.length; i++) {
        // eslint-disable-next-line no-var
        var should_press_key = false // it's important to have var here 

        // I think there's some bug when rolling and end note, but I don't care 

        tiles[i].addEventListener("mousedown", (event) => {
            addToTime(getNote(event))
            playTile(event)
            should_press_key = true
            // you could have some complicated solution to this (to what?)
        })

        tiles[i].addEventListener("mouseup", function (event) {
            addToTime(getNote(event))
            should_press_key = false
        })

        // Makes it possible to roll on keys with the mouse 
        tiles[i].addEventListener("mouseover", function (event) {
            if (event.srcElement.classList[2] == "white") {
                event.srcElement.style.backgroundColor = "rgb(228, 228, 228)"
            } else {
                event.srcElement.style.backgroundColor = "rgb(59, 58, 58)"
            }

            if (should_press_key) {
                addToTime(getNote(event))
                playTile(event)
            }
        })

        tiles[i].addEventListener("mouseout", function (event) {
            if (should_press_key) {
                addToTime(getNote(event))
            }

            if (event.srcElement.classList[2] == "white") {
                event.srcElement.style.backgroundColor = "white"
            } else {
                event.srcElement.style.backgroundColor = "black"
            }
        })
    }

    cached.piano_top = document.getElementsByClassName("tile")[0].getBoundingClientRect().top

    // I don't think it can handle when it turns to F claf? 

    if (s.self_play) {
        // let song_to_play = songs["combined_lone"] //.slice(22)
        const song_to_play = song //.slice(22)
        const original_song = JSON.parse(JSON.stringify(song_to_play)) // js references, man  
        setTempo(1, song_to_play, original_song)
        // transposeUp(song_to_play)
        selfPlay(song_to_play)
    }
}

setUpKeyboard()

function addToTime(note) {
    // console.log("key up")

    const time = performance.now()

    if (!s.self_play) {
        s.played_notes.push([note, time - s.time_last_event])
    }

    console.log("played notes: ", s.played_notes)

    s.time_last_event = time
}

function computerKeyboardPress(event) {
    const key = event.code.replace("Key", "").replace("Digit", "")
    console.log({ event })

    if (["Numpad4", "Numpad6"].includes(event.code)) {
        event.preventDefault()
    }

    // semicolon = ??, quote = ??, backslash = * 
    const keyboard_mapping = {
        0: { "IntlBackslash": "C", "A": "Db", "Z": "D", "S": "Eb", "X": "E", "C": "F", "F": "Gb", "V": "G", "G": "Ab", "B": "A", "H": "Bb", "N": "B" }
        , 1: { "M": "C", "K": "Db", "Comma": "D", "L": "Eb", "Period": "E", "Slash": "F", "Quote": "Gb", "ShiftRight": "G", "Backslash": "Ab", "ArrowUp": "A", "Numpad4": "Bb", "Numpad1": "B" }
        , 2: { "Q": "C", "2": "Db", "W": "D", "3": "Eb", "E": "E", "R": "F", "5": "Gb", "T": "G", "6": "Ab", "Y": "A", "7": "Bb", "U": "B" }
        , 3: { "I": "C", "9": "Db", "O": "D", "0": "Eb", "P": "E", "BracketLeft": "F", "Equal": "Gb", "BracketRight": "G", "Backspace": "Ab", "Enter": "A", "NumLock": "Bb", "Numpad7": "B" }
        , 4: { "Numpad8": "C", "NumpadDivide": "Db", "Numpad9": "D" }
    }

    function determinePlay(keys, octave) {
        if (Object.keys(keys).includes(key)) {
            const elem_with_key = document.getElementsByClassName(keys[key])
            const key_elem = elem_with_key[octave - 1]
            const key_octave = keys[key] + octave

            addToTime(key_octave)

            if (key_elem.className.includes("white")) {
                key_elem.style.backgroundColor = "rgb(228, 228, 228)"
                // don't you also need the actual key 
                document.addEventListener("keyup", function non_anon(e) {
                    addToTime(key_octave)
                    key_elem.style.backgroundColor = "white"
                    e.currentTarget.removeEventListener(e.type, non_anon);
                })
            } else {
                key_elem.style.backgroundColor = "rgb(59, 58, 58)"
                document.addEventListener("keyup", function non_anon(e) {
                    addToTime(key_octave)
                    key_elem.style.backgroundColor = "black"
                    e.currentTarget.removeEventListener(e.type, non_anon);
                })
            }

            playNote(key_octave, true)

            return
        }
    }

    for (let i = 0; i < Object.keys(keyboard_mapping).length; i++) {
        determinePlay(keyboard_mapping[i], i + 2)
    }
}

document.addEventListener("keydown", computerKeyboardPress)

const input = document.querySelector('input[type=file]');

/* window.onload = function () {
    // configure MIDIReader
    const source = document.getElementById('import');
 
    
    parseFile(source) /* (combined) => {
        console.log(combined)
    }); */

/* MidiParser.parse( source, function(obj){
    // Your callback function
    console.log(obj);
    document.getElementById("output").innerHTML = JSON.stringify(obj, undefined, 2);
}); 
}; */

// you need to fetch wasm not to get TypeError: Cannot read property '__wbindgen_malloc'
await init(await fetch('../integrated_rust/pkg/integrated_rust_bg.wasm'));

function bufferToParser(buff) {
    const array = new Uint8Array(buff);

    console.log({ array })
    console.log("calling process file!")
    const both_songs = process_file(array)

    const parsed_both_songs = [];

    /* in iterates over indexes, of iterates over actual values */
    for (const song of both_songs) {
        const alphanumeric = []

        for (const event of song) {
            alphanumeric.push([s.notes[event[0]], event[1]])
        }

        parsed_both_songs.push(alphanumeric)
    }

    let combined
    if (parsed_both_songs.length > 1) {
        combined = combineTracks(parsed_both_songs[0], parsed_both_songs[1])
    } else {
        combined = parsed_both_songs[0]
    }

    const original_song = JSON.parse(JSON.stringify(combined)) // js references, man  
    setTempo(1, combined, original_song)

    selfPlay(combined);
}

input.addEventListener("change", () => {
    const file = input.files[0]

    console.log({ file })

    file.arrayBuffer().then(buff => {
        bufferToParser(buff);
    });
})

document.getElementById("import_ai").addEventListener("change", () => {
    console.log("in change ai")
    const file = document.getElementById("import_ai").files[0]

    console.log({ file })

    file.arrayBuffer().then(buff => {

        const array = new Uint8Array(buff);

        console.log({ array })
        console.log("calling process file!")
        const number_song = process_send_ai(array)

        console.log({ number_song })

        const alphanumeric = []

        /* in iterates over indexes, of iterates over actual values */
        /* for (const event of number_song) {
            alphanumeric.push([s.notes[event[0]], event[1], 0])
        }  */

        for (let i = 0; i < number_song[0].length; i++) {
            alphanumeric.push([s.notes[number_song[0][i]], number_song[1][i], 0])
        }

        // const original_song = JSON.parse(JSON.stringify(combined)) // js references, man  
        // setTempo(2, combined, original_song)

        // console.log({alphanumeric})

        // selfPlay(alphanumeric_two); 
        selfPlay(alphanumeric);
    });
})

document.getElementById("pass_own_to_ai").addEventListener("click", () => {
    console.log("sending notes")

    const note_length = s.played_notes.length
    const played_with_u8 = [];

    for (let i = 0; i < note_length; i++) {
        played_with_u8.push([parseInt(s.reverse_notes[s.played_notes[i][0]]), s.played_notes[i][1]])
    }

    console.log(played_with_u8)

    const generated_events = receive_notes(played_with_u8)

    const generated_with_delta = []

    for (let i = 0; i < generated_events[0].length; i++) {
        generated_with_delta.push([s.notes[generated_events[0][i]], generated_events[1][i], 0])
    }

    console.log({ generated_events })
    console.log({ generated_with_delta })

    selfPlay(generated_with_delta)
})


document.addEventListener('mousemove', e => {
    console.log("mouse moved")
    const time_diff = performance.now() - s.time_since_mouse_move
    s.time_since_mouse_move = performance.now()
    console.log({time_diff})
    const buttons = document.getElementsByClassName("button")
    for (let i = 0; i < buttons.length; i++) { 
        // buttons[i].style.display = "inline-block"; 
        buttons[i].style.opacity = "1"; 
    }
});

setInterval(() => {
    const time_diff = performance.now() - s.time_since_mouse_move
    if (time_diff > 1000) {
        console.log("hide")
        const buttons = document.getElementsByClassName("button")
        for (let i = 0; i < buttons.length; i++) { 
            // buttons[i].style.display = "none"; 
            buttons[i].style.opacity = "0"; 
        }
    }
}, 1000) 