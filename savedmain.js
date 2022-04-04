import { songs } from "./songs.js"

var played_notes = []

var song_to_play = songs["mario"] //.slice(0, 10)

// console.log(song_to_play)
var original_song_to_play = JSON.parse(JSON.stringify(song_to_play)) // js references, man  

var has_won = false
var notes_played = 0
var false_notes = 0
var self_play = true
/* var play_state = {
    has_won: false, 
    number_correct: 0, 
    number_incorrect: 0
} */

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

function setTempo(tempo) {
    console.log({ tempo })
    for (var i = 0; i < song_to_play.length; i++) {
        song_to_play[i][1] = original_song_to_play[i][1] / tempo
    }
    console.log("new tempo: ", original_song_to_play[i - 1][1] / tempo)
}

window.setTempo = setTempo

setTempo(2) // it's possible to set an absurdly high tempo, but it's limited by the css rendering 

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

function playNote(note) {
    const url = (note.includes("piano-mp3")) ? note : "./piano-mp3/" + note + ".mp3"
    console.log(url)
    const audio = (notes_audios[note]) ? notes_audios[note] : new Audio(url) // controversial ternary operators 
    audio.play();
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

async function selfPlay() {
    // but this works!!!
    /* var play_tiles = document.getElementsByClassName("falling-tile")
    var playing_now_height = parseInt(play_tiles[play_tiles.length - 2].style.height)
    console.log("animate: ", {play_tiles}, {playing_now_height})
    for (var j = 0; j < play_tiles.length; j++) {
        console.log("in animate loop")
        play_tiles[j].animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(' + playing_now_height + 'px)' }
        ], {
            duration: 486,
            iterations: 1 // is this the default? 
        });
    }  */

    // iterate through all the notes in the song 
    for (var i = 0; i < song_to_play.length; i++) { // song_to_play.length
        const note = song_to_play[i][0]
        const delta_time = song_to_play[i][1] // wait yeah actually that's expected behaviour 

        // let's even do it w/o animations first 
        // but this shouldn't conflict with the pause if they're the same class! 
        // it's definitely 100% the pauses that does this 
        // because the delta time isn't fucking right 
        // can't you redo the delta time from the height? 
        /* var play_tiles = document.getElementsByClassName("falling-tile")
        var playing_now_height = parseInt(play_tiles[play_tiles.length - 1].style.height)
        console.log("animate: ", { play_tiles }, { playing_now_height }, { delta_time })
        for (var j = 0; j < play_tiles.length; j++) {
            console.log("in animate loop")
            play_tiles[j].animate([
                { transform: 'translateY(0px)' },
                { transform: 'translateY(' + playing_now_height + 'px)' }
            ], {
                duration: delta_time + 3, // a duration isn't optional, because it determines the speed of dropdown 
                iterations: 1 // is this the default? 
            });
        } */


        await sleep(delta_time)

        // const next_delta_time = (song_to_play[i + 1]) ? song_to_play[i + 1][1] : 0 // should it be 0? 

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
            unColorTile(key, octave)
        } else {
            playNote(note)
            colorTile(key, octave) // won't work, but let's not care about that now. this also needs to be synchronized with array... 
        }

        // it feels like you shouldn't be able to do this (wasn't this a cause of a previous bug?)
        // console.log("sleeping for: ", next_delta_time)

        if (song_to_play) challengeFunc(key, octave)
    }

    /* var play_tiles = document.getElementsByClassName("falling-tile")
    var playing_now_height = parseInt(play_tiles[play_tiles.length - 1].style.height)
    console.log("animate: ", {play_tiles}, {playing_now_height})
    for (var j = 0; j < play_tiles.length; j++) {
        console.log("in animate loop")
        play_tiles[j].animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(' + playing_now_height + 'px)' }
        ], {
            duration: 486,
            iterations: 1 // is this the default? 
        });
    }   */

    // animate tiles 
    // no... playing now height isn't the real issue... 
    /* var play_tiles = document.getElementsByClassName("falling-tile")
    var playing_now_height = parseInt(play_tiles[play_tiles.length - 2].style.height)
    console.log("animate: ", {play_tiles}, {playing_now_height}, {next_delta_time})
    for (var j = 0; j < play_tiles.length; j++) {
        console.log("in animate loop")
        play_tiles[j].animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(' + playing_now_height + 'px)' }
        ], {
            duration: next_delta_time + 5,
            iterations: 1 // is this the default? 
        });
    } */

    /* for (var i = 0; i < song_to_play.length; i++) {
        // console.log("continuing")

        var time_to_wait = song_to_play[i][1]
        // console.log({ time_to_wait })
        var key_with_octave = song_to_play[i][0]

        // wait will this actually work... no it must change afterwards. but it should work!!! 
        // I'm not updating in updateNoteDisplay until I've slept for the time to wait!!! 
        var play_tiles = document.getElementsByClassName("falling-tile")
        // console.log({ play_tiles }, play_tiles.length, play_tiles[play_tiles.length - 1], play_tiles[0])
        var playing_now_height = parseInt(play_tiles[play_tiles.length - 1].style.height)
        // console.log({ playing_now_height }, { time_to_wait })
        for (var j = 0; j < play_tiles.length; j++) {
            play_tiles[j].animate([
                // keyframes
                { transform: 'translateY(0px)' },
                { transform: 'translateY(' + playing_now_height + 'px)' }
            ], {
                // timing options
                duration: time_to_wait + 5,
                iterations: 1
            });
        }

        if (key_with_octave != "Pause") {
            // var start_time = performance.now()
            playNote("./piano-mp3/" + key_with_octave + ".mp3")
            // console.log("took: ", performance.now() - start_time, "ms")
            var [key, octave] = getKeyOctave(key_with_octave)
            colorTile(key, octave, time_to_wait)
            console.log({ key }, { octave })
            await sleep(time_to_wait) // this is such a fascinating bug!!! that I put it before, and async function! that was ONE cause of it sounding iffy as ** 
            if (song_to_play) challengeFunc(key, octave)
        } else {
            // console.log("actually pausing")
            await sleep(time_to_wait)
            if (song_to_play) challengeFunc("Pau", "se") // lolz 
        }
    } */
}

