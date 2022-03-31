var played_notes = []
var songs = {
    test: ["C", "D", "E"],
    fur_elise: ["E", "Eb", "E", "Eb", "E", "B", "D", "C", "A", "C", "E", "A", "B", "E", "Ab", "B", "C", "E", "E", "Eb", "E", "Eb", "E", "B", "D", "C", "A", "C", "E", "A", "B", "E", "C", "B", "A", "B", "C", "D", "E", "G", "F", "E", "D", "F", "E", "D", "C", "E", "D", "C", "B", "E", "Eb", "E", "Eb", "E", "B", "D", "C", "A", "C", "E", "A", "B", "E", "Ab", "B", "C", "E", "E", "Eb", "E", "Eb", "E", "B", "D", "C", "A", "C", "E", "A", "B", "E", "C", "B", "A"],
    mario: ["E", "E", "E", "C", "E", "G", "G", "C", "G", "E", "A", "B", "Bb", "A", "G", "E", "G", "A", "F", "G", "E", "C", "D", "C", "G", "E", "A", "B", "Bb", "A", "G", "E", "G", "A", "F", "G", "E", "C", "D", "G", "Gb", "F", "D", "E", "G", "A", "C", "A", "C", "D", "G", "Gb", "F", "D", "E", "C", "C", "G", "Gb", "F", "D", "E", "G", "A", "C", "A", "C", "D", "Eb", "D", "C", "C", "C", "C", "D", "E", "C", "A", "G", "C", "C", "C", "C", "D", "C", "C", "C", "C", "D", "E", "C", "A", "G", "E", "E", "E", "C", "E", "G", "C", "G", "E", "A", "B", "Bb", "A", "G", "E", "G", "A", "F", "G", "E", "C", "D", "C", "G", "E", "A", "B", "Bb", "A", "G", "E", "G", "A", "F", "G", "E", "C", "D", "E", "C", "G", "G", "A", "F", "F", "A", "B", "A", "A", "A", "G", "F", "E", "C", "A", "E", "C", "G", "G", "A", "F", "F", "A", "B", "F", "F", "F", "E", "D", "C", "G", "E", "C", "G", "E", "A", "B", "A", "G#", "Bb", "G#", "G", "Gb", "G"]
}
// this is so goddamn confusing reading a letter and pressing a different letter! 
// why does it stop changing the color??? 
var should_play = songs["fur_elise"] // ["E", "Eb", "E", "Eb", "E"] // Fur Elise // ["C", "D", "E"]
var challenge_element = document.getElementById("challenge")
var has_won = false
challenge_element.innerHTML = "Play " // + should_play.join(" ")
var number_correct = 0
var number_incorrect = 0
for (var i = 0; i < should_play.length; i++) {
    note_to_play = document.createElement("div");
    note_to_play.innerHTML = should_play[i]
    note_to_play.className = "note-to-play"
    challenge_element.append(note_to_play)
}

/* if (should_play[0] == "E") {
    document.getElementById("play-now").style.marginLeft = "465px"
} */

// sheet music would be an enourmous project in an of itself, let's just do synethesia 
/* for (var i = 0; i < should_play.length; i++) {
    var quarter = document.createElement("img")
    quarter.id = "sheet1"
    quarter.className = "sheet-note"
    quarter.src = "quarter_note.png"
    var order = ["C", "D", "E", "F", "G", "A", "B"]
    if (should_play[i] == "C") {
        quarter.src = "c.png"
    }
    console.log({ quarter })
    quarter.style.left = i * 40 + "px"
    console.log(order.indexOf(should_play[i]))
    quarter.style.top = ((order.length - order.indexOf(should_play[i])) * 10 + 55) + "px"

    document.getElementById("sheet-music").append(quarter)
} */

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

function challengeFunc(key) {
    played_notes.push(key)
    if (should_play[number_correct] == key) {
        console.log("one more correct")
        var note_elem = document.getElementsByClassName("note-to-play")[number_correct]
        note_elem.style.backgroundColor = "#58cf62"
        number_correct++
        var order = ["C", "D", "E", "F", "G", "A", "B"]
        var flat_order = ["Db", "Eb", "Gb", "Ab", "Bb"]

        /* if (should_play[number_correct] == "C") {
            quarter.src = "c.png"
        } */
        /* console.log({ quarter })
        quarter.style.left = i * 40 + "px"
        console.log(order.indexOf(should_play[i])) */
        /* var index = order.indexOf(should_play[number_correct])
        
        if (index == -1) {
            index = flat_order.indexOf(should_play[number_correct])
            // WHOAH. JUST GET THE POSITION OF THE KEY ELEMENT ON THE SCREEN!!! 
            document.getElementById("play-now").style.marginLeft = 30 + (7 + index) * 50 + "px"
        } else {
            document.getElementById("play-now").style.marginLeft = 5 + (7 + index) * 50 + "px"
        }
        console.log({ index }) */
        /* if (should_play[number_correct] == "C") {
            document.getElementById("play-now").style.marginLeft = 5 + 7 * 50 + "px"
        } else if (should_play[number_correct] == "E") {
            document.getElementById("play-now").style.marginLeft = 5 + 9 * 50 + "px"
        } */

    } else {
        number_incorrect++
    }
    if (number_correct == should_play.length && !has_won /* arraysEqual(played_notes, should_play)*/) {
        has_won = true
        console.log("challenge completed")
        var stats = document.createElement("div")
        stats.id = "accuracy"
        var notes = document.getElementsByClassName("note-to-play")
        var white_tiles = document.getElementsByClassName("white")
        console.log({ stats })
        console.log(should_play.length / number_incorrect)
        console.log(should_play.length, { number_incorrect })
        var accuracy = Math.round((number_correct / (number_correct + number_incorrect)) * 100)
        if (accuracy == Infinity) accuracy = 100
        console.log({ accuracy })
        stats.innerHTML = "Accuracy: " + accuracy + "%"
        console.log(notes[notes.length - 1])
        notes[notes.length - 1].after(stats)

        setTimeout(() => {
            playSound("./piano-mp3/C5.mp3")
            playSound("./piano-mp3/E5.mp3")
            playSound("./piano-mp3/G5.mp3")
            console.log(white_tiles.length)
            for (var i = 0; i < white_tiles.length; i++) {
                white_tiles[i].style.backgroundColor = "#58cf62"
            }
        }, 400)
        setTimeout(() => {
            playSound("./piano-mp3/C5.mp3")
            playSound("./piano-mp3/E5.mp3")
            playSound("./piano-mp3/G5.mp3")
        }, 500)
        setTimeout(() => {
            for (var i = 0; i < white_tiles.length; i++) {
                white_tiles[i].style.backgroundColor = "white"
            }
        }, 1000)

    }
    console.log({ played_notes }, { should_play })
}

