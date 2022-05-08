import { songs } from "./songs.js"
import * as fs from 'fs';
import * as assert from 'assert';

// export function combineTracks(left_hand, right_hand) {
//     // no we need a combined array (also) so we don't modify it within the for loops 
//     let combined = []

//     let delta_time_elapsed_left = 0
//     let delta_time_elapsed_right = 0

//     let index_left = 0
//     let index_right = 0

//     // is there a performance cost to looking up an array's length? performance test this algorithm! 
//     // it feels like the problem is that the deltaTime for the individual array shouldn't always work...
//     // yes. it definitely needs to be adjusted 
//     // and the reason it works fine (yes hypothesis confirmed if you look at the sheet music)
//     // for the first parts is that all the tones are played simultanously 
//     // so we want E5 to have a lower deltatime
//     // it originally is relative to [D4, 455] the bar before, wheras 
//     // you can continue tomorrow with the slicing... 
//     // ["D4", 13], ["B4", 0], ["D4", 455], ["B4", 0], ["E5", 745], ["G5", 0], 248
//     // left hand ["C3", 265], ["C3", 455], ["G3", 265], ["G3", 227]
//     // where is that information? relative to the previous note??? 
//     // it's somewhere in if the deltatime for the previous note in the two different arrays
//     // differ...? yes... you should adjust it in some way... 
//     // you see, relative to C3, 455, not B4. You KEPT it as B4, and then it obviously doesn't work...
//     // and this happens when there is a note of the other's in between (i.e all the time)
//     // 

//     let right_lead = 0;
//     let left_lead = 0;

//     // you use while loops surprisingly rarely... 
//     while (true) {
//         delta_time_elapsed_left += left_hand[index_left][1]
//         delta_time_elapsed_right += right_hand[index_right][1]

//         // you shouldn't need to affect subtract relative here, it's basically only here you 
//         // were regardless. yeah reset 
//         // yeah right... you probably need to update what you subtract... or? 
//         if (delta_time_elapsed_left == delta_time_elapsed_right) {
//             // let max_delta = Math.max(left_hand[index_left][1], right_hand[index_right][1])
//             // combined.push([left_hand[index_left][0], max_delta]);
//             combined.push(left_hand[index_left]);
//             combined.push([right_hand[index_right][0], 0]) 

//             /* if (left_hand[index_left][1] > right_hand[index_right][1]) {
//                 combined.push(left_hand[index_left]);
//                 combined.push([right_hand[index_right][0], 0])
//             } */
//             // no right!!! it's still possible for them to get away from each other here
//             left_lead += right_hand[index_right][1] - left_hand[index_left][1]
//             right_lead = 0
//             index_left++
//             index_right++
//         } else if (delta_time_elapsed_left < delta_time_elapsed_right) {
//             left_hand[index_left][1] = left_hand[index_left][1] - right_lead
//             right_lead = 0
//             left_lead += left_hand[index_left][1]
//             combined.push(left_hand[index_left]);
//             index_left++
//             delta_time_elapsed_right -= right_hand[index_right][1]
//         } else {
//             right_hand[index_right][1] = right_hand[index_right][1] - left_lead
//             left_lead = 0
//             right_lead += right_hand[index_right][1]
//             combined.push(right_hand[index_right])
//             index_right++
//             delta_time_elapsed_left -= left_hand[index_left][1]
//         }

//         if (!right_hand[index_right]) {
//             combined.concat(left_hand.slice(index_left))
//             break;
//         } else if (!left_hand[index_left]) {
//             combined.concat(right_hand.slice(index_right))
//             break;
//         }
//     }

//     return combined
// }

