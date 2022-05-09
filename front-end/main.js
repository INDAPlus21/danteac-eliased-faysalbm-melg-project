import { songs } from "../songs.js"
import { song } from "../song.js"

const self_play = false
const notes_audios = {}
let previous_heights = 0
const notes_elems = {}
let time_last_event = performance.now()

const cached = {}
const played_notes = []
const current_notes = {}

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

    if (!self_play) {
        current_notes[note] = 0
    }

    console.log(played_notes)

    notes_audios[note] = audio // is unneccessary for already assigned  
}

// it's only self-play which calls this 
function pauseNote(note) {
    const audio = notes_audios[note]

    // without timeout it just sounds bad, wayyyy to short and robotic, not natural 
    setTimeout(() => {
        audio.pause()
    }, 1000)

    delete notes_audios[note]
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

async function selfPlay(song_to_play) {
    const notes_container = document.getElementById("falling-tiles-container")

    const num_tiles_start = Math.min(song_to_play.length, 80)

    for (let i = 0; i < num_tiles_start; i++) {
        addEventToDisplay(song_to_play, i)
    }

    let total_delta_height = 0

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

        // use date milliseconds instead 
        // jag tror att en stor anledning till att animate inte blir korrekt 
        // är för att settimeout blir helt disturbed av att man renderar 
        const sleep_time = performance.now()

        if (delta_time) {
            await sleep(delta_time)
        }
        console.log("sleep took %fms, should have taken %sms", ((performance.now() - sleep_time)).toString().slice(0, 4), delta_time)


        const time = performance.now()

        const [key, octave] = getKeyOctave(note)

        if (notes_audios[note]) {
            addEventToDisplay(song_to_play, i + num_tiles_start) // you need to start adding immediately 

            pauseNote(note)

            // new solution is that everything is happening too high up to see 

            unColorTile(key, octave)
        } else {
            addEventToDisplay(song_to_play, i + num_tiles_start)

            playNote(note)
            colorTile(key, octave, song_to_play[i][2])
        }

        // string substitution patterns !
        console.log("midi event took %fms", ((performance.now() - time)).toString().slice(0, 4))
    }

    notes_container.innerHTML = ""
}

// one idea is to replace this with a canvas 
async function addEventToDisplay(song_to_play, i) {
    if (song_to_play[i]) {
        const key = song_to_play[i][0]

        const height = song_to_play[i][1] * 0.4
        previous_heights += height

        if (!notes_elems[key]) {
            const falling_tile = document.createElement("div")

            falling_tile.className = "falling-tile"
            if (song_to_play[i][0].includes("b")) {
                falling_tile.className += " black-falling-tile"
            }

            falling_tile.style.display = "none"
            falling_tile.style.bottom = previous_heights + "px"
            document.getElementById("falling-tiles-container").prepend(falling_tile)

            if (song_to_play[i][2] == 1) {
                falling_tile.style.background = "linear-gradient(180deg, rgba(201,0,0,1) 0%, rgba(252,203,0,1) 100%)";
            }

            notes_elems[key] = falling_tile
            return
        }

        for (const individual_key in notes_elems) {
            const current_height = parseFloat(notes_elems[individual_key].style.height) || 0
            notes_elems[individual_key].style.height = current_height + height + "px"
        }

        const [key_without_octave, octave] = getKeyOctave(key)

        // position it directly above a piano keyboard key 
        const key_elements = document.getElementsByClassName(key_without_octave)

        // returns rectangel with rect.top, rect.right, rect.bottom, rect.left
        // should be fixed 

        const key_octave_tile = key_elements[octave - 1]

        let left_margin
        if (key_octave_tile) {
            left_margin = key_elements[octave - 1].getBoundingClientRect().left
        }

        notes_elems[key].style.left = left_margin + "px"

        notes_elems[key].style.display = "block"

        delete notes_elems[key]

        // you only need to check the bottom element here... 
        // and the number here is dependent on the height above the piano line 
        // negative top values means over piano_top, we want to remove high values 

        const child = document.getElementById("falling-tiles-container").lastChild
        const tile_top = child.getBoundingClientRect().top;
        const top = tile_top - cached.piano_top;

        if (top > 200) {
            console.log("removing")
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
        ["M", "K", ",", "L", ".", "Ö", "-", "↑", "*", "▲", "n4", "n1"],
        ["Q", "2", "W", "3", "E", "R", "5", "T", "6", "Y", "7", "U"],
        ["I", "9", "O", "0", "P", "Å", "`", "^", "←", "←", "Lk", "n7"],
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

    if (self_play) {
        // let song_to_play = songs["combined_lone"] //.slice(22)
        const song_to_play = song //.slice(22)
        const original_song = JSON.parse(JSON.stringify(song_to_play)) // js references, man  
        // setTempo(2, song_to_play, original_song)
        // transposeUp(song_to_play)
        selfPlay(song_to_play)
    }
}

setUpKeyboard()

function addToTime(note) {
    console.log("key up")

    const time = performance.now()

    if (!self_play) {
        played_notes.push([note, time - time_last_event])
    }

    time_last_event = time
}

function computerKeyboardPress(event) {
    const key = event.code.replace("Key", "").replace("Digit", "")
    console.log({ event })

    if (["Numpad4", "Numpad6"].includes(event.code)) {
        event.preventDefault()
    }

    // semicolon = ö, quote = ä, backslash = * 
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