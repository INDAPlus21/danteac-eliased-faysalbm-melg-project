import { songs } from "./songs.js"

var played_notes = []

// var song_to_play = songs["mario_left"] //.slice(4, 100)
// console.log(song_to_play.length)

// console.log(song_to_play)
// var original_song_to_play = JSON.parse(JSON.stringify(song_to_play)) // js references, man  

var has_won = false
var notes_played = 0
var false_notes = 0
var self_play = true
/* var play_state = {
    has_won: false, 
    number_correct: 0, 
    number_incorrect: 0
} */

// 4, 6, 8, 10, 12, 14, 16, 18 

// MISCELLENOUS FUNCTIONS  
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function getKeyOctave(key) {
    var octave = key.match(/\d+/)[0]
    key = key.replace(/\d+/, "")
    return [key, octave]
}

function setTempo(tempo, song_to_play, original_song_to_play) {
    console.log({ tempo })
    for (var i = 0; i < song_to_play.length; i++) {
        song_to_play[i][1] = original_song_to_play[i][1] / tempo
    }
    console.log("new tempo: ", original_song_to_play[i - 1][1] / tempo)
}

window.setTempo = setTempo

function preLoad() {
    var order_some_don = ["A", "Ab", "B", "Bb", "C", "D", "Db", "E", "Eb", "F", "G", "Gb"]
    for (var i = 0; i < order_some_don.length; i++) {
        for (var j = 1; j < 8; j++) {
            var url = "./piano-mp3/" + order_some_don[i] + j + ".mp3"
            console.log({url})
            var audio = new Audio(url) // controversial ternary operators 
        }
    }
}

// setTempo(3) // it's possible to set an absurdly high tempo, but it's limited by the css rendering 

function resetVars() {
    song_to_play = [] // to make running function end 
    notes_played = 0
    false_notes = 0
    played_notes = []
    /* setTimeout(() => {
        console.log("in select: ", song_name)
        notes_played = 0
        false_notes = 0
        played_notes = []
        song_to_play = songs[song_name]
        original_song_to_play = JSON.parse(JSON.stringify(song_to_play))
    }, 1000)  */
}

function selectSong(song_name) {
    resetVars()
    setTimeout(() => {
        console.log("in select: ", song_name)
        song_to_play = songs[song_name]
        original_song_to_play = JSON.parse(JSON.stringify(song_to_play))
        setUpKeyboard()
    }, 1000)
    // selfplay is an async function 
}

function stopSelfPlay() {
    song_to_play = [] // to make running function end 
    self_play = !self_play
    var button = document.getElementById("self-play")
    if (button.innerHTML == "Play yourself") button.innerHTML = "Autoplay"
    else button.innerHTML = "Play yourself"
    console.log("stopping")
    resetVars()
    setTimeout(() => {
        song_to_play = JSON.parse(JSON.stringify(original_song_to_play))
        setTempo(3)
        setUpKeyboard()
        /* updateNoteDisplay()
        if (self_play) {
            selfPlay()
        } */
    }, 1000)
}

window.stopSelfPlay = stopSelfPlay

window.selectSong = selectSong

// aha! so it only gets when the server reloads, which it does when I write 
function transposeUp() {
    for (var i = 0; i < song_to_play.length; i++) {
        song_to_play[i][0] = song_to_play[i][0].replace(/\d+$/, function (n) { return ++n });
    }
}
// transposeUp() 

// No. your current implementation can't regardless play two tracks separately 
/* console.log("length before: ", should_play.length)
Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

for (var i = 0; i < songs["fur_elise_left_hand"].length; i++) { 
    console.log("I'm here!!!")
    should_play.insert(i, songs["fur_elise_left_hand"][i]);
}
console.log("length after: ", should_play.length) */

// END OF MISCELLENOUS FUNCTIONS

var notes_audios = {}

// do not use audio elements!!! 
// https://stackoverflow.com/questions/54509959/how-do-i-play-audio-files-synchronously-in-javascript

function playNote(note) {
    const url = (note.includes("piano-mp3")) ? note : "./piano-mp3/" + note + ".mp3"
    // console.log(url)
    const audio = (notes_audios[note]) ? notes_audios[note] : new Audio(url) // controversial ternary operators 
    audio.addEventListener('canplaythrough', (event) => {
        audio.play();
    }) 
    notes_audios[note] = audio // is unneccessary for already assigned  
}

