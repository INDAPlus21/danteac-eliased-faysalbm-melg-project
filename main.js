import { songs } from "./songs.js"
// import noUiSlider from './nouislider.mjs';

/* var slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: [20, 80],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});
 */

var played_notes = []

// this is so goddamn confusing reading a letter and pressing a different letter, implement synethesia-like  
// should you have one octave even lower ? 
/* Quote: From what I can find out online, most modern MIDI equipment (keyboards, controllers) sends Note On messages with a velocity of 0 to end a note, rather than Note Off messages as per the spec. IIUC this is to make it easier to send a complete sequence of notes using running status. Makes sense.
// have accompaniment!!! (play left hand, while program is playing right) 
// the tiles are moving a little????  
// what wait?? using the mouse for playing notes doesn't delay the whole thing? or is it me typing that does it? the http server must update in soe way 
// aha! it requests all the files from the http server OVER AND OVER again (and that brings tons of slowdown). the solution would be to iterate over the should_play track and download all the mp3 files that you're going to be using (even dynamically!)
// the problem with the animation approach is that all the divs have the same id (!) 1
// ok... it starteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed to flicker a little      bit... prbably shouldn't drecrease it 
*/

// okay... looking at the js library THEY  
// actually use a similar approach to me already. 
// and I can actually do stuff like setting the audio.volume... 
// they stop the channel by... THERE IS AN audio.pause() (of course there is!)  
// wtf
// I definitely don't need an external library, BECAUSE THAT'S WHAT YOU'RE TRYING
// TO BUILD YOURSELF TO UNDERSTAND MIDI BETTER, in order to create A BETTER MIDI
// PARSER, IN ORDER TO BUILD A BETTER AI (this project is way too ambitious)

// aha! tee time doesn't work because you don't differentiate between notes (probably the cause of multiple fur elise not working either)
var song_to_play = songs["lower_lose_yourself"] //.slice(0, 100) 
console.log(song_to_play)
var original_song_to_play = JSON.parse(JSON.stringify(song_to_play)) // js references, man  
/* var play_state = {
    has_won: false, 
    number_correct: 0, 
    number_incorrect: 0
} */

var has_won = false
var notes_played = 0
var false_notes = 0
var self_play = false

for (var elem in songs) {
    var opt = document.createElement("option");
    // console.log(elem)
    opt.value = elem;
    opt.innerHTML = elem

    document.getElementById("select-song").appendChild(opt);
}

function setTempo(tempo) {
    console.log({ tempo })
    for (var i = 0; i < song_to_play.length; i++) {
        song_to_play[i][1] = original_song_to_play[i][1] / tempo
    }
    console.log("new tempo: ", original_song_to_play[i - 1][1] / tempo)
}

window.setTempo = setTempo

// setTempo(1) // ok. it's actually possible to set an absurdly high tempo, but it's limited by other factors... :P 

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


var playNote = function (url) {
    // console.log("trying to play: ", { url })
    const audio = new Audio(url);
    audio.play();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getKeyOctave(key) {
    var octave = key.match(/\d+/)[0]
    key = key.replace(/\d+/, "")
    return [key, octave]
}

function colorTile(key, octave, duration_ms) {
    var elem_with_key = document.getElementsByClassName(key)
    var key_elem = elem_with_key[octave - 2]
    if (key_elem.className.includes("white")) {
        key_elem.style.backgroundColor = "rgb(228, 228, 228)"
        setTimeout(function () {
            key_elem.style.backgroundColor = "white"
        }, duration_ms);
    } else {
        key_elem.style.backgroundColor = "rgb(59, 58, 58)"
        setTimeout(function () {
            key_elem.style.backgroundColor = "black"
        }, duration_ms);
    }
}

// do math instead 
async function selfPlay() {
    // iterate through all the notes in the song 
    for (var i = 0; i < song_to_play.length; i++) {
        // console.log("continuing")

        var time_to_wait = song_to_play[i][1]
        // console.log({ time_to_wait })
        var key_with_octave = song_to_play[i][0]

        // wait will this actually work... no it must change afterwards. but it should work!!! 
        // I'm not updating in updateNoteDisplay until I've slept for the time to wait!!! 
        var play_tiles = document.getElementsByClassName("play-display")
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
    }
}

function updateNoteDisplay() {
    var notes_container = document.getElementById("next-notes-container")
    notes_container.innerHTML = ""
    var how_many_elem = Math.min(song_to_play.length-notes_played, 40)
    for (var i = 0; i < how_many_elem; i++) {
        var play_elem = document.createElement("div")
        play_elem.id = "play-" + (how_many_elem - i)
        play_elem.className = "play-display"

        document.getElementById("next-notes-container").append(play_elem)

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
    }
    /* var i = 0
    var added_height = 0
    console.log({added_height}, window.innerHeight, notes_container.style.height)
    while (added_height < window.innerHeight) { // should really be note container height, but don't care 
        console.log("in while")
        var play_elem = document.createElement("div")
        play_elem.id = "play-" + (how_many_elem - i)
        play_elem.className = "play-display"
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
    if (song_to_play[notes_played][0] == "Pause") {
        played_notes.push("Pause")
        if (!self_play) {
            notes_played++ // ok. great. it's definitely not the pauses that are causing the flickering anymore 
        }
        // but this is in conflict with the other mode of playing 
    } else {
        played_notes.push(key + octave)
    }
    // if (key + octave != "Pause" && )
    if (song_to_play[notes_played][0] == key + octave || song_to_play[notes_played][0] == "Pause") {
        // console.log("one more correct")
        notes_played++
        updateNoteDisplay() // aha! I don't think this gets called 
    } else {
        false_notes++
    }
    if (notes_played == song_to_play.length && !has_won && !self_play /* arraysEqual(played_notes, should_play)*/) {
        has_won = true
        var stats = document.createElement("div")
        stats.id = "accuracy"
        var notes_container = document.getElementById("next-notes-container")
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
        updateNoteDisplay()
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
                    var play_tiles = document.getElementsByClassName("play-display")
                    // console.log({ play_tiles }, play_tiles.length, play_tiles[play_tiles.length - 1], play_tiles[0])
                    // is this the cause of the other bug? 
                    var iter_find_non_pause = 0
                    var playing_now_height = parseInt(play_tiles[play_tiles.length - iter_find_non_pause - 1].style.height)
                    while (song_to_play[notes_played-iter_find_non_pause][0] == "Pause" && iter_find_non_pause < 100) {
                        console.log(song_to_play[notes_played-iter_find_non_pause][0])
                        playing_now_height = parseInt(play_tiles[play_tiles.length - iter_find_non_pause - 1].style.height)
                        iter_find_non_pause++ 
                    }
                    // var playing_now_height = parseInt(play_tiles[play_tiles.length - 1].style.height)
                    console.log({play_tiles}, { playing_now_height }, { time_to_wait })

                    key_elem.style.backgroundColor = "white"
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