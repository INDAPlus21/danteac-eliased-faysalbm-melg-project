import { songs } from "../songs.js"

let played_notes = []

let has_won = false
let notes_played = 0
let false_notes = 0
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

function transposeUp() {
    for (let i = 0; i < song_to_play.length; i++) {
        song_to_play[i][0] = song_to_play[i][0].replace(/\d+$/, function (n) { return ++n })
    }
}

// #endregion

let notes_audios = {}

// do not use audio elements!!! 
// https://stackoverflow.com/questions/54509959/how-do-i-play-audio-files-synchronously-in-javascript

function playNote(note) {
    const url = (note.includes("piano-mp3")) ? note : "./piano-mp3/" + note + ".mp3"
    // console.log(url)
    const audio = (notes_audios[note]) ? notes_audios[note] : new Audio(url) // controversial ternary operators 
    audio.addEventListener("canplaythrough", (event) => {
        audio.play()
    })
    notes_audios[note] = audio // is unneccessary for already assigned  
}

function pauseNote(note) {
    const url = (note.includes("piano-mp3")) ? note : "./piano-mp3/" + note + ".mp3"
    const audio = (notes_audios[note]) ? notes_audios[note] : new Audio(url)
    // without timeout it just sounds bad, wayyyy to short and robotic, not natural 
    setTimeout(() => {
        audio.pause()
    }, 1000)
    delete notes_audios[note]
}

function colorTile(key, octave) {
    let elem_with_key = document.getElementsByClassName(key)
    let key_elem = elem_with_key[octave - 2]
    if (key_elem.className.includes("white")) {
        key_elem.style.backgroundColor = "rgb(228, 228, 228)"
        key_elem.style.boxShadow = "1px 1px 5px #555 inset";
    } else {
        key_elem.style.backgroundColor = "rgb(59, 58, 58)"
    }
}

function unColorTile(key, octave) {
    let elem_with_key = document.getElementsByClassName(key)
    let key_elem = elem_with_key[octave - 2]
    if (key_elem.className.includes("white")) {
        key_elem.style.backgroundColor = "white"
        key_elem.style.boxShadow = "";
    } else {
        key_elem.style.backgroundColor = "black"
    }
}

async function selfPlay(song_to_play, reset_tiles = true) {
    // iterate through all the notes in the song 
    for (let i = 0; i < song_to_play.length; i++) { // song_to_play.length
        const note = song_to_play[i][0]
        const delta_time = song_to_play[i][1] // wait yeah actually that's expected behaviour 

        /* console.log(song_to_play)
        console.log(delta_time)
        var notes_container = document.getElementById("falling-tiles-container")
        notes_container.animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(' + (delta_time * 0.4) + 'px)' }
        ], {
            duration: delta_time,
            iterations: 1
        }); */

        /* if (delta_time == 0) {
            notes_to_update.push(note)
        } else {
            notes_played += notes_to_update*2
            console.log({notes_played})
            notes_to_update = 0 
            updateFallingTiles()
        } */

        await sleep(delta_time)

        const next_delta_time = (song_to_play[i + 1]) ? song_to_play[i + 1][1] : 0 // should it be 0? 

        // var next_delta_time = song_to_play[i+1][1] // this will cause bugs when nearing end of the track 

        // console.log(JSON.parse(JSON.stringify(notes_audios)))

        // animate tiles 
        // no... playing now height isn't the real issue... 
        // ok so it goes duration 476, then sleep(1) (bc current), then duration 1, 
        // and messes everything up. should be solved by... 
        // but seems like it should happen BEFORE the sleep... 
        // but should it really be -2 

        let [key, octave] = getKeyOctave(note)

        if (notes_audios[note]) {
            pauseNote(note)
            song_to_play.splice(i, 1)
            i--
            if (song_to_play.length % 2 == 0 && next_delta_time != 0) { // hack 
                updateFallingTiles(song_to_play, reset_tiles)
            }
            unColorTile(key, octave)
        } else {
            playNote(note)
            song_to_play.splice(i, 1)
            i--
            colorTile(key, octave)
        }
    }
}

