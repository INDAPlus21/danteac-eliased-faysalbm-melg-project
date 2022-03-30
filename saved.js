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

    if (x < white_width && r == 255) {
        playSound("./piano-mp3/F2.mp3")
    } else if (x < white_width * 2 && x > white_width && r == 255) {
        playSound("./piano-mp3/G2.mp3")
    } else if (x < white_width * 3 && x > white_width * 2 && r == 255) {
        playSound("./piano-mp3/A2.mp3")
    } else if (x < white_width * 4 && x > white_width * 3 && r == 255) {
        playSound("./piano-mp3/B2.mp3")
    } else if (x < white_width * 5 && x > white_width * 4 && r == 255) {
        playSound("./piano-mp3/C3.mp3")
    } else if (x < white_width * 6 && x > white_width * 5 && r == 255) {
        playSound("./piano-mp3/D3.mp3")
    } else if (x < white_width * 7 && x > white_width * 6 && r == 255) {
        playSound("./piano-mp3/E3.mp3")
    }

    black_start_x = white_width - black_width / 2
    // console.log({x}, {black_start_x}, {black_width}) 
    if (x > black_start_x && x < black_start_x + black_width && r == 0) {
        playSound("./piano-mp3/Gb2.mp3")
    } else if (x > black_start_x + white_width && x < black_start_x + white_width + black_width && r == 0) {
        playSound("./piano-mp3/Ab2.mp3")
    } else if (x > black_start_x + white_width * 2 && x < black_start_x + white_width * 2 + black_width && r == 0) {
        playSound("./piano-mp3/Bb2.mp3")
    } else if (x > black_start_x + white_width * 4 && x < black_start_x + white_width * 4 + black_width && r == 0) {
        playSound("./piano-mp3/Db3.mp3")
    } else if (x > black_start_x + white_width * 5 && x < black_start_x + white_width * 5 + black_width && r == 0) {
        playSound("./piano-mp3/Eb3.mp3")
    } 

    // var a = data[index + 3] // alpha, how opaque pixels are. isn't used

    // 255, 255, 255 is white. 0, 0, 0 is black 
    // console.log({ index }, { r })

    // y = Math.floor(y / cell_size)
    // x = Math.floor(x / cell_size)
    // console.log(x, y)
    // console.log(x, y)
}

canvas.addEventListener("click", printMousePos, true)


// printMousePos()

// url = playSound("./piano-mp3/C2.mp3") 
