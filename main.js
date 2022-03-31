console.log("hello world")

var tiles = document.getElementsByClassName("tile");

var myFunction = function () {
    console.log("hi")
};


var playSound = function (url) {
    const audio = new Audio(url);
    audio.play();
}

const container = document.getElementById("container");
const template = document.getElementById("template");

for (var i = 1; i < 4; i++) {
    const clone = template.content.cloneNode(true);
    console.log(clone)
    // clone.classList.add(""+i) 
    clone.className += " "+i
    console.log(clone.className) 
    var is_something = container.appendChild(clone);
    console.log({is_something})
}

var octaves = document.getElementsByClassName("octave-container")
for (var i = 0; i < octaves.length; i++) {
    console.log(octaves[i]) 
    octaves[i].className += " "+i
}


for (var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', (elem, even) => {
        console.log(elem, elem.srcElement.id)
        octave = elem.srcElement.parentNode.className.split(' ')[1]
        // console.log(class_names)
        url = "./piano-mp3/" + elem.srcElement.id + (parseInt(octave) + 1) + ".mp3"
        console.log({ url })
        playSound(url)
    });
}

function computerKeyboardPress(event) {
    /* var all_keys = ["F", "G", "A", "B", "C", "D", "E"] // "Gb", "Ab", "Bb", "Db", "Eb"]
    // var corresponding_flats = ["C": "D", "q "]
    console.log("in keyboard press")
    var key = event.code.replace("Key", "")
    /* if (event.altKey && all_keys.includes(key)) {
        playSound("./piano-mp3/" + key + "b" + "2.mp3")
    } */
    var key = event.code.replace("Key", "")
    console.log(event)
    var key_octave_1 = { "A": "C", "S": "D", "D": "E", "F": "F", "G": "G", "H": "A", "J": "B" }
    var flats_octave_1 = { "W": "Db", "E": "Eb", "T": "Gb", "Y": "Ab", "U": "Bb" }
    var key_octave_2 = { "K": "C", "L": "D", "Semicolon": "E", "Quote": "F", "Backslash": "G" }
    var flats_octave_2 = { "O": "Db", "P": "Eb", "BracketRight": "Gb" }
    function determinePlay(keys, octave) {
        if (Object.keys(keys).includes(key)) {
            // var tile = document.getElementsByClassName("white").getElementById(key_octave_1[key])
            // console.log({tile})
            var url = "./piano-mp3/" + keys[key] + octave + ".mp3"
            console.log({ url })
            playSound(url)
        }
    }

    determinePlay(key_octave_1, 2) 
    determinePlay(key_octave_2, 3)
    determinePlay(flats_octave_1, 2)
    determinePlay(flats_octave_2, 3)


    /* if (Object.keys(key_octave_1).includes(key)) {
        // var tile = document.getElementsByClassName("white").getElementById(key_octave_1[key])
        // console.log({tile})
        var url = "./piano-mp3/" + key_octave_1[key] + 2 + ".mp3"
        console.log({ url })
        playSound(url)
    } */
    /* if (Object.keys(key_octave_2).includes(key)) {
        var url = "./piano-mp3/" + key_octave_2[key] + 3 + ".mp3"
        console.log({ url })
        playSound(url)
    }
    if (Object.keys(flats_octave_1).includes(key)) {
        var url = "./piano-mp3/" + flats_octave_1[key] + 2 + ".mp3"
        console.log({ url })
        playSound(url)
    }
    if (Object.keys(flats_octave_2).includes(key)) {
        var url = "./piano-mp3/" + flats_octave_2[key] + 3 + ".mp3"
        console.log({ url })
        playSound(url)
    } */
    // document.getElementById
    /* if (event.shiftKey && all_keys.includes(key)) {
        octave = 3
        if (event.altKey) {
            octave += 1
        }
        playSound("./piano-mp3/" + key + "b" + octave + ".mp3")
    } else if (all_keys.includes(key)) {
        octave = 3
        if (event.altKey) {
            octave += 1
        }
        playSound("./piano-mp3/" + key + octave + ".mp3")
    } */
    /* var key_order = ["F", "G", "A", "B", "C", "D", "E"]
    var whole_keys_to_press = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"]

    console.log("in keyboard press")
    var key = event.code.replace("Key", "")
    console.log({ key })
    if (whole_keys_to_press.includes(key)) {
        var index = whole_keys_to_press.indexOf(key)
        console.log({ index })
        times = Math.floor(index / white_width)
        octave = Math.floor(index / white_width) + 2
        console.log(Math.floor(index / 7))
        if (Math.floor(index / white_width) % 7 == 4 || Math.floor(index / white_width) % 7 == 5 || Math.floor(index / white_width) % 7 == 6) {
            octave += 1
        }
        playSound("./piano-mp3/" + key_order[index % 7] + octave + ".mp3")
    } */
    // console.log(event.code) // e.code)
    //   log.textContent += ` ${e.code}`;
}

document.addEventListener('keydown', computerKeyboardPress);

/* const secondClone = template.content.firstElementChild.cloneNode(true);
secondClone.addEventListener("click", clickHandler);
container.appendChild(secondClone); */