// IT'S THIS THAT IS BLOCKING (that makes it so it can't go faster)
function updateFallingTiles(song_to_play, reset_tiles = true) {
    // reset all values 
    let notes_container = document.getElementById("falling-tiles-container")
    if (reset_tiles) {
        notes_container.innerHTML = ""
    }
    // yes so next step is to cache all the mp3s 
    let how_many_elem = Math.min(song_to_play.length, 40)
    let notes_elems = {}
    let previous_heights = 0

    for (let i = 0; i < how_many_elem; i++) {

        let index = i
        let key = song_to_play[index][0]

        let height = song_to_play[i][1] * 0.4
        previous_heights += height

        let added_this_iteration = false

        // console.log({ song_to_play }, { notes_played }, { i }, { height }, song_to_play[notes_played + i])

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
                // console.log({ current_height }, { individual_key }, JSON.parse(JSON.stringify(notes_elems)), "adding: ", height)
                notes_elems[individual_key].style.height = current_height + height + "px"

                // var current_bottom = parseFloat(notes_elems[individual_key].style.bottom) || 0
                // console.log({ current_bottom }, "adding to bottom: ", height)
                // notes_elems[individual_key].style.bottom = current_bottom + height + "px"
                // console.log("now: ", notes_elems[individual_key].style.bottom)
                // you shouldn't need to change the bottom !!!
                // previous_heights += parseInt(height) || 0 
            }
        }

        if (notes_elems[key] && !added_this_iteration) {
            let [key_without_octave, octave] = getKeyOctave(key)

            // position it directly above a piano keyboard key 
            let key_elements = document.getElementsByClassName(key_without_octave)

            // returns rectangel with rect.top, rect.right, rect.bottom, rect.left
            let left_margin = key_elements[octave - 2].getBoundingClientRect().left + 5

            // console.log({ left_margin })

            if (song_to_play[index][0].includes("b")) {
                left_margin -= 14
            }

            // previous_heights += parseInt(height)

            notes_elems[key].style.left = left_margin + "px"

            notes_elems[key].style.display = "block"

            // no, the case obviously is that they don't even go into this function 
            /* if (left_margin == 0) {
                notes_elems[key].style.display = "none"
            } */
            // notes_elems[key].style.bottom = previous_heights + "px"

            // console.log("removing", { key })
            delete notes_elems[key]
        }
    }

    // notes_played += 2
}

