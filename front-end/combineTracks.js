export function combineTracks(left_hand, right_hand) {
    let combined = []

    let index_left = 0
    let index_right = 0

    let right_lead = 0;
    let left_lead = 0;

    function pushRight() {
        if (right_hand[index_right][0] == "no_note") {
            left_lead -= right_hand[index_right][1]
            index_right++
        } else {
            const diff = right_hand[index_right][1] - left_lead
            left_lead = 0
            right_lead += diff
            combined.push([right_hand[index_right][0], diff, 1])
            index_right++
        }
    }

    function pushLeft() {
        if (left_hand[index_left][0] == "no_note") {
            right_lead -= left_hand[index_left][1]
            index_left++
        } else {
            const diff = left_hand[index_left][1] - right_lead
            right_lead = 0
            left_lead += diff
            combined.push([left_hand[index_left][0], diff, 0]);
            index_left++
        }
    }

    while (true) {
        if (left_lead + left_hand[index_left][1] <= right_lead + right_hand[index_right][1]) {
            pushLeft()
        } else {
            pushRight()
        }

        if (!right_hand[index_right]) {
            if (left_hand[index_left]) pushLeft()
            combined = combined.concat(left_hand.slice(index_left))
            break;
        } else if (!left_hand[index_left]) {
            if (right_hand[index_right]) pushRight()
            combined = combined.concat(right_hand.slice(index_right))
            break;
        }
    }

    return combined
}

// TESTS 

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
    console.log({ callerName: caller });

    const combined = combineTracks(left_hand, right_hand)

    console.log({ combined }, { should_be }, { alternative })
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
testLeftHandConcat()
// testAnother()