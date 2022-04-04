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