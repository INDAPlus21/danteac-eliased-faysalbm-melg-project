import { songs } from "../songs.js"
import { song } from "../song.js"

let self_play = true

// #region MISCELLENOUS FUNCTIONS  
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0
}

function getKeyOctave(key) {
    let octave = key.match(/\d+/)[0]
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

// #endregion

let notes_audios = {}

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

    notes_audios[note] = audio // is unneccessary for already assigned  
}

// it's only self-play which calls this 
function pauseNote(note) {
    // console.log(notes_audios)
    // const audio = notes_audios[note]
    const url = (note.includes("piano-mp3")) ? note : "./piano-mp3/" + note + ".mp3"
    const audio = notes_audios[note]

    // without timeout it just sounds bad, wayyyy to short and robotic, not natural 
    setTimeout(() => {
        console.log("removing")
        audio.pause()
    }, 1000)

    delete notes_audios[note]
}

function colorTile(key, octave) {
    let elem_with_key = document.getElementsByClassName(key)
    let key_elem = elem_with_key[octave - 2]
    key_elem.style.background = "linear-gradient(180deg, rgba(15,51,208,1) 0%, rgba(0,249,255,1) 100%)";
    if (key_elem.className.includes("white")) {
        key_elem.style.boxShadow = "1px 1px 5px #555 inset";
    }
}

function unColorTile(key, octave) {
    let elem_with_key = document.getElementsByClassName(key)
    let key_elem = elem_with_key[octave - 2]
    if (key_elem.className.includes("white")) {
        key_elem.style.background = "white"
        key_elem.style.boxShadow = "";
    } else {
        key_elem.style.background = "black"
        key_elem.style.filter = "brightness(100%)";
    }
}

async function selfPlay(song_to_play, reset_tiles = true) {
    // iterate through all the notes in the song 
    let notes_container = document.getElementById("falling-tiles-container")
    notes_container.animate([
        { transform: 'translateY(' + 31500 + 'px)' }
    ], {
        duration: 92000,
        iterations: 1
    });

    // jag tror att en stor anledning till att animate inte blir korrekt 
    // är för att settimeout blir helt disturbed av att man renderar 

    let to_close = []

    for (let i = 0; i < song_to_play.length; i++) { // song_to_play.length
        const note = song_to_play[i][0]
        const delta_time = song_to_play[i][1] // wait yeah actually that's expected behaviour 

        console.log(song_to_play)
        console.log(delta_time)
        const next_delta_time = (song_to_play[i + 1]) ? song_to_play[i + 1][1] : 0 // should it be 0? 

        await sleep(delta_time)

        let [key, octave] = getKeyOctave(note)

        if (notes_audios[note]) {
            // addEventToDisplay(song_to_play, i)

            pauseNote(note)
            // song_to_play.splice(i, 1)
            // i--

            // new solution is that everything is happening too high up to see 
            // the problem is that it should only update when it's "valid" midi, meaning no 
            // "loose" notes that doesn't get closed 

            // determine IF ANY OF THE CURRENT REMOVED are loose 
            // deltatime is irrelevant 
            // but you don't know if it's for closing that or not 
            // and deltaTime 0 would only be a proxy... 
            // you can check if the coming 10 notes all are closed in the coming 40 
            // sure, sounds reasonable 
            // you could improve this algorithm's time complexity 
            // wait! if note_audios is EMPTY!!! (no... not exactly...)
            /* let update_falling = true
            for (let j = 0; j < 10; j++) { 
                let closed = false
                let inner_note = song_to_play[j][1]
                for (let k = j; k < j + 5; k++) { 
                    if (inner_note == song_to_play[k][1]) {
                        closed = true
                    }
                }
                if (!closed) {
                    update_falling = false
                }
            } */
            // to check that the notes are even is a good check ;P 
            // song to play length is equally divisible by number in notes audios!!! 
            // feels like there should be a hack, but why should there? 
            // the whole problem is caused by you making it an invalid midi file 
            // (Object.keys(notes_audios).length + 1) == 0

            /* let number_keys_same = 0 
            for (var j = 0; j < song_to_play.length; j++) { 
                if song_to_play[j][1] == 
                number_keys_same++
            } */

            // but this also needs to be integrated with the song_to_play splicing 
            // problem is that all must be closed... 
            // if (delta_time != 0)
            // it solved the problem of no INVALID midi files being displayed, but introduces 
            // the problem of too few valid ones 1

            // I think the first step is to get a better updating function 
            // only way you can solve both this problem and the animation problem 

            unColorTile(key, octave)
        } else {
            /* if (delta_time == 0) {
                to_close.push(note)
            } */

            // addEventToDisplay(song_to_play, i)

            playNote(note)
            // song_to_play.splice(i, 1)
            // i--
            colorTile(key, octave)
        }
    }
    updateFallingTiles(song_to_play, reset_tiles)
}

let previous_heights = 0
let notes_elems = {}

