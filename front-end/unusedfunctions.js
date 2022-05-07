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