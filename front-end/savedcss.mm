:root {
    --white-width: 45px;
    --white-height: calc(var(--white-width)*6);
    --black-width: calc(var(--white-width)/2); 
    --background: rgb(22, 22, 22);
}

.tile {
    display: inline-block;
    border-radius: 5px;
    position: relative;
    border-width: 2px;
}

.white {
    border-style: solid;
    border-color: black;
    width: var(--white-width);
    height: var(--white-height);
    /* margin-right: -35px; */
    z-index: 0;
    background-color: white;
}

.black {
    background-color: black;
    height: calc(var(--white-width)*4);
    width: var(--black-width);
    vertical-align: top;
    right: -18px;
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
    z-index: 1;
}

#keyboard-container {
    height: var(--white-height); 
    /* Actually important that it's large, don't know why */
    width: 300%;
    overflow: scroll;
    overflow: hidden;
    /* border-top: 5px solid rgb(85, 85, 85); */
}

#keyboard-container-devider {
    position: absolute; 
    height: 5px; 
    width: 100%;
    background: linear-gradient(180deg, rgba(6,198,108,1) 0%, rgba(164,255,0,1) 100%); 
    z-index: 4; 
}

/* I think the slight misalignment definitely has something to do with this */ 
.next-white {
    margin-right: -5px;
    border-right-width: 0px;
    border-top-right-radius: 0px;
}

.next-white+div, .end-white, .next {
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
}

.end-white {
    border-right-width: 0px;
}

.octave-container {
    display: inline-block;
    margin-right: 30px;
}

/* Make selectionn impossible (to be able to roll on the keys with mouse) */
div {
    -webkit-touch-callout: none;
    /* iOS Safari */
    -webkit-user-select: none;
    /* Safari */
    -khtml-user-select: none;
    /* Konqueror HTML */
    -moz-user-select: none;
    /* Old versions of Firefox */
    -ms-user-select: none;
    /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.new-letter {
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    font-weight: bold;
    margin-bottom: 3px;
    font-size: 20px;
    z-index: -2;
    pointer-events: none;
}

.new-letter-black {
    color: white;
}

.falling-tile {
    background: linear-gradient(180deg, rgba(15,51,208,1) 0%, rgba(0,249,255,1) 100%); /* linear-gradient(180deg, rgba(208,15,200,1) 0%, rgba(20,38,173,1) 50%, rgba(0,249,255,1) 100%); */ /* var(--green); */ 
    height: 100px;
    width: calc(var(--white-width)/1.2);
    border-radius: 8px;
    vertical-align: bottom;
    position: absolute;
}

.black-falling-tile {
    width: calc(var(--black-width));
}

/* To create spacing between the tiles, everything here is essential */
.falling-tile:before {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    /* border: 2px solid blue;  var(--background);   */
    border-radius: 5px;
    /* Needs to be smaller than falling tile's */
}

#falling-tiles-container {
    position: relative;
    margin-top: 0;
    height: 200%;
}

#piano-display {
    position: absolute;
    bottom: 0;
    margin: none;
    background: var(--background);
}

body {
    background: var(--background);
    margin: 0px;
    overflow-y: hidden;
    overflow-x: hidden;
    width: 100%;
}

#settings {
    /* background-color: black; */
    color: white;
    width: 50%;
    height: 30px;
    z-index: 2;
    position: absolute;
    font-weight: bold;
    padding: 3px;
}

#pass_to_real_import {
    background: white; 
    border: none; 
    border-radius: 5px; 
    padding: 5px; 
    font-size: 15px; 
}

#pass_to_real_import:hover {
    cursor: pointer;
    background:rgb(226, 226, 226);
}