// The wasm-pack uses wasm-bindgen to build and generate JavaScript binding file.
// Import the wasm-bindgen crate.
use wasm_bindgen::prelude::*;
// extern crate serde_json;
extern crate wasm_bindgen;
use web_sys::console;
extern crate console_error_panic_hook;
// use std::collections::HashMap;

// #[macro_use]
// extern crate serde_derive;
use serde_wasm_bindgen; 

// Our Add function
// wasm-pack requires "exported" functions
// to include #[wasm_bindgen]
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

#[wasm_bindgen]
pub fn subtract(a: i32, b: i32) -> i32 {
    return a - b;
}

#[wasm_bindgen]
pub fn return_string() -> String {
    return "hello".to_string()
}

/* #[derive(Serialize, Deserialize)]
pub struct Example {
    pub field1: HashMap<u32, String>,
    pub field2: Vec<Vec<f32>>,
    pub field3: [f32; 4],
}

#[wasm_bindgen]
pub fn receive_example_from_js(val: &JsValue) {
    console_error_panic_hook::set_once();

    let example: Example = val.into_serde().unwrap();

    /*     let js: JsValue = example.into();
       console::log_2(&"Logging arbitrary values looks like".into(), &js);
    */
} */

/* #[wasm_bindgen]
pub fn pass_value_to_js() -> Result<(), JsValue> {
	let some_supported_rust_value = ("Hello, world!", 42);
	let js_value = serde_wasm_bindgen::to_value(&some_supported_rust_value)?;
	
	Ok(())
}

#[wasm_bindgen]
pub fn get_value_from_js(value: JsValue) -> Result<(), JsValue> {
  console_error_panic_hook::set_once();

	let value: Vec<f32> = serde_wasm_bindgen::from_value(value)?;

  console::log_1(&"in get value from js".into());

  // let js: JsValue = value.into();
  // console::log_2(&"value: ".into(), &js);

	// ...
	Ok(())
} */


/* #[wasm_bindgen]
pub fn test(js_objects: &JsValue)  {
    console_error_panic_hook::set_once();

    console::log_1(&"in test".into());

    let elements: Vec<i32> = js_objects.into_serde().unwrap();

    console::log_1(&"after elements".into());
    /* elements
        .iter()
        .map(|e| {
            let id = e.id.parse::<i32>().unwrap_or(0);
            let parent_id = e.parent_id.parse::<i32>().unwrap_or(0);
            id + parent_id
        })
        .sum() */
} */

#[wasm_bindgen]
pub fn using_web_sys() {
    console::log_1(&"Hello using web-sys".into());

    let js: JsValue = 4.into();
    console::log_2(&"Logging arbitrary values looks like".into(), &js);
}
