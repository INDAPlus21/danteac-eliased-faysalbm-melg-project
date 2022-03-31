function setUpKeyboard() {
    var tiles = document.getElementsByClassName("tile");

    const container = document.getElementById("container");
    const template = document.getElementById("template");

    for (var i = 1; i < 4; i++) {
        const clone = template.content.cloneNode(true);
        console.log(clone)
        // clone.classList.add(""+i) 
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

    for (var i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', (elem, even) => {
            // console.log(elem, elem.srcElement.id, elem.srcElement.className, elem.srcElement.classList[1], elem.srcElement.className.split(" ")[1])
            var id = elem.srcElement.classList[1]
            var octave = elem.srcElement.parentNode.classList[1] // .split(' ')[1]
            var url = "./piano-mp3/" + id + (parseInt(octave) + 2) + ".mp3"
            console.log({ url })
            playSound(url)
        });
    }
}

setUpKeyboard()

// YES!!! that's a great idea! be able to play two-handed... yes... may actually work 

var playSound = function (url) {
    const audio = new Audio(url);
    audio.play();
}

function computerKeyboardPress(event) {
    var key = event.code.replace("Key", "")
    console.log(event)
    // semicolon = ö, quote = ä, backslash = * 
    /* var comp_keyboard_order = ["A", "S", "D", "F", "G", "H", "I", "J", "K", "L", "Semicolon", "Quote", "Backslash"]
    var piano_keyboard_order = ["C", "D", "E", "F", "G", "A", "B"]
    var key_octave_1 = {}
    // is there a built-in js function for this? 
    for (var i = 0; i < comp_keyboard_order.length; i++) { 
        key_octave_1[comp_keyboard_order[i]] = piano_keyboard_order[i]
    }
    console.log({key_octave_1}) */
    var key_octave_1 = { "A": "C", "S": "D", "D": "E", "F": "F", "G": "G", "H": "A", "J": "B" }
    var flats_octave_1 = { "W": "Db", "E": "Eb", "T": "Gb", "Y": "Ab", "U": "Bb" }
    var key_octave_2 = { "K": "C", "L": "D", "Semicolon": "E", "Quote": "F", "Backslash": "G", "Enter": "Ab" }
    var flats_octave_2 = { "O": "Db", "P": "Eb", "BracketRight": "Gb" }
    function determinePlay(keys, octave) {
        if (Object.keys(keys).includes(key)) {
            // var tile = document.getElementsByClassName("white").getElementById(key_octave_1[key])
            // console.log({tile})
            // console.log({key})
            var elem_with_key = document.getElementsByClassName(keys[key])
            var key_elem = elem_with_key[octave-2] // document.getElementById(keys[key])

            /* if octave = elem.srcElement.parentNode.classList[1] {
                var octave = elem.srcElement.parentNode.classList[1] 
            } */
            console.log({elem_with_key}, {key_elem})
            // console.log(key_elem.classList, key_elem.className)
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

            console.log({ key_elem })
            var url = "./piano-mp3/" + keys[key] + octave + ".mp3"
            console.log({ url })
            playSound(url)
        }
    }

    determinePlay(key_octave_1, 2)
    determinePlay(key_octave_2, 3)
    determinePlay(flats_octave_1, 2)
    determinePlay(flats_octave_2, 3)
}

document.addEventListener('keydown', computerKeyboardPress);