function setUpKeyboard() {
    var tiles = document.getElementsByClassName("tile");

    const container = document.getElementById("container");
    const template = document.getElementById("template");

    for (var i = 1; i < 7; i++) {
        const clone = template.content.cloneNode(true);
        console.log(clone)
        clone.className += " " + i
        console.log(clone.className)
        var is_something = container.appendChild(clone);
        console.log({ is_something })
    }

    var octaves = document.getElementsByClassName("octave-container")
    for (var i = 0; i < octaves.length; i++) {
        console.log(octaves[i])
        octaves[i].className += " " + i
    }

    tiles[0].style.borderTopLeftRadius = "5px";
    tiles[tiles.length - 1].style.borderTopRightRadius = "5px";

    function playTile(event) {
        var id = event.srcElement.classList[1] // depracated?? 
        var octave = event.srcElement.parentNode.classList[1]
        var url = "./piano-mp3/" + id + (parseInt(octave) + 2) + ".mp3"
        console.log({ url })
        challengeFunc(id)
        playSound(url)
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
            playTile(event)
        });

        var should_press_key = false
        tiles[i].addEventListener("mouseover", function (event) {
            // console.log("mouseover", {event})
            if (should_press_key) {
                playTile(event)
            }
        });

        tiles[i].addEventListener("mouseup", function (event) {
            // console.log("mouseup", {event})
            should_press_key = false
        });
    }
}

setUpKeyboard()

// YES!!! that's a great idea! be able to play two-handed... yes... may actually work 
// implement something guitar-hero like (would be so much fun!)

var playSound = function (url) {
    const audio = new Audio(url);
    audio.play();
}

function computerKeyboardPress(event) {
    var key = event.code.replace("Key", "")
    // console.log({event})

    if (["Numpad4", "Numpad6"].includes(event.code)) {
        event.preventDefault();
    }

    // semicolon = ö, quote = ä, backslash = * 
    var key_octave_1 = { "A": "C", "S": "D", "D": "E", "F": "F", "G": "G", "H": "A", "J": "B" }
    var flats_octave_1 = { "W": "Db", "E": "Eb", "T": "Gb", "Y": "Ab", "U": "Bb" }
    var key_octave_2 = { "K": "C", "L": "D", "Semicolon": "E", "Quote": "F", "Backslash": "G", "Enter": "Ab", "Numpad4": "A", "Numpad5": "B" }
    var key_octave_3 = { "Numpad6": "C", "NumpadAdd": "Db" }
    var flats_octave_2 = { "O": "Db", "P": "Eb", "BracketRight": "Gb", "Numpad8": "Bb" }
    function determinePlay(keys, octave) {
        if (Object.keys(keys).includes(key)) {
            var elem_with_key = document.getElementsByClassName(keys[key])
            var key_elem = elem_with_key[octave - 2]

            // console.log({ elem_with_key }, { key_elem })
            if (key_elem.className.includes("white")) {
                key_elem.style.backgroundColor = "rgb(228, 228, 228)"
                setTimeout(function () {
                    key_elem.style.backgroundColor = "white"
                }, 200);
            } else {
                key_elem.style.backgroundColor = "rgb(59, 58, 58)"
                setTimeout(function () {
                    key_elem.style.backgroundColor = "black"
                }, 200);
            }
            var url = "./piano-mp3/" + keys[key] + octave + ".mp3"
            // console.log({ key_elem }, { url })
            challengeFunc(keys[key])
            playSound(url)
        }
    }

    determinePlay(key_octave_1, 2)
    determinePlay(key_octave_2, 3)
    determinePlay(flats_octave_1, 2)
    determinePlay(flats_octave_2, 3)
    determinePlay(key_octave_3, 4)
}

document.addEventListener('keydown', computerKeyboardPress);