function addEventToDisplay(song_to_play, i) {
    let key = song_to_play[i][0]

    let height = song_to_play[i][1] * 0.4
    previous_heights += height

    if (!notes_elems[key]) {
        let falling_tile = document.createElement("div")

        falling_tile.className = "falling-tile"
        falling_tile.style.display = "none"
        falling_tile.style.bottom = previous_heights + "px"
        document.getElementById("falling-tiles-container").prepend(falling_tile)

        notes_elems[key] = falling_tile
        return
    }

    for (let individual_key in notes_elems) {
        let current_height = parseFloat(notes_elems[individual_key].style.height) || 0
        notes_elems[individual_key].style.height = current_height + height + "px"
    }

    let [key_without_octave, octave] = getKeyOctave(key)

    // position it directly above a piano keyboard key 
    let key_elements = document.getElementsByClassName(key_without_octave)

    // returns rectangel with rect.top, rect.right, rect.bottom, rect.left
    let left_margin = key_elements[octave - 2].getBoundingClientRect().left + 5

    if (song_to_play[i][0].includes("b")) {
        left_margin -= 14
    }

    notes_elems[key].style.left = left_margin + "px"

    notes_elems[key].style.display = "block"

    delete notes_elems[key]
}

function updateFallingTiles(song_to_play) {
    // ok remember that you'll ANIMATE, you won't need to adjust any heights after the fact 
    // just that they are aligned 

    let how_many_elem = Math.min(song_to_play.length, 40)

    for (let i = 0; i < how_many_elem; i++) {
        addEventToDisplay(song_to_play, i)
    }
}

// IT'S THIS THAT IS BLOCKING (that makes it so it can't go faster)
/* function updateFallingTiles(song_to_play, reset_tiles = true) {
    // reset all values 
    let notes_container = document.getElementById("falling-tiles-container")
    if (reset_tiles) {
        notes_container.innerHTML = ""
    }

    let how_many_elem = Math.min(song_to_play.length, 40)
    let notes_elems = {}
    let previous_heights = 0

    for (let i = 0; i < how_many_elem; i++) {

        let index = i
        let key = song_to_play[index][0]

        let height = song_to_play[i][1] * 0.4
        previous_heights += height

        let added_this_iteration = false

        if (!notes_elems[key]) {
            let falling_tile = document.createElement("div")
            falling_tile.id = "play-" + i
            falling_tile.className = "falling-tile"
            falling_tile.style.display = "none"
            document.getElementById("falling-tiles-container").prepend(falling_tile)
            notes_elems[key] = falling_tile
            added_this_iteration = true
            falling_tile.style.bottom = previous_heights + "px"
        }

        for (let individual_key in notes_elems) {
            if (!added_this_iteration) {
                let current_height = parseFloat(notes_elems[individual_key].style.height) || 0
                notes_elems[individual_key].style.height = current_height + height + "px"
            }
        }

        if (notes_elems[key] && !added_this_iteration) {
            let [key_without_octave, octave] = getKeyOctave(key)

            // position it directly above a piano keyboard key 
            let key_elements = document.getElementsByClassName(key_without_octave)

            // returns rectangel with rect.top, rect.right, rect.bottom, rect.left
            let left_margin = key_elements[octave - 2].getBoundingClientRect().left + 5

            if (song_to_play[index][0].includes("b")) {
                left_margin -= 14
            }

            notes_elems[key].style.left = left_margin + "px"

            notes_elems[key].style.display = "block"

            delete notes_elems[key]
        }
    }
} */

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

    let tiles = document.getElementsByClassName("tile")

    let container = document.getElementById("keyboard-container")
    const template = document.getElementById("template")

    for (let i = 1; i < 8; i++) {
        const clone = template.content.cloneNode(true)
        clone.className += " " + i
        container.appendChild(clone)
    }

    let octaves = document.getElementsByClassName("octave-container")
    let letter_mapping = [
        [">", "A", "Z", "S", "X", "C", "F", "V", "G", "B", "H", "N"],
        ["M", "K", ",", "L", ".", "Ö", "-", "↑", "*", "▲", "n4", "n1"],
        ["Q", "2", "W", "3", "E", "R", "5", "T", "6", "Y", "7", "U"],
        ["I", "9", "O", "0", "P", "Å", "`", "^", "←", "←", "Lk", "n7"],
        ["n8", "n/", "n9"]
    ]

    for (let i = 0; i < octaves.length; i++) {
        octaves[i].className += " " + i
        let children = octaves[i].children
        console.log(children.length)
        for (let j = 0; j < children.length; j++) {
            let letter = document.createElement("div")
            letter.className = "new-letter"
            if (children[j].className.includes("black")) {
                letter.className += " new-letter-black"
            }
            if (i < 5 && !(i == 4 && j > 2)) { // so you don't painting undefined
                // console.log(letter_mapping[i][j])
                letter.innerHTML = letter_mapping[i][j]
            }
            children[j].append(letter)
        }
    }

    tiles[0].style.borderTopLeftRadius = "5px"
    tiles[tiles.length - 1].style.borderTopRightRadius = "5px"
    tiles[tiles.length - 1].style.borderRightWidth = "2px"

    function playTile(event) {
        let id = event.srcElement.classList[1] // depracated?? 
        let octave = parseInt(event.srcElement.parentNode.classList[1]) + 2
        let url = "./piano-mp3/" + id + octave + ".mp3"
        console.log({ url })
        playNote(url, true)
    }

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener("click", (event) => {
            playTile(event)
        })

        // Make it possible to roll on keys with the mouse 
        // eslint-disable-next-line no-var
        var should_press_key = false // it's important to have var here 

        tiles[i].addEventListener("mousedown", (event) => {
            // console.log("mousedown", {event})
            should_press_key = true
            // you could have some complicated solution to this 
            // playTile(event)
        })

        tiles[i].addEventListener("mouseover", function (event) {
            console.log("mouseover", { event })
            console.log(event.srcElement.parentNode.classList)
            if (event.srcElement.classList[2] == "white") {
                event.srcElement.style.backgroundColor = "rgb(228, 228, 228)"
            } else {
                event.srcElement.style.backgroundColor = "rgb(59, 58, 58)"
            }

            if (should_press_key) {
                playTile(event)
            }
        })

        tiles[i].addEventListener("mouseout", function (event) {
            if (event.srcElement.classList[2] == "white") {
                event.srcElement.style.backgroundColor = "white"
            } else {
                event.srcElement.style.backgroundColor = "black"
            }
        })

        tiles[i].addEventListener("mouseup", function (event) {
            // console.log("mouseup", {event})
            should_press_key = false
        })
    }

    // I don't think it can handle when it turns to F claf? 

    if (self_play) {
        // let song_to_play = songs["combined_lone"] //.slice(22)
        let song_to_play = song //.slice(22)
        let original_song = JSON.parse(JSON.stringify(song_to_play)) // js references, man  
        // setTempo(2, song_to_play, original_song)
        transposeUp(song_to_play)
        updateFallingTiles(song_to_play, false)
        selfPlay(song_to_play, true)
    }
}