// ok. this function actually needs to UNDERSTANDING 
function updateFallingTiles() {
    var notes_container = document.getElementById("falling-tiles-container")
    notes_container.innerHTML = ""
    // aha! if it's odd-numbered (or more accurately if it hasn't gone into the else statement 
    // yet the height won't have been updated... but isn't an issue because you have so many elements 
    // but good to know so you don't think it's a bug now during testing)
    // no, but it is a bug. that's the cause of what's happening with the whole screen shifting 
    // well... no, they still have their elements... 
    // IT'S THIS THAT IS BLOCKING (that makes it so it can't go faster)
    var how_many_elem = Math.min(song_to_play.length - notes_played, 40)
    // should you have a key // note naming convention? doesn't really make sense 
    // function stopDisplay() 
    // function insertDisplay() 
    // THE ISSUE IS THAT NOTES PLAYED DOESN'T GET INCREMENTED BY 2!!! 
    // or isn't the bigger issue that when you press a key... it isn't really ONE note that is played... 
    // ... how should you handle that 
    // (it's these things that software teaches you best, I mean...)
    // okay so the issue is that the elements on the same row are both (1) adjusted upwards and (2) have no height 
    // okay we have an explanation for the upwards adjustment, but why doesn't it have height 

    var notes_elems = {}
    console.log("in updatenotedisplay")
    var previous_heights = 0
    // the code is so much nicer when you get to redo it!!! editing is orgasmic 
    for (var i = 0; i < how_many_elem; i++) {
        console.log(JSON.parse(JSON.stringify(notes_elems)))
        // ok. above is just normal dom manipulation  

        var index = notes_played + i // why???  
        var key = song_to_play[index][0]

        console.log({ index }, { key })

        // ok so another else if 
        // no! it's when NOTHING IS IN THE NOTES_ELEMS THAT THERE IS A PAUSE! 
        // yes... and don't go into the classic else statement! 

        // console.log("should've inserted, but didn't: ")
        // js is a horrific language 
        // I FUCKING DID IT 
        var height = song_to_play[notes_played + i][1] * 0.2 // ohno. ohno. wrong. wrong. wrong!!!! right!!!

        // doesn't fully work 
        if (isEmpty(notes_elems) && notes_played != 0) {
            // console.log("inserting a pause")
            var falling_tile = document.createElement("div")
            // falling_tile.id = "A PAUSE SHOULD BE HERE"
            falling_tile.className = "falling-tile pause"
            // console.log("appending div") // well no it's actually only appending 2 divs total 
            document.getElementById("falling-tiles-container").prepend(falling_tile)
            falling_tile.style.height = height
            // you don't properly remove these
            // yes you do, everytime you reset the inner HTML and rerender everything 
        }

        // aha! so it's laggiing behind. ahuh, apparently not 
        console.log({ song_to_play }, { notes_played }, { i }, { height }, song_to_play[notes_played + i])
        // so you're rotating through all the non-deleted keys, but it's previous heights that really storing the height difference 
        // and now everything has the same height 
        // DUUUUDE 
        for (var individual_key in notes_elems) {
            // NaN px big surprise 
            // parseInt(notes_elems[individual_key].style.height) 
            // fucking js nan values i hate you 
            var current_height = parseInt(notes_elems[individual_key].style.height) || 0
            console.log({ current_height }, "adding: ", height)
            notes_elems[individual_key].style.height = current_height + height + "px"
            // previous_heights += parseInt(height) || 0 
            // console.log({previous_heights})
        }

        if (!notes_elems[key]) {
            var falling_tile = document.createElement("div")
            falling_tile.id = "play-" + i
            falling_tile.className = "falling-tile"

            // console.log("appending div") // well no it's actually only appending 2 divs total 
            document.getElementById("falling-tiles-container").prepend(falling_tile)
            console.log({ falling_tile })
            notes_elems[key] = falling_tile
        } else {
            // notes_elems[key].remove() // no... you shouldn't remove it. you should set its height here 

            // Set tile height (was a function before, but too many common parameters, and only called here) 
            // var play_number = falling_tile.id.match(/\d+/)[0] - 1 

            var [key_without_octave, octave] = getKeyOctave(key)
            // console.log("apparent key", { key }, { octave }) // why were there an if (key) here? 

            // position it directly above a piano keyboard key 
            var key_elements = document.getElementsByClassName(key_without_octave)

            // returns rectangel with rect.top, rect.right, rect.bottom, rect.left
            var left_margin = key_elements[octave - 2].getBoundingClientRect().left + 5;

            console.log({ left_margin })

            if (song_to_play[index][0].includes("b")) {
                left_margin -= 14
            }

            // var height = song_to_play[notes_played + i][1] * 0.2 // ohno. ohno. wrong. wrong. wrong!!!! right!!!

            // notes_elems[key].style.height = height + "px"
            notes_elems[key].style.left = left_margin + "px" // marginLeft = left_margin + "px"; // WHAT THE HELL YOU*RE NOT SETTING THE FALLING_TILE VALUE??? aha and it used the previous iterations values 
            notes_elems[key].style.bottom = previous_heights + "px"

            previous_heights += parseInt(height)

            // js is so cursed 
            // 

            // but we have nothing to symbolize real pauses, and real pauses happen 
            // when a falling tile... when a pause happens (no note is playing), which 
            // happens in midi when there's deltatime between a note and a note which 
            // isn't the same (so now there will be parallell pausing tiles, how exciting!)
            // sets the HEIGHT, not the relative position! that is done by the appending 

            // bc you've already done the checking that this is the right element... no 
            // it's still wrong because you need to add up all the delays from the previous
            // so you need to sum up all the previous elements 
            // or, alternatively, continually update it 
            /* var height = song_to_play[notes_played + i][1] * 0.2 // ohno. ohno. wrong. wrong. wrong!!!! right!!!
            notes_elems[key].style.height = height + "px"
            previous_heights += height
            console.log({previous_heights}) */

            console.log("deleted!")
            delete notes_elems[key]
        }
    }

    notes_played += 2
    /* var notes_container = document.getElementById("falling-tiles-container")
    notes_container.innerHTML = ""
    var how_many_elem = Math.min(song_to_play.length-notes_played, 40)
    for (var i = 0; i < how_many_elem; i++) {
        var play_elem = document.createElement("div")
        play_elem.id = "play-" + (how_many_elem - i)
        play_elem.className = "falling-tile"

        document.getElementById("falling-tiles-container").append(play_elem)

        var should_play_index = notes_played + how_many_elem - 1 - i // why??? 
        var key = song_to_play[should_play_index][0]

        // Set tile height (was a function before, but too many common parameters, and only called here) 
        var play_number = play_elem.id.match(/\d+/)[0] - 1
        if (key == "Pause") {
            // console.log({ should_play })
            play_elem.style.backgroundColor = "transparent"
            play_elem.style.height = song_to_play[notes_played + play_number][1] * 0.2 + "px"
        } else {
            var [key, octave] = getKeyOctave(key)
            if (key) {
                var c_s = document.getElementsByClassName(key)

                // returns rectangel with rect.top, rect.right, rect.bottom, rect.left
                var left_margin = c_s[octave - 2].getBoundingClientRect().left + 5;

                if (song_to_play[should_play_index][0].includes("b")) {
                    left_margin -= 14 // isn't it an inevitability that there will be margin conflicts? if not every tile has the same margin? 
                    // i think this is the cause of the flicker i see happening
                    // well, let's think about that later 
                    // play_elem.style.right = "-50px";
                    // AND it's not this that causes the flickering! I'm starting to think it's something iffy with the wait time animation 
                }

                play_elem.style.marginLeft = left_margin + "px";

                // sets the HEIGHT, not the relative position! that is done by the other functions 
                var height = song_to_play[notes_played + play_number][1] * 0.2 + "px"
                play_elem.style.height = height
                // return height
            }
        }
    } */
    /* var i = 0
    var added_height = 0
    console.log({added_height}, window.innerHeight, notes_container.style.height)
    while (added_height < window.innerHeight) { // should really be note container height, but don't care 
        console.log("in while")
        var play_elem = document.createElement("div")
        play_elem.id = "play-" + (how_many_elem - i)
        play_elem.className = "falling-tile"
        console.log(play_elem)
        notes_container.append(play_elem)
        // await sleep(1000)
        var height = playNext(should_play[number_correct + how_many_elem - 1 - i][0], play_elem.id)
        console.log({height})
        added_height += parseInt(height)  
        i++
    } */
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

    setTimeout(() => {
        updateFallingTiles()
        if (self_play) {
            selfPlay()
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
        console.log({ keys }, { octave })
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
                        console.log(song_to_play[notes_played - iter_find_non_pause][0])
                        playing_now_height = parseInt(play_tiles[play_tiles.length - iter_find_non_pause - 1].style.height)
                        iter_find_non_pause++
                    }
                    // var playing_now_height = parseInt(play_tiles[play_tiles.length - 1].style.height)
                    console.log({ play_tiles }, { playing_now_height }, { time_to_wait })

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