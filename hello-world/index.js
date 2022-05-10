// Import our outputted wasm ES6 module
// Which, export default's, an initialization function
// https://wasmbyexample.dev/examples/hello-world/hello-world.rust.en-us.html
// wasm-pack build --target web

/* 
WebAssembly only supports a few numeric types, which is all that can be returned via an exported function.




*/

// const fs = require("fs") 

import init, { say, add, return_song_vectors, send_example_to_js, send_vec_just_numbers, receive_example_from_js, process_file } from './pkg/hello_world.js';
// import init from "./pkg/hello_world.js";

async function run() {
  await init();
  console.log(say("Elias"))
  console.log(add(1, 2))
  console.log(return_song_vectors())
  console.log(send_example_to_js())
  // console.log(send_complex_vec())
  console.log(send_vec_just_numbers())
  receive_example_from_js([[1, 2]])

  const fileData = new Uint8Array(23);
  process_file(fileData)

  /* file.arrayBuffer().then(buff => {
      let x = new Uint8Array(buff); // x is your uInt8Array
      // perform all required operations with x here.
  }); */


  // receive_midi([1, 2, 3])
  /* var buttonOne = document.getElementById('buttonOne');
  buttonOne.addEventListener('click', function () {
    var input = $("#nameInput").val();
    alert(say(input));
  }, false); */
}

run();

/* const runWasm = async () => {

  // Instantiate our wasm module
  // const helloWorld = await init("./pkg/hello_world_bg.wasm");
  await init();

  console.log(return_string())

  /* const addResult = helloWorld.add(24, 24);

  const subtractResult = helloWorld.subtract(24, 24);

  const arrayOfObjects = [
    { name: "hello world", id: "99", parent_id: "88" },
    { name: "hello world2", id: "88", parent_id: "12" },
    { name: "hello world3", id: "77", parent_id: "88" },
  ]

  // const sum = helloWorld.test(arrayOfObjects);

  // helloWorld.test([1, 2, 3, 4])
  // helloWorld.receive_example_from_js([1, 2, 3, 4])

  // helloWorld.get_value_from_js([3, 2])

  helloWorld.using_web_sys()

  // const value = helloWorld.pass_value_to_js()

  const returned_string = helloWorld.return_string()
  console.log({returned_string})

  const returned_null = helloWorld.return_js_value()
  console.log({returned_null})

  // console.log({value})

  console.log({addResult})
  console.log({subtractResult}) */

  // console.log({sum})
// };

// runWasm();
//  * /