export function combineTracks(left_hand, right_hand) {
    // no we need a combined array so we don't modify it within the for loops 
    let combined = []

    let delta_time_elapsed_left = 0
    let delta_time_elapsed_right = 0

    // let right_hand_buffer = []

    let index_left = 0
    let index_right = 0

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

    let relative_delta_time = 0
    let desired_length = left_hand.length + right_hand.length

    // WHAT? I invented an original algorithm!!?!?!? 
    // is there a performance cost to looking up an array's length? performance test this algorithm! 
    // you use while loops surprisingly rarely 
    while (combined.length < desired_length) {
        delta_time_elapsed_left += left_hand[index_left][1]
        delta_time_elapsed_right += right_hand[index_right][1]

        if (delta_time_elapsed_left == delta_time_elapsed_right) {
            // let delta_time_difference = right_hand[index_right][1] - combined[combined.length-1][1] // doesn't matter which 
            // combined.push([left_hand[index_left][0], delta_time_elapsed_left]) 
            // i.e previous deltatime... how is that useful?  
            // relative_delta_time = combined[combined.length-1][1]
            combined.push(left_hand[index_left]);
            combined.push([right_hand[index_right][0], 0]) // that much is obvious
            index_left++
            index_right++
        } else if (delta_time_elapsed_left < delta_time_elapsed_right) {
            // combined.push([left_hand[index_left][0], delta_time_elapsed_left])
            combined.push(left_hand[index_left]);
            index_left++
            delta_time_elapsed_right -= right_hand[index_right][1]
        } else {
            // combined.push([right_hand[index_right][0], delta_time_elapsed_right])
            combined.push(right_hand[index_right])
            index_right++
            delta_time_elapsed_left -= left_hand[index_left][1]
        }

        if (!right_hand[index_right]) {
            combined.concat(left_hand.slice(index_left))
            break;
        } else if (!left_hand[index_left]) {
            combined.concat(right_hand.slice(index_right))
            break;
        }

        /* if (delta_time_elapsed_left < delta_time_elapsed_right) {
            // update new delta time 
            left_hand[i][1] = delta_time_elapsed_right - delta_time_elapsed_left
            // right_hand.splice(j, 0, left_hand[i])     
            combined.push(left_hand[i])
            combined.push(left_hand[i])
            // not of? 
            /* for (let eve of right_hand_buffer) {
                combined.push(eve)
            } 
        }  */

        /*  else {
            right_hand_buffer = []
        } */

        /* for (let j = 0; j < right_hand.length; j++) { 
            delta_time_elapsed_right += right_hand[j][1]
            // console.log(delta_time_elapsed_left, delta_time_elapsed_right)
            if (delta_time_elapsed_left < delta_time_elapsed_right) {
                // update new delta time 
                left_hand[i][1] = delta_time_elapsed_right - delta_time_elapsed_left
                // right_hand.splice(j, 0, left_hand[i])     
                combined.push(left_hand[i])
            }
        } */
    }
    return combined
}

let left_hand = [["D3", 0], ["D3", 227], ["D3", 13], ["D3", 227], ["D3", 253], ["D3", 227], ["D3", 253], ["D3", 227], ["D3", 13], ["D3", 455], ["G3", 25], ["G3", 455], ["G2", 505], ["G2", 455], ["G3", 505], ["G3", 455], ["E3", 265], ["E3", 455], ["C3", 265], ["C3", 455], ["F3", 265], ["F3", 455], ["G3", 25], ["G3", 455], ["Gb3", 25], ["Gb3", 227], ["F3", 13], ["F3", 455], ["E3", 25], ["E3", 303], ["C4", 17], ["C4", 303], ["E4", 17], ["E4", 303], ["F4", 17], ["F4", 455], ["D4", 25], ["D4", 227], ["E4", 13], ["E4", 227], ["C4", 253], ["C4", 455], ["A3", 25], ["A3", 227], ["B3", 13], ["B3", 227], ["G3", 13], ["G3", 455], ["G3", 265], ["G3", 455], ["E3", 265], ["E3", 455], ["C3", 265], ["C3", 455], ["F3", 265], ["F3", 455], ["G3", 25], ["G3", 455], ["Gb3", 25], ["Gb3", 227], ["F3", 13], ["F3", 455], ["E3", 25], ["E3", 303], ["C4", 17], ["C4", 303], ["E4", 17], ["E4", 303], ["F4", 17], ["F4", 455], ["D4", 25], ["D4", 227], ["E4", 13], ["E4", 227], ["C4", 253], ["C4", 455], ["A3", 25], ["A3", 227], ["B3", 13], ["B3", 227], ["G3", 13], ["G3", 455], ["C3", 265], ["C3", 455], ["G3", 265], ["G3", 227], ["C4", 493], ["C4", 455], ["F3", 25], ["F3", 455], ["C4", 265], ["C4", 227], ["C4", 13], ["C4", 240], ["F3", 240], ["F3", 455], ["C3", 25], ["C3", 455], ["G3", 265], ["G3", 227], ["G3", 493], ["G3", 227], ["C4", 13], ["C4", 227], ["G3", 1453]];

let right_hand = [["Gb4", 0], ["E5", 0], ["Gb4", 227], ["E5", 0], ["Gb4", 13], ["E5", 0], ["Gb4", 227], ["E5", 0], ["Gb4", 253], ["E5", 0], ["Gb4", 227], ["E5", 0], ["Gb4", 253], ["C5", 0], ["Gb4", 227], ["C5", 0], ["Gb4", 13], ["E5", 0], ["Gb4", 455], ["E5", 0], ["G4", 25], ["B4", 0], ["G5", 0], ["G4", 455], ["B4", 0], ["G5", 0], ["G4", 505], ["G4", 455], ["E4", 505], ["C5", 0], ["E4", 455], ["C5", 0], ["C4", 265], ["G4", 0], ["C4", 455], ["G4", 0], ["G3", 265], ["E4", 0], ["G3", 455], ["E4", 0], ["C4", 265], ["A4", 0], ["C4", 455], ["A4", 0], ["D4", 25], ["B4", 0], ["D4", 455], ["B4", 0], ["Db4", 25], ["Bb4", 0], ["Db4", 227], ["Bb4", 0], ["C4", 13], ["A4", 0], ["C4", 455], ["A4", 0], ["C4", 25], ["G4", 0], ["C4", 303], ["G4", 0], ["G4", 17], ["E5", 0], ["G4", 303], ["E5", 0]];

let combined = combineTracks(left_hand, right_hand)
console.log({ combined })