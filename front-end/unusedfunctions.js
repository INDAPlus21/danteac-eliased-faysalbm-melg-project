let has_won = false
let played_notes = []
let false_notes = 0

function arraysEqual(a, b) {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false
    }
    return true
}

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
}

function stopSelfPlay() {
    song_to_play = [] // to make running function end 
    self_play = !self_play
    let button = document.getElementById("self-play")
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

/* function preLoad() {
    let order_some_don = ["A", "Ab", "B", "Bb", "C", "D", "Db", "E", "Eb", "F", "G", "Gb"]
    for (let i = 0; i < order_some_don.length; i++) {
        for (let j = 1; j < 8; j++) {
            let url = "./piano-mp3/" + order_some_don[i] + j + ".mp3"
            console.log({ url })
            let audio = new Audio(url) // controversial ternary operators 
        }
    }
} */

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