function pauseNote(note) {
    const url = (note.includes("piano-mp3")) ? note : "./piano-mp3/" + note + ".mp3"
    const audio = (notes_audios[note]) ? notes_audios[note] : new Audio(url)
    // without timeout it just sounds bad, wayyyy to short and robotic, not natural 
    setTimeout(() => {
        audio.pause();
    }, 1000)
    delete notes_audios[note]
}

function colorTile(key, octave) {
    var elem_with_key = document.getElementsByClassName(key)
    var key_elem = elem_with_key[octave - 2]
    if (key_elem.className.includes("white")) {
        key_elem.style.backgroundColor = "rgb(228, 228, 228)"
    } else {
        key_elem.style.backgroundColor = "rgb(59, 58, 58)"
    }
}

function unColorTile(key, octave) {
    var elem_with_key = document.getElementsByClassName(key)
    var key_elem = elem_with_key[octave - 2]
    if (key_elem.className.includes("white")) {
        key_elem.style.backgroundColor = "white"
    } else {
        key_elem.style.backgroundColor = "black"
    }
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

async function selfPlay(song_to_play, reset_tiles = true) {
    // iterate through all the notes in the song 
    for (var i = 0; i < song_to_play.length; i++) { // song_to_play.length
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

        var [key, octave] = getKeyOctave(note)

        if (notes_audios[note]) {
            pauseNote(note)
            song_to_play.splice(i, 1)
            i--
            // console.log({ song_to_play })
            if (song_to_play.length % 2 == 0 && next_delta_time != 0) { // hack 
                updateFallingTiles(song_to_play, reset_tiles)
            }
            unColorTile(key, octave)
        } else {
            playNote(note)
            song_to_play.splice(i, 1)
            i--
            colorTile(key, octave) // won't work, but let's not care about that now. this also needs to be synchronized with array... 
        }

        // it feels like you shouldn't be able to do this (wasn't this a cause of a previous bug?)
        // console.log("sleeping for: ", next_delta_time)

        // notes_played += 2
        // if (song_to_play) challengeFunc(key, octave)
    }
}

// IT'S THIS THAT IS BLOCKING (that makes it so it can't go faster)
function updateFallingTiles(song_to_play, reset_tiles = true) {
    // reset all values 
    var notes_container = document.getElementById("falling-tiles-container")
    if (reset_tiles) {
        notes_container.innerHTML = ""
    }
    // yes so next step is to cache all the mp3s 
    var how_many_elem = Math.min(song_to_play.length, 40)
    var notes_elems = {}
    var previous_heights = 0

    for (var i = 0; i < how_many_elem; i++) {
        // console.log(JSON.parse(JSON.stringify(notes_elems)))

        var index = i
        var key = song_to_play[index][0]

        // console.log({ index }, { key })
        var height = song_to_play[i][1] * 0.4
        previous_heights += height // det e ju att det här händer för en, men inte andra 

        var added_this_iteration = false

        // console.log({ song_to_play }, { notes_played }, { i }, { height }, song_to_play[notes_played + i])

        if (!notes_elems[key]) {
            // console.log("adding: ", { key })
            var falling_tile = document.createElement("div")
            falling_tile.id = "play-" + i
            falling_tile.className = "falling-tile"
            falling_tile.style.display = "none"
            document.getElementById("falling-tiles-container").prepend(falling_tile)
            notes_elems[key] = falling_tile
            added_this_iteration = true
            falling_tile.style.bottom = previous_heights + "px"
        }

        // parseInt vs parseFloat 
        // you shouldn't add anything at all here! 
        // console.log(JSON.parse(JSON.stringify(notes_elems)), { added_this_iteration })
        for (var individual_key in notes_elems) {
            if (!added_this_iteration) {
                var current_height = parseFloat(notes_elems[individual_key].style.height) || 0
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
            var [key_without_octave, octave] = getKeyOctave(key)

            // position it directly above a piano keyboard key 
            var key_elements = document.getElementsByClassName(key_without_octave)

            // returns rectangel with rect.top, rect.right, rect.bottom, rect.left
            var left_margin = key_elements[octave - 2].getBoundingClientRect().left + 5;

            // console.log({ left_margin })

            if (song_to_play[index][0].includes("b")) {
                left_margin -= 14
            }

            // yes, it's this line that's messing up the heights 
            // we need the total height appended, taking into account 
            // that some elements may be on the same line
            // how? 
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
        var stats = document.createElement("div")
        stats.id = "accuracy"
        var notes_container = document.getElementById("falling-tiles-container")
        var white_tiles = document.getElementsByClassName("white")
        console.log({ stats })
        console.log(song_to_play.length / false_notes)
        console.log(song_to_play.length, { number_incorrect: false_notes })
        var accuracy = Math.round((notes_played / (notes_played + false_notes)) * 100)
        if (accuracy == Infinity) accuracy = 100
        console.log({ accuracy })
        stats.innerHTML = "Accuracy: " + accuracy + "%"
        notes_container.append(stats)

        setTimeout(() => {
            playNote("./piano-mp3/C5.mp3")
            playNote("./piano-mp3/E5.mp3")
            playNote("./piano-mp3/G5.mp3")
            console.log(white_tiles.length)
            for (var i = 0; i < white_tiles.length; i++) {
                white_tiles[i].style.backgroundColor = "#51eb5e" // document.body.getComputedStyle("--green") // "#58cf62"
            }
        }, 400)
        setTimeout(() => {
            playNote("./piano-mp3/C5.mp3")
            playNote("./piano-mp3/E5.mp3")
            playNote("./piano-mp3/G5.mp3")
        }, 500)
        setTimeout(() => {
            for (var i = 0; i < white_tiles.length; i++) {
                white_tiles[i].style.backgroundColor = "white"
            }
        }, 1000)

    }
    // console.log({ played_notes }, { should_play })
}

function setUpKeyboard() {
    // set up song selection 
    for (var elem in songs) {
        var opt = document.createElement("option");
        opt.value = elem;
        opt.innerHTML = elem
        document.getElementById("select-song").appendChild(opt);
    }

    var tiles = document.getElementsByClassName("tile");

    var container = document.getElementById("keyboard-container");
    const template = document.getElementById("template");

    for (var i = 1; i < 7; i++) {
        const clone = template.content.cloneNode(true);
        clone.className += " " + i
        container.appendChild(clone);
    }

    var octaves = document.getElementsByClassName("octave-container")
    var letter_mapping = [
        [">", "A", "Z", "S", "X", "C", "F", "V", "G", "B", "H", "N"],
        ["M", "K", ",", "L", ".", "Ö", "-", "↑", "*", "▲", "n4", "n1"],
        ["Q", "2", "W", "3", "E", "R", "5", "T", "6", "Y", "7", "U"],
        ["I", "9", "O", "0", "P", "Å", "`", "^", "←", "←", "Lk", "n7"],
        ["n8", "n/", "n9"]
    ]

    for (var i = 0; i < octaves.length; i++) {
        octaves[i].className += " " + i
        var children = octaves[i].children
        console.log(children.length)
        for (var j = 0; j < children.length; j++) {
            var letter = document.createElement("div")
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

    tiles[0].style.borderTopLeftRadius = "5px";
    tiles[tiles.length - 1].style.borderTopRightRadius = "5px";
    tiles[tiles.length - 1].style.borderRightWidth = "2px";

    function playTile(event) {
        var id = event.srcElement.classList[1] // depracated?? 
        var octave = parseInt(event.srcElement.parentNode.classList[1]) + 2
        var url = "./piano-mp3/" + id + octave + ".mp3"
        console.log({ url })
        challengeFunc(id, octave)
        playNote(url)
    }

    for (var i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', (event) => {
            playTile(event)
        });

        // Make it possible to roll on keys with the mouse 
        var should_press_key = false

        tiles[i].addEventListener("mousedown", (event) => {
            // console.log("mousedown", {event})
            should_press_key = true
            // you could have some complicated solution to this 
            // playTile(event)
        });

        tiles[i].addEventListener("mouseover", function (event) {
            // console.log("mouseover", {event})
            if (should_press_key) {
                playTile(event)
            }
        });

        // console.log("mouseup", {event})
        tiles[i].addEventListener("mouseup", function (event) {
            should_press_key = false
        });
    }

    setTimeout(async () => {
        // preLoad()
        // await sleep(3000)
        var left_hand = songs["mario_left"] //.slice(4, 100)
        var original_left = JSON.parse(JSON.stringify(left_hand)) // js references, man  
        setTempo(3, left_hand, original_left) 
        updateFallingTiles(left_hand)
        /* if (self_play) {
            selfPlay(left_hand)
        } */
        var right_hand = songs["mario"] //.slice(21, 100)
        var original_right = JSON.parse(JSON.stringify(right_hand)) // js references, man  
        setTempo(3, right_hand, original_right) 
        updateFallingTiles(right_hand, false)
        if (self_play) {
            selfPlay(left_hand, true)
            // selfPlay(right_hand, true)
        }
    }, 0) //??? 0 second wait works, but no timeout doesn't??? 
}

setUpKeyboard()

// YES!!! that's a great idea! be able to play two-handed... yes... may actually work 
// implement something guitar-hero like (would be so much fun!)

function computerKeyboardPress(event) {
    var start_keyboard = performance.now()
    /* var key_up = false 
    document.addEventListener('keyup', () => {
        console.log("key up")
        key_up = true 
    }); */
    var key = event.code.replace("Key", "").replace("Digit", "")
    console.log({ event })
    // playSound("./piano-mp3/C2.mp3")

    if (["Numpad4", "Numpad6"].includes(event.code)) {
        event.preventDefault();
    }

    // semicolon = ö, quote = ä, backslash = * 
    var keyboard_mapping = {
        0: { "IntlBackslash": "C", "A": "Db", "Z": "D", "S": "Eb", "X": "E", "C": "F", "F": "Gb", "V": "G", "G": "Ab", "B": "A", "H": "Bb", "N": "B" }
        , 1: { "M": "C", "K": "Db", "Comma": "D", "L": "Eb", "Period": "E", "Slash": "F", "Quote": "Gb", "ShiftRight": "G", "Backslash": "Ab", "ArrowUp": "A", "Numpad4": "Bb", "Numpad1": "B" }
        , 2: { "Q": "C", "2": "Db", "W": "D", "3": "Eb", "E": "E", "R": "F", "5": "Gb", "T": "G", "6": "Ab", "Y": "A", "7": "Bb", "U": "B" }
        , 3: { "I": "C", "9": "Db", "O": "D", "0": "Eb", "P": "E", "BracketLeft": "F", "Equal": "Gb", "BracketRight": "G", "Backspace": "Ab", "Enter": "A", "NumLock": "Bb", "Numpad7": "B" }
        , 4: { "Numpad8": "C", "NumpadDivide": "Db", "Numpad9": "D" }
    }

    function determinePlay(keys, octave) {
        // console.log({ keys }, { octave })
        if (Object.keys(keys).includes(key)) {
            var elem_with_key = document.getElementsByClassName(keys[key])
            var key_elem = elem_with_key[octave - 2]

            console.log({ elem_with_key }, { key_elem })
            if (key_elem.className.includes("white")) {
                key_elem.style.backgroundColor = "rgb(228, 228, 228)"
                // don't you also need the actual key 
                document.addEventListener("keyup", function (event) {
                    var time_to_wait = performance.now() - start_keyboard
                    var play_tiles = document.getElementsByClassName("falling-tile")
                    // console.log({ play_tiles }, play_tiles.length, play_tiles[play_tiles.length - 1], play_tiles[0])
                    // is this the cause of the other bug? 
                    var iter_find_non_pause = 0
                    var playing_now_height = parseInt(play_tiles[play_tiles.length - iter_find_non_pause - 1].style.height)
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
                });
            } else {
                key_elem.style.backgroundColor = "rgb(59, 58, 58)"
                document.addEventListener("keyup", function (event) {
                    key_elem.style.backgroundColor = "black"
                });
            }

            var url = "./piano-mp3/" + keys[key] + octave + ".mp3"
            console.log({ key_elem }, { url })

            challengeFunc(keys[key], octave)
            playNote(url)
        }
    }

    for (var i = 0; i < Object.keys(keyboard_mapping).length; i++) {
        determinePlay(keyboard_mapping[i], i + 2)
    }
}

document.addEventListener('keydown', computerKeyboardPress);

/* document.addEventListener('keyup', () => {
    console.log("key up")
    key_up = true 
}); */