function challengeFunc(key, octave) {
    // console.log({ key }, { octave }, should_play[number_correct])
    /* if (song_to_play[notes_played][0] == "Pause") {
        played_notes.push("Pause")
        if (!self_play) {
            notes_played++ // ok. great. it's definitely not the pauses that are causing the flickering anymore 
        }
        // but this is in conflict with the other mode of playing 
    } else {
        played_notes.push(key + octave)
    } */

    console.log("in challengefunc: ", { key }, { octave })
    played_notes.push(key + octave)
    // if (key + octave != "Pause" && )
    if (song_to_play[notes_played][0] == key + octave /*|| song_to_play[notes_played][0] == "Pause"*/) {
        // console.log("one more correct")
        // notes_played += 2
        updateFallingTiles() // aha! I don't think this gets called 
    } else {
        false_notes++
    }

    // only at end of track 
    if (notes_played == song_to_play.length && !has_won && !self_play /* arraysEqual(played_notes, should_play)*/) {
        has_won = true
        let stats = document.createElement("div")
        stats.id = "accuracy"
        let notes_container = document.getElementById("falling-tiles-container")
        let white_tiles = document.getElementsByClassName("white")
        console.log({ stats })
        console.log(song_to_play.length / false_notes)
        console.log(song_to_play.length, { number_incorrect: false_notes })
        let accuracy = Math.round((notes_played / (notes_played + false_notes)) * 100)
        if (accuracy == Infinity) accuracy = 100
        console.log({ accuracy })
        stats.innerHTML = "Accuracy: " + accuracy + "%"
        notes_container.append(stats)

        setTimeout(() => {
            playNote("./piano-mp3/C5.mp3")
            playNote("./piano-mp3/E5.mp3")
            playNote("./piano-mp3/G5.mp3")
            console.log(white_tiles.length)
            for (let i = 0; i < white_tiles.length; i++) {
                white_tiles[i].style.backgroundColor = "#51eb5e" // document.body.getComputedStyle("--green") // "#58cf62"
            }
        }, 400)
        setTimeout(() => {
            playNote("./piano-mp3/C5.mp3")
            playNote("./piano-mp3/E5.mp3")
            playNote("./piano-mp3/G5.mp3")
        }, 500)
        setTimeout(() => {
            for (let i = 0; i < white_tiles.length; i++) {
                white_tiles[i].style.backgroundColor = "white"
            }
        }, 1000)

    }
    // console.log({ played_notes }, { should_play })
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

    let tiles = document.getElementsByClassName("tile")

    let container = document.getElementById("keyboard-container")
    const template = document.getElementById("template")

    for (var i = 1; i < 7; i++) {
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

    for (var i = 0; i < octaves.length; i++) {
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
        challengeFunc(id, octave)
        playNote(url)
    }

    for (var i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener("click", (event) => {
            playTile(event)
        })

        // Make it possible to roll on keys with the mouse 
        var should_press_key = false

        tiles[i].addEventListener("mousedown", (event) => {
            // console.log("mousedown", {event})
            should_press_key = true
            // you could have some complicated solution to this 
            // playTile(event)
        })

        tiles[i].addEventListener("mouseover", function (event) {
            // console.log("mouseover", {event})
            if (should_press_key) {
                playTile(event)
            }
        })

        // console.log("mouseup", {event})
        tiles[i].addEventListener("mouseup", function (event) {
            should_press_key = false
        })
    }

    setTimeout(async () => {
        // preLoad()
        // await sleep(3000)
        let left_hand = songs["mario_left"] //.slice(4, 100)
        let original_left = JSON.parse(JSON.stringify(left_hand)) // js references, man  
        setTempo(2, left_hand, original_left)
        updateFallingTiles(left_hand)
        /* if (self_play) {
            selfPlay(left_hand)
        } */
        let right_hand = songs["mario"] //.slice(21, 100)
        let original_right = JSON.parse(JSON.stringify(right_hand)) // js references, man  
        setTempo(2, right_hand, original_right)
        updateFallingTiles(right_hand, false)
        if (self_play) {
            // selfPlay(left_hand, true)
            selfPlay(right_hand, true)
        }
    }, 0) //??? 0 second wait works, but no timeout doesn't??? 
}

setUpKeyboard()

// YES!!! that's a great idea! be able to play two-handed... yes... may actually work 
// implement something guitar-hero like (would be so much fun!)

function computerKeyboardPress(event) {
    let start_keyboard = performance.now()
    /* var key_up = false 
    document.addEventListener('keyup', () => {
        console.log("key up")
        key_up = true 
    }); */
    let key = event.code.replace("Key", "").replace("Digit", "")
    console.log({ event })
    // playSound("./piano-mp3/C2.mp3")

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
        // console.log({ keys }, { octave })
        if (Object.keys(keys).includes(key)) {
            let elem_with_key = document.getElementsByClassName(keys[key])
            let key_elem = elem_with_key[octave - 2]

            console.log({ elem_with_key }, { key_elem })
            if (key_elem.className.includes("white")) {
                key_elem.style.backgroundColor = "rgb(228, 228, 228)"
                // don't you also need the actual key 
                document.addEventListener("keyup", function (event) {
                    let time_to_wait = performance.now() - start_keyboard
                    let play_tiles = document.getElementsByClassName("falling-tile")
                    // console.log({ play_tiles }, play_tiles.length, play_tiles[play_tiles.length - 1], play_tiles[0])
                    // is this the cause of the other bug? 
                    let iter_find_non_pause = 0
                    let playing_now_height = parseInt(play_tiles[play_tiles.length - iter_find_non_pause - 1].style.height)
                    while (song_to_play[notes_played - iter_find_non_pause][0] == "Pause" && iter_find_non_pause < 100) {
                        // console.log(song_to_play[notes_played - iter_find_non_pause][0])
                        playing_now_height = parseInt(play_tiles[play_tiles.length - iter_find_non_pause - 1].style.height)
                        iter_find_non_pause++
                    }
                    // var playing_now_height = parseInt(play_tiles[play_tiles.length - 1].style.height)
                    // console.log({ play_tiles }, { playing_now_height }, { time_to_wait })

                    key_elem.style.backgroundColor = "white"

                    /* for (var j = 0; j < play_tiles.length; j++) {
                        play_tiles[j].animate([
                            // keyframes
                            { transform: 'translateY(0px)' },
                            { transform: 'translateY(' + playing_now_height + 'px)' }
                        ], {
                            // timing options
                            duration: time_to_wait + 5,
                            iterations: 1
                        });
                    } */
                })
            } else {
                key_elem.style.backgroundColor = "rgb(59, 58, 58)"
                document.addEventListener("keyup", function (event) {
                    key_elem.style.backgroundColor = "black"
                })
            }

            let url = "./piano-mp3/" + keys[key] + octave + ".mp3"
            console.log({ key_elem }, { url })

            challengeFunc(keys[key], octave)
            playNote(url)
        }
    }

    for (let i = 0; i < Object.keys(keyboard_mapping).length; i++) {
        determinePlay(keyboard_mapping[i], i + 2)
    }
}

document.addEventListener("keydown", computerKeyboardPress)

/* document.addEventListener('keyup', () => {
    console.log("key up")
    key_up = true 
}); */