export function combineTracks(left_hand, right_hand) {
    let combined = []

    let index_left = 0
    let index_right = 0

    // is there a performance cost to looking up an array's length? performance test this algorithm! 
    // just have the leads instead of delta times! 

    let right_lead = 0;
    let left_lead = 0;

    function pushRight() {
        right_hand[index_right][1] = right_hand[index_right][1] - left_lead
        left_lead = 0
        right_lead += right_hand[index_right][1]
        combined.push(right_hand[index_right])
        index_right++
    }

    function pushLeft() {
        left_hand[index_left][1] = left_hand[index_left][1] - right_lead
        right_lead = 0
        left_lead += left_hand[index_left][1]
        combined.push(left_hand[index_left]);
        index_left++
    }

    while (true) {
        console.log(right_hand[index_right], { right_lead }, left_hand[index_left], { left_lead })

        if (left_lead + left_hand[index_left][1] == right_lead + right_hand[index_right][1]) {
            // aha! det blir fel ordning här eftersom +38 blir lika med... 
            // fast det BORDE bli right hand direkt 
            // nej det ÄR att algoritmen har rätt för fan 
            left_hand[index_left][1] = left_hand[index_left][1] - right_lead
            combined.push(left_hand[index_left]);
            combined.push([right_hand[index_right][0], 0])

            left_lead = 0
            right_lead = 0
            index_left++
            index_right++
        } else if (left_lead + left_hand[index_left][1] < right_lead + right_hand[index_right][1]) {
            pushLeft()
        } else {
            pushRight()
        }

        if (!right_hand[index_right]) {
            // du borde också ta hänsyn till lead här 
            console.log("concating left", left_hand.slice(index_left))
            pushLeft()
            combined = combined.concat(left_hand.slice(index_left))
            break;
        } else if (!left_hand[index_left]) {
            console.log("concating right", { index_right })
            pushRight()
            combined = combined.concat(right_hand.slice(index_right))
            break;
        }
    }

    return combined
}

// write test cases! 

// let left_hand = [["D3", 0], ["D3", 227], ["D3", 13], ["D3", 227], ["D3", 253], ["D3", 227], ["D3", 253], ["D3", 227], ["D3", 13], ["D3", 455], ["G3", 25], ["G3", 455], ["G2", 505], ["G2", 455], ["G3", 505], ["G3", 455], ["E3", 265], ["E3", 455], ["C3", 265], ["C3", 455], ["F3", 265], ["F3", 455], ["G3", 25], ["G3", 455], ["Gb3", 25], ["Gb3", 227], ["F3", 13], ["F3", 455], ["E3", 25], ["E3", 303], ["C4", 17], ["C4", 303], ["E4", 17], ["E4", 303], ["F4", 17], ["F4", 455], ["D4", 25], ["D4", 227], ["E4", 13], ["E4", 227], ["C4", 253], ["C4", 455], ["A3", 25], ["A3", 227], ["B3", 13], ["B3", 227], ["G3", 13], ["G3", 455], ["G3", 265], ["G3", 455], ["E3", 265], ["E3", 455], ["C3", 265], ["C3", 455], ["F3", 265], ["F3", 455], ["G3", 25], ["G3", 455], ["Gb3", 25], ["Gb3", 227], ["F3", 13], ["F3", 455], ["E3", 25], ["E3", 303], ["C4", 17], ["C4", 303], ["E4", 17], ["E4", 303], ["F4", 17], ["F4", 455], ["D4", 25], ["D4", 227], ["E4", 13], ["E4", 227], ["C4", 253], ["C4", 455], ["A3", 25], ["A3", 227], ["B3", 13], ["B3", 227], ["G3", 13], ["G3", 455], ["C3", 265], ["C3", 455], ["G3", 265], ["G3", 227], ["C4", 493], ["C4", 455], ["F3", 25], ["F3", 455], ["C4", 265], ["C4", 227], ["C4", 13], ["C4", 240], ["F3", 240], ["F3", 455], ["C3", 25], ["C3", 455], ["G3", 265], ["G3", 227], ["G3", 493], ["G3", 227], ["C4", 13], ["C4", 227], ["G3", 1453]];

