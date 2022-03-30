canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d', { alpha: false });

console.log(window.innerWidth)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// because the canvas is black from the start 
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// ((window.innerHeight - 150) - canvas.height % cell_size) / cell_size)
// var xvalue = 0;
/* var yvalue = 0;
var num_y_cells = Math.floor(canvas.height / cell_size)
var num_x_cells = Math.floor(canvas.width / cell_size) */

var white_width = canvas.width / 20
var white_height = white_width * 5.5

var black_width = white_width - white_width / 3
var black_height = white_height * 0.65

function drawInitialCanvas() {
    var black_start_x = white_width - black_width / 2
    var white_start_x = 0
    var start_y = 0

    for (var i = 0; i < 100; i++) {
        // fillRect() parameters x, y-coordinates of upper-left corner, width, height 

        // draw white tiles 
        ctx.strokeStyle = 'black';
        for (var j = 0; j < 7; j++) {
            ctx.rect(white_start_x + white_width * j, start_y, white_width, white_height);
        }
        ctx.stroke();

        ctx.fillStyle = "black"
        // var tile_width = 150
        for (var j = 0; j < 3; j++) {
            ctx.fillRect(black_start_x + white_width * j, start_y, black_width, black_height);
        }
        var distance = black_start_x + white_width * j + white_width
        for (var j = 0; j < 2; j++) {
            ctx.fillRect(distance + white_width * j, start_y, black_width, black_height);
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

function printMousePos(event, type) {
    console.log("mouse clicked!!!")
    var rect = canvas.getBoundingClientRect();
    x = event.clientX //- rect.left
    y = event.clientY //- rect.top
    console.log(x, y)

    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4
    var r = data[index]
    // var g = data[index + 1] these aren't used either, bc binary
    // var b = data[index + 2]

    var white_start_x = 0
    var black_start_x = white_width - black_width / 2
    var key_order = ["F", "G", "A", "B", "C", "D", "E"]
    var flats_key_order = ["G", "A", "B", "D", "E"]
    var octave = 1
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < key_order.length; j++) {
            if (key_order[j] == "C") {
                octave++
            }
            if (x > white_start_x + white_width * j && x < white_start_x + white_width * (j + 1) && r == 255) {
                playSound("./piano-mp3/" + key_order[j] + (octave + i) + ".mp3")
            }
        }

        octave = 1
        key_index = 0 
        for (var j = 0; j < flats_key_order.length+1; j++) {
            /* if (flats_key_order[j] == "D") {
                octave++
            } */
            if (j == 3) {
                j++
                octave++
                // key_index--
            }
            console.log({key_index}, {j}, {black_start_x}, {white_width})
            if (x > black_start_x + white_width * j && x < black_start_x + white_width * j + black_width && r == 0) {
                console.log("./piano-mp3/" + flats_key_order[key_index] + "b" + (octave + i) + ".mp3")
                playSound("./piano-mp3/" + flats_key_order[key_index] + "b" + (octave + i) + ".mp3")
            } 
            key_index++
        }
        octave = 1
        /* octave++

        for (var j = 4; j < 6; j++) {
            // console.log({j}, flats_key_order)
            if (x > black_start_x + white_width * j && x < black_start_x + white_width * j + black_width && r == 0) {
                console.log("./piano-mp3/" + flats_key_order[j-1] + "b" + (octave + i) + ".mp3")
                playSound("./piano-mp3/" + flats_key_order[j-1] + "b" + (octave + i) + ".mp3")
            } 
        } */

        /* if (x > black_start_x && x < black_start_x + black_width && r == 0) {
            playSound("./piano-mp3/Gb" + (1 + i) + ".mp3")
        } else if (x > black_start_x + white_width && x < black_start_x + white_width + black_width && r == 0) {
            playSound("./piano-mp3/Ab" + (1 + i) + ".mp3")
        } else if (x > black_start_x + white_width * 2 && x < black_start_x + white_width * 2 + black_width && r == 0) {
            playSound("./piano-mp3/Bb" + (1 + i) + ".mp3")
        } else if (x > black_start_x + white_width * 4 && x < black_start_x + white_width * 4 + black_width && r == 0) {
            playSound("./piano-mp3/Db" + (2 + i) + ".mp3")
        } else if (x > black_start_x + white_width * 5 && x < black_start_x + white_width * 5 + black_width && r == 0) {
            playSound("./piano-mp3/Eb" + (2 + i) + ".mp3")
        } */
        black_start_x += 7 * white_width
        white_start_x += 7 * white_width
    }
    /* if (x > white_start_x && x < white_start_x + white_width && r == 255) {
        playSound("./piano-mp3/" + keyorder[i-1] + (1 + i) + ".mp3")
    } else if (x < white_width * 2 + white_start_x && x > white_start_x + white_width && r == 255) {
        console.log("in g", 1 + i)
        playSound("./piano-mp3/G" + (1 + i) + ".mp3")
    } else if (x < white_width * 3 + white_start_x && x > white_start_x + white_width * 2 && r == 255) {
        console.log("in A", 1 + i)
        playSound("./piano-mp3/A" + (1 + i) + ".mp3")
    } else if (x < white_width * 4 + white_start_x && x > white_start_x + white_width * 3 && r == 255) {
        playSound("./piano-mp3/B" + (1 + i) + ".mp3")
    } else if (x < white_width * 5 + white_start_x && x > white_start_x + white_width * 4 && r == 255) {
        playSound("./piano-mp3/C" + (2 + i) + ".mp3")
    } else if (x < white_width * 6 + white_start_x && x > white_start_x + white_width * 5 && r == 255) {
        playSound("./piano-mp3/D" + (2 + i) + ".mp3")
    } else if (x < white_width * 7 + white_start_x && x > white_start_x + white_width * 6 && r == 255) {
        playSound("./piano-mp3/E" + (2 + i) + ".mp3")
    } */

    // console.log({x}, {black_start_x}, {black_width}) 
}

// var a = data[index + 3] // alpha, how opaque pixels are. isn't used

// 255, 255, 255 is white. 0, 0, 0 is black 
// console.log({ index }, { r })

// y = Math.floor(y / cell_size)
// x = Math.floor(x / cell_size)
// console.log(x, y)
// console.log(x, y)

canvas.addEventListener("click", printMousePos, true)

/* canvas.onmousemove = function (event) {
    var white_start_x = 0
    var start_y = 0
    console.log("hi")
    x = event.clientX
    y = event.clientY
    if
    ctx.fillStyle = 'grey';
    ctx.fillRect(white_start_x + white_width * 0, start_y, white_width, white_height);
} */


// printMousePos()

// url = playSound("./piano-mp3/C2.mp3") 