setUpKeyboard()

let played_notes_keyboard = []

function computerKeyboardPress(event) {
    let key = event.code.replace("Key", "").replace("Digit", "")
    console.log({ event })

    if (["Numpad4", "Numpad6"].includes(event.code)) {
        event.preventDefault()
    }

    // semicolon = ö, quote = ä, backslash = * 
    let keyboard_mapping = {
        0: { "IntlBackslash": "C", "A": "Db", "Z": "D", "S": "Eb", "X": "E", "C": "F", "F": "Gb", "V": "G", "G": "Ab", "B": "A", "H": "Bb", "N": "B" }
        , 1: { "M": "C", "K": "Db", "Comma": "D", "L": "Eb", "Period": "E", "Slash": "F", "Quote": "Gb", "ShiftRight": "G", "Backslash": "Ab", "ArrowUp": "A", "Numpad4": "Bb", "Numpad1": "B" }
        , 2: { "Q": "C", "2": "Db", "W": "D", "3": "Eb", "E": "E", "R": "F", "5": "Gb", "T": "G", "6": "Ab", "Y": "A", "7": "Bb", "U": "B" }
        , 3: { "I": "C", "9": "Db", "O": "D", "0": "Eb", "P": "E", "BracketLeft": "F", "Equal": "Gb", "BracketRight": "G", "Backspace": "Ab", "Enter": "A", "NumLock": "Bb", "Numpad7": "B" }
        , 4: { "Numpad8": "C", "NumpadDivide": "Db", "Numpad9": "D" }
    }

    function determinePlay(keys, octave) {
        if (Object.keys(keys).includes(key)) {
            console.log("playing")
            let elem_with_key = document.getElementsByClassName(keys[key])
            let key_elem = elem_with_key[octave - 2]
            let url = "./piano-mp3/" + keys[key] + octave + ".mp3"
            let key_octave = keys[key] + octave
            console.log({ key_elem }, { url })

            console.log({ elem_with_key }, { key_elem })
            if (key_elem.className.includes("white")) {
                key_elem.style.backgroundColor = "rgb(228, 228, 228)"
                // don't you also need the actual key 
                document.addEventListener("keyup", function () {
                    key_elem.style.backgroundColor = "white"
                })
            } else {
                key_elem.style.backgroundColor = "rgb(59, 58, 58)"
                document.addEventListener("keyup", function () {
                    key_elem.style.backgroundColor = "black"
                })
            }


            playNote(key_octave, true)
            played_notes_keyboard.push(key_octave)
        }
    }

    for (let i = 0; i < Object.keys(keyboard_mapping).length; i++) {
        determinePlay(keyboard_mapping[i], i + 2)
    }
}

document.addEventListener("keydown", computerKeyboardPress)