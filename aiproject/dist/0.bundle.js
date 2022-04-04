(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./init.js":
/*!*****************!*\
  !*** ./init.js ***!
  \*****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pkg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pkg */ \"./pkg/aiproject.js\");\n\r\n\r\nlet result = _pkg__WEBPACK_IMPORTED_MODULE_0__[\"add\"](2,2);\r\n\r\nconsole.log(result);\n\n//# sourceURL=webpack:///./init.js?");

/***/ }),

/***/ "./pkg/aiproject.js":
/*!**************************!*\
  !*** ./pkg/aiproject.js ***!
  \**************************/
/*! exports provided: add */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _aiproject_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./aiproject_bg.wasm */ \"./pkg/aiproject_bg.wasm\");\n/* harmony import */ var _aiproject_bg_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./aiproject_bg.js */ \"./pkg/aiproject_bg.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"add\", function() { return _aiproject_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"add\"]; });\n\n\n\n\n//# sourceURL=webpack:///./pkg/aiproject.js?");

/***/ }),

/***/ "./pkg/aiproject_bg.js":
/*!*****************************!*\
  !*** ./pkg/aiproject_bg.js ***!
  \*****************************/
/*! exports provided: add */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"add\", function() { return add; });\n/* harmony import */ var _aiproject_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./aiproject_bg.wasm */ \"./pkg/aiproject_bg.wasm\");\n\n\n/**\n* @param {number} n1\n* @param {number} n2\n* @returns {number}\n*/\nfunction add(n1, n2) {\n    var ret = _aiproject_bg_wasm__WEBPACK_IMPORTED_MODULE_0__[\"add\"](n1, n2);\n    return ret;\n}\n\n\n\n//# sourceURL=webpack:///./pkg/aiproject_bg.js?");

/***/ }),

/***/ "./pkg/aiproject_bg.wasm":
/*!*******************************!*\
  !*** ./pkg/aiproject_bg.wasm ***!
  \*******************************/
/*! exports provided: memory, add */
/***/ (function(module, exports, __webpack_require__) {

eval("\"use strict\";\n// Instantiate WebAssembly module\nvar wasmExports = __webpack_require__.w[module.i];\n__webpack_require__.r(exports);\n// export exports from WebAssembly module\nfor(var name in wasmExports) if(name != \"__webpack_init__\") exports[name] = wasmExports[name];\n// exec imports from WebAssembly module (for esm order)\n\n\n// exec wasm module\nwasmExports[\"__webpack_init__\"]()\n\n//# sourceURL=webpack:///./pkg/aiproject_bg.wasm?");

/***/ })

}]);