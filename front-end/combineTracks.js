import { songs } from "./songs.js"

// looking up an array's length is O(1) 

export function combineTracks(left_hand, right_hand) {
    let combined = []

    let index_left = 0
    let index_right = 0

    // the bug makes perfect sense! the right hand is intrepreted as LEFT HAND (?), or something of the like 

    let right_lead = 0;
    let left_lead = 0;

    function pushRight() {
        right_hand[index_right][1] = right_hand[index_right][1] - left_lead
        left_lead = 0
        right_lead += right_hand[index_right][1]
        combined.push([right_hand[index_right][0], right_hand[index_right][1], 1])
        index_right++
    }

    function pushLeft() {
        left_hand[index_left][1] = left_hand[index_left][1] - right_lead
        right_lead = 0
        left_lead += left_hand[index_left][1]
        combined.push([left_hand[index_left][0], left_hand[index_left][1], 0]);
        index_left++
    }

    while (true) {
        // console.log(right_hand[index_right], { right_lead }, left_hand[index_left], { left_lead })

        if (left_lead + left_hand[index_left][1] <= right_lead + right_hand[index_right][1]) {
            pushLeft()
        } else {
            pushRight()
        }

        // eller kan det ha att göra med eventtyp 8 !?!??! 

        if (!right_hand[index_right]) {
            // du borde också ta hänsyn till lead här 
            console.log("concating left", left_hand.slice(index_left))
            if (left_hand[index_left]) pushLeft()
            combined = combined.concat(left_hand.slice(index_left))
            break;
        } else if (!left_hand[index_left]) {
            console.log("concating right", { index_right })
            if (right_hand[index_right]) pushRight()
            combined = combined.concat(right_hand.slice(index_right))
            break;
        }
    }

    return combined
}

function arraysEqual(a1, a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1) == JSON.stringify(a2);
}


/* function testMultipleNotesOtherHandInRow() {
    // let left_hand = [["C3", 265], ["C3", 455], ["G3", 265], ["G3", 227]]
    // let right_hand = [["E5", 745], ["G5", 0], ["E5", 227] , ["G5", 0], ["G3", 265], ["Eb5", 0], ["Gb5", 0]]

    let left_hand = [["G3", 265], ["G3", 227]]
    let right_hand = [["E5", 227], ["G5", 0], ["G3", 265]]

    let combined = combineTracks(left_hand, right_hand)

    let should_be = [
        ['E5', 227], ['G5', 0],
        ['G3', 38], ['G3', 227],
        ['G3', 0]
    ]
    console.log({ combined }, { should_be })
    // aha! är det nåt med det? 

    console.log(arraysEqual(combined, should_be))
} */

/* function testConcat() {
    let left_hand = [["G3", 265], ["G3", 227]]
    let right_hand = [["E5", 227], ["G5", 0], ["G3", 265]]

    let combined = combineTracks(left_hand, right_hand)

    let should_be = [
        ['E5', 227], ['G5', 0],
        ['G3', 38], ['G3', 227],
        ['G3', 0]
    ]

    console.log({ combined }, { should_be })
    console.log(arraysEqual(combined, should_be))
} */

function testWrapper(left_hand, right_hand, should_be, alternative) {
    // get name of caller 
    let caller;
    try { throw new Error(); }
    catch (e) { 
        let re = /(\w+)@|at (\w+) \(/g, st = e.stack, m;
        re.exec(st), m = re.exec(st);
        caller = m[1] || m[2];
    }
    console.log({callerName: caller});

    const combined = combineTracks(left_hand, right_hand)

    console.log({ combined }, { should_be }, {alternative})
    console.log(arraysEqual(combined, should_be) || arraysEqual(combined, alternative))
}

function testSimple() {
    const left_hand = [["C1", 0], ["C1", 1]]
    const right_hand = [["E1", 2], ["E1", 3], ["D1", 4]]

    const should_be = [
        ['C1', 0], ['C1', 1],
        ['E1', 1], ['E1', 3],
        ['D1', 4]
    ]

    testWrapper(left_hand, right_hand, should_be)
}

function testLeftHandConcat() {
    const left_hand = [["E1", 2], ["E1", 3], ["D1", 4]]
    const right_hand = [["C1", 0], ["C1", 1]]

    const should_be = [
        ['C1', 0], ['C1', 1],
        ['E1', 1], ['E1', 3],
        ['D1', 4]
    ]

    testWrapper(left_hand, right_hand, should_be)
}

function testAnother() {
    const left_hand = [["E1", 2], ["E1", 3], ["D1", 4]]
    const right_hand = [["C1", 0], ["C1", 1], ["C1", 1]]

    const should_be = [
        ['C1', 0], ['C1', 1], ["C1", 1],
        ['E1', 0], ['E1', 3],
        ['D1', 4]
    ]

    const alternative = [
        ['C1', 0], ['C1', 1], ["E1", 1],
        ['C1', 0], ['E1', 3],
        ['D1', 4]
    ]

    testWrapper(left_hand, right_hand, should_be, alternative)
}

// wait testing is maybe actually useful 
// testMultipleNotesOtherHandInRow()
// testConcat()
// testSimple()
// testLeftHandConcat()
// testAnother()

/* Reasoning (you don't need to read through this) */
// this is a method which has less complexity... async js and ui manipulation introduces so much that 
// you need to synchronize 
// horrific time complexity, but will work 
// a big obvious improvement is caching where you are in the right hand 
// so we first want 0, 0, then BOTH inserted 
// then we have the second index, total times elapsed are 227 and 0  
// we want to insert D3, and keep E5... 
// we need two separate "pointers"! 
// so we now have index_left and index_right as 1 
// because D3 (left) has a higher delta time, we want to insert the RIGHT hand 
// then there's the problem that we can't double count  
// no... how can we make them equal? 
// remember that _i is completely irrelevant, it's only the there to make sure that we iter[0], delta_time_elapsed_rightate enough times 
// and we want to iterate through the longest hand... right? 
// no, Math.max(left_hand.length, right_hand.length) isn't correct 
// we want to iterate until the combined array's length is equal to both the other's COMBINED (duh!) 
// after we've inserted E5, D3 and Gb4 have equal again, but will the elapsed times be equal...?
// is the double count problem solved by putting them 
// no... by subtracting if we don't use it! brilliant idea! 
// right... we don't want the actual delta time to get appended, but the difference 
// WHAT!?!??! the basic concept works!!?!??!?!? actual thinking involved here 
// we want Gb4 not to have a deltatime of 227, but of 0. We could get 0 by subtracing 
// the previous element, but for D3 we then want to subtract the entire total deltatime... 
// so take max, or it's obvious which is max  
// or a new variable relative deltatime which is reset 
// now we have the fucking problem of you trying to solve the problem of only one more note again 
// there can be MULTIPLE notes that have deltatime 0 
// Iiii know the reason E5 should be 0 is because its deltatime is 0 
// Ooooh we maybe should use delta_time_elapsed_left at all when adding to the array 
// no we need a relative delta time  
// ["E5", 745], ["G5", 0]