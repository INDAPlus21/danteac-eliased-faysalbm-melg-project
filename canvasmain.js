canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d', { alpha: false });

console.log(window.innerWidth)
canvas.width = window.innerWidth + 3000;

const white_width = Math.min(canvas.width / 20, 100)
const white_height = white_width * 5.5

canvas.height = white_height;
// because the canvas is black from the start 
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);


const black_width = white_width - white_width / 3
const black_height = white_height * 0.65

function drawInitialCanvas(/* times = 0, grey = false */) {
    var black_start_x = white_width - black_width / 2
    var white_start_x = 0
    var start_y = 0
    // var flat_keys_to_press = []
    // var whole_keys_to_press = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"]
    var key_order = ["F", "G", "A", "B", "C", "D", "E"]
    var flats_key_order = ["Gb", "Ab", "Bb", "Db", "Eb"]

    for (var i = 0; i < 20; i++) {
        // fillRect() parameters x, y-coordinates of upper-left corner, width, height 

        ctx.fillStyle = "black"
        // draw white tiles 
        ctx.strokeStyle = 'black';
        for (var j = 0; j < 7; j++) {
            ctx.rect(white_start_x + white_width * j, start_y, white_width, white_height);
            console.log({ white_start_x }, white_width * j)
            ctx.font = "30px Arial";
            var key = key_order[j]
            if (key && (i == 1 && j > 3) || (i == 2 && j < 4)) {
                ctx.fillText(key, white_width * j + white_width / 2.6 + white_start_x - 7 * white_width, start_y + white_height - 50);
            }
            /* if (grey && times == _i*7+j) {
                ctx.fillStyle = "#d4d4d4";
                ctx.fillRect(black_start_x + white_width * j, start_y, black_width, black_height);
            } */
        }
        ctx.stroke();

        ctx.fillStyle = "black"
        // var tile_width = 150
        for (var j = 0; j < 3; j++) {
            ctx.fillStyle = "black"
            ctx.fillRect(black_start_x + white_width * j, start_y, black_width, black_height);
            ctx.fillStyle = "white"
            if (i == 1) {
                ctx.fillText(flats_key_order[j], black_start_x + white_width * j + black_width / 5.5, start_y + black_height - 50);
            }
        }
        var distance = black_start_x + white_width * j + white_width
        for (var j = 0; j < 2; j++) {
            ctx.fillStyle = "black"
            ctx.fillRect(distance + white_width * j, start_y, black_width, black_height);
            ctx.fillStyle = "white"
            if (i == 0) {
                ctx.fillText(flats_key_order[j + 3], distance + white_width * j + black_width / 5, start_y + black_height - 50);
            }
        }

        black_start_x += 7 * white_width
        white_start_x += 7 * white_width
    }
}

drawInitialCanvas()

function playSound(url) {
    const audio = new Audio(url);
    audio.play();
}

function keyPress(event, type) {
    console.log("mouse clicked!!!")
    var x = event.clientX
    var y = event.clientY
    console.log(x, y)

    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4
    var r = data[index]
    // var g = data[index + 1] these aren't used either, bc binary
    // var b = data[index + 2]
    // var a = data[index + 3] // alpha, how opaque pixels are. isn't used
    // 255, 255, 255 is white. 0, 0, 0 is black 

    var white_start_x = 0
    var black_start_x = white_width - black_width / 2
    var key_order = ["F", "G", "A", "B", "C", "D", "E"]
    var flats_key_order = ["Gb", "Ab", "Bb", "Db", "Eb"]
    var octave = 1
    for (var i = 1; i < 4; i++) {
        // for whole notes 
        var octave = 1
        for (var j = 0; j < key_order.length; j++) {
            if (key_order[j] == "C") {
                octave++
            }
            if (x > white_start_x + white_width * j && x < white_start_x + white_width * (j + 1) && r == 255) {
                console.log({j}, key_order[j], white_start_x + white_width * j)
                console.log("./piano-mp3/" + key_order[j] + (octave + i) + ".mp3")
                playSound("./piano-mp3/" + key_order[j] + (octave + i) + ".mp3")
            }
        }

        // for flats 
        octave = 1
        key_index = 0
        for (var j = 0; j < flats_key_order.length + 1; j++) {
            if (flats_key_order[j] == "Db") {
                j++
                octave++
            }
            if (x > black_start_x + white_width * j && x < black_start_x + white_width * j + black_width && r == 0) {
                playSound("./piano-mp3/" + flats_key_order[key_index] + (octave + i) + ".mp3")
            }
            key_index++
        }

        black_start_x += 7 * white_width
        white_start_x += 7 * white_width
    }
}

canvas.addEventListener("click", keyPress, true)

// document.onkeypress = computerKeyboardPress(event)

// document.addEventListener('keypress', (event) => {console.log("hello"); computerKeyboardPress(event)});

document.addEventListener('keydown', computerKeyboardPress);

function computerKeyboardPress(event) {
    var all_keys = ["F", "G", "A", "B", "C", "D", "E"] // "Gb", "Ab", "Bb", "Db", "Eb"]
    // var corresponding_flats = ["C": "D", "q "]
    console.log("in keyboard press")
    var key = event.code.replace("Key", "")
    /* if (event.altKey && all_keys.includes(key)) {
        playSound("./piano-mp3/" + key + "b" + "2.mp3")
    } */
    if (event.shiftKey && all_keys.includes(key)) {
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
    }
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


/* canvas.onmousemove = function (event) {
    var white_start_x = 0
    var start_y = 0
    var black_start_x = white_width - black_width / 2
    console.log("hi")
    var x = event.clientX
    var y = event.clientY
    ctx.fillStyle = "#d4d4d4";
    times = Math.floor(x / white_width)

    // drawInitialCanvas(times, true)

    // or maybe redrawing the whole thing is easier??? 

    // draw the white color change 
    console.log({times})
    ctx.fillRect(white_start_x + white_width * times, start_y, white_width, white_height);
    ctx.strokeStyle = 'black';
    ctx.rect(white_start_x + white_width * times, start_y, white_width, white_height);
    ctx.stroke();

    // draw black on top, both sides 
    ctx.fillStyle = "black"
    if (times % 7 != 3 && times % 7 != 6) {
        ctx.fillRect(black_start_x + white_width * times, start_y, black_width, black_height);
    }
    console.log("modulo 6: ", times % 6)
    if (times % 7 != 0 && times % 7 != 4) {
        ctx.fillRect(black_start_x + white_width * (times-1), start_y, black_width, black_height);
    }
    // ctx.fillRect(black_start_x + white_width * times, start_y, black_width, black_height);
} */