// let right_hand = [["Gb4", 0], ["E5", 0], ["Gb4", 227], ["E5", 0], ["Gb4", 13], ["E5", 0], ["Gb4", 227], ["E5", 0], ["Gb4", 253], ["E5", 0], ["Gb4", 227], ["E5", 0], ["Gb4", 253], ["C5", 0], ["Gb4", 227], ["C5", 0], ["Gb4", 13], ["E5", 0], ["Gb4", 455], ["E5", 0], ["G4", 25], ["B4", 0], ["G5", 0], ["G4", 455], ["B4", 0], ["G5", 0], ["G4", 505], ["G4", 455], ["E4", 505], ["C5", 0], ["E4", 455], ["C5", 0], ["C4", 265], ["G4", 0], ["C4", 455], ["G4", 0], ["G3", 265], ["E4", 0], ["G3", 455], ["E4", 0], ["C4", 265], ["A4", 0], ["C4", 455], ["A4", 0], ["D4", 25], ["B4", 0], ["D4", 455], ["B4", 0], ["Db4", 25], ["Bb4", 0], ["Db4", 227], ["Bb4", 0], ["C4", 13], ["A4", 0], ["C4", 455], ["A4", 0], ["C4", 25], ["G4", 0], ["C4", 303], ["G4", 0], ["G4", 17], ["E5", 0], ["G4", 303], ["E5", 0]];

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

function testConcat() {
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
}

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

    let combined = combineTracks(left_hand, right_hand)

    console.log({ combined }, { should_be }, {alternative})
    console.log(arraysEqual(combined, should_be) || arraysEqual(combined, alternative))
}

function testSimple() {
    let left_hand = [["C1", 0], ["C1", 1]]
    let right_hand = [["E1", 2], ["E1", 3], ["D1", 4]]

    let should_be = [
        ['C1', 0], ['C1', 1],
        ['E1', 1], ['E1', 3],
        ['D1', 4]
    ]

    testWrapper(left_hand, right_hand, should_be)
}

function testLeftHandConcat() {
    let left_hand = [["E1", 2], ["E1", 3], ["D1", 4]]
    let right_hand = [["C1", 0], ["C1", 1]]

    let should_be = [
        ['C1', 0], ['C1', 1],
        ['E1', 1], ['E1', 3],
        ['D1', 4]
    ]

    testWrapper(left_hand, right_hand, should_be)
}

function testAnother() {
    let left_hand = [["E1", 2], ["E1", 3], ["D1", 4]]
    let right_hand = [["C1", 0], ["C1", 1], ["C1", 1]]

    let should_be = [
        ['C1', 0], ['C1', 1], ["C1", 1],
        ['E1', 0], ['E1', 3],
        ['D1', 4]
    ]

    let alternative = [
        ['C1', 0], ['C1', 1], ["E1", 1],
        ['C1', 0], ['E1', 3],
        ['D1', 4]
    ]

    testWrapper(left_hand, right_hand, should_be, alternative)

    // should be in testwrapper 
    // testWrapper(right_hand, left_hand, should_be, alternative)
}

// wait testing is maybe actually useful 
// testMultipleNotesOtherHandInRow()
// testConcat()
// testSimple()
// testLeftHandConcat()
// testAnother()

let combined = combineTracks(songs["mario_left"], songs["mario"])
console.log(combined.slice())

fs.writeFile("./notes_array.json", JSON.stringify(combined), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

/* [
    ['C3', 265], ['C3', 455],
    ['E5', 25], ['G5', 0],
    ['E5', 227], ['G5', 0],
    ['G3', 38], ['Eb5', 0],
    ['Gb5', 0], ['G3', 265],
    ['G3', 227]
] */

// console.log([["D3", 0], ["Gb4", 0], ["E5", 0], ["D3", 227], ["Gb4", 0], ["E5", 0], ["D3", 13], ["Gb4", 0], ["E5", 0], ["D3", 227], ["Gb4", 0], ["E5", 0], ["D3", 253], ["Gb4", 0], ["E5", 0], ["D3", 227], ["Gb4", 0], ["E5", 0], ["D3", 253], ["Gb4", 0], ["C5", 0], ["D3", 227], ["Gb4", 0], ["C5", 0], ["D3", 13], ["Gb4", 0], ["E5", 0], ["D3", 455], ["Gb4", 0], ["E5", 0], ["G3", 25], ["G4", 0], ["B4", 0], ["G5", 0], ["G3", 455], ["G4", 0], ["B4", 0], ["G5", 0], ["G2", 505], ["G4", 0], ["G2", 455], ["G4", 0], ["G3", 505], ["E4", 0], ["C5", 0], ["G3", 455], ["E4", 0], ["C5", 0], ["E3", 265], ["C4", 0], ["G4", 0], ["E3", 455], ["C4", 0], ["G4", 0], ["C3", 265], ["G3", 0], ["E4", 0], ["C3", 455], ["G3", 0], ["E4", 0], ["F3", 265], ["C4", 0], ["A4", 0], ["F3", 455], ["C4", 0], ["A4", 0], ["G3", 25], ["D4", 0], ["B4", 0], ["G3", 455], ["D4", 0], ["B4", 0], ["Gb3", 25], ["Db4", 0], ["Bb4", 0], ["Gb3", 227], ["Db4", 0], ["Bb4", 0], ["F3", 13], ["C4", 0], ["A4", 0], ["F3", 455], ["C4", 0], ["A4", 0], ["E3", 25], ["C4", 0], ["G4", 0], ["E3", 303], ["C4", 0], ["G4", 0], ["C4", 17], ["G4", 0], ["E5", 0], ["C4", 303], ["G4", 0], ["E5", 0], ["E4", 17], ["B4", 0], ["G5", 0], ["E4", 303], ["B4", 0], ["G5", 0], ["F4", 17], ["C5", 0], ["A5", 0], ["F4", 455], ["C5", 0], ["A5", 0], ["D4", 25], ["A4", 0], ["F5", 0], ["D4", 227], ["A4", 0], ["F5", 0], ["E4", 13], ["B4", 0], ["G5", 0], ["E4", 227], ["B4", 0], ["G5", 0], ["C4", 253], ["A4", 0], ["E5", 0], ["C4", 455], ["A4", 0], ["E5", 0], ["A3", 25], ["E4", 0], ["C5", 0], ["A3", 227], ["E4", 0], ["C5", 0], ["B3", 13], ["F4", 0], ["D5", 0], ["B3", 227], ["F4", 0], ["D5", 0], ["G3", 13], ["D4", 0], ["B4", 0], ["G3", 455], ["D4", 0], ["B4", 0], ["G3", 265], ["E4", 0], ["C5", 0], ["G3", 455], ["E4", 0], ["C5", 0], ["E3", 265], ["C4", 0], ["G4", 0], ["E3", 455], ["C4", 0], ["G4", 0], ["C3", 265], ["G3", 0], ["E4", 0], ["C3", 455], ["G3", 0], ["E4", 0], ["F3", 265], ["C4", 0], ["A4", 0], ["F3", 455], ["C4", 0], ["A4", 0], ["G3", 25], ["D4", 0], ["B4", 0], ["G3", 455], ["D4", 0], ["B4", 0], ["Gb3", 25], ["Db4", 0], ["Bb4", 0], ["Gb3", 227], ["Db4", 0], ["Bb4", 0], ["F3", 13], ["C4", 0], ["A4", 0], ["F3", 455], ["C4", 0], ["A4", 0], ["E3", 25], ["C4", 0], ["G4", 0], ["E3", 303], ["C4", 0], ["G4", 0], ["C4", 17], ["G4", 0], ["E5", 0], ["C4", 303], ["G4", 0], ["E5", 0], ["E4", 17], ["B4", 0], ["G5", 0], ["E4", 303], ["B4", 0], ["G5", 0], ["F4", 17], ["C5", 0], ["A5", 0], ["F4", 455], ["C5", 0], ["A5", 0], ["D4", 25], ["A4", 0], ["F5", 0], ["D4", 227], ["A4", 0], ["F5", 0], ["E4", 13], ["B4", 0], ["G5", 0], ["E4", 227], ["B4", 0], ["G5", 0], ["C4", 253], ["A4", 0], ["E5", 0], ["C4", 455], ["A4", 0], ["E5", 0], ["A3", 25], ["E4", 0], ["C5", 0], ["A3", 227], ["E4", 0], ["C5", 0], ["B3", 13], ["F4", 0], ["D5", 0], ["B3", 227], ["F4", 0], ["D5", 0], ["G3", 13], ["D4", 0], ["B4", 0], ["G3", 455], ["D4", 0], ["B4", 0], ["C3", 265], ["C3", 455]].length)

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