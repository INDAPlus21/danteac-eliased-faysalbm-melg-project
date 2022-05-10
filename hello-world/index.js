// Import our outputted wasm ES6 module
// Which, export default's, an initialization function
// https://wasmbyexample.dev/examples/hello-world/hello-world.rust.en-us.html
// wasm-pack build --target web
import init from "./pkg/hello_world.js";

const runWasm = async () => {
  // Instantiate our wasm module
  const helloWorld = await init("./pkg/hello_world_bg.wasm");

  const addResult = helloWorld.add(24, 24);

  const subtractResult = helloWorld.subtract(24, 24);

  const arrayOfObjects = [
    { name: "hello world", id: "99", parent_id: "88" },
    { name: "hello world2", id: "88", parent_id: "12" },
    { name: "hello world3", id: "77", parent_id: "88" },
  ]
  
  // const sum = helloWorld.test(arrayOfObjects);

  // helloWorld.test([1, 2, 3, 4])
  // helloWorld.receive_example_from_js([1, 2, 3, 4])

  helloWorld.get_value_from_js([3, 2])

  helloWorld.using_web_sys()

  const value = helloWorld.pass_value_to_js()

  const returned_string = helloWorld.return_string()
  console.log({returned_string})

  console.log({value})

  console.log({addResult})
  console.log({subtractResult})

  // console.log({sum})
};

runWasm();
