(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["@js-sugar/date"] = factory();
	else
		root["@js-sugar/date"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/date/jalaali/jalaali-date-time.ts":
/*!***********************************************!*\
  !*** ./src/date/jalaali/jalaali-date-time.ts ***!
  \***********************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/ts-loader/index.js):\nError: Cannot find module 'typescript'\nRequire stack:\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\ts-loader\\dist\\compilerSetup.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\ts-loader\\dist\\instances.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\ts-loader\\dist\\index.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\ts-loader\\index.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\loader-runner\\lib\\loadLoader.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\loader-runner\\lib\\LoaderRunner.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\webpack\\lib\\NormalModule.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\webpack\\lib\\NormalModuleFactory.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\webpack\\lib\\Compiler.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\webpack\\lib\\webpack.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\webpack\\lib\\index.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\webpack-cli\\lib\\webpack-cli.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\webpack-cli\\lib\\bootstrap.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\webpack-cli\\bin\\cli.js\n- C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\webpack\\bin\\webpack.js\n    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:965:15)\n    at Function.Module._load (internal/modules/cjs/loader.js:841:27)\n    at Module.require (internal/modules/cjs/loader.js:1025:19)\n    at require (C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\v8-compile-cache\\v8-compile-cache.js:159:20)\n    at Object.<anonymous> (C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\ts-loader\\dist\\compilerSetup.js:5:20)\n    at Module._compile (C:\\Users\\bayat\\Desktop\\sugerCalender\\node_modules\\v8-compile-cache\\v8-compile-cache.js:192:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1157:10)\n    at Module.load (internal/modules/cjs/loader.js:985:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:878:14)\n    at Module.require (internal/modules/cjs/loader.js:1025:19)");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/date/jalaali/jalaali-date-time.ts"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AanMtc3VnYXIvZGF0ZS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQGpzLXN1Z2FyL2RhdGUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7O1VDVkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJqYWxhYWxpLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkBqcy1zdWdhci9kYXRlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkBqcy1zdWdhci9kYXRlXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkb2Vzbid0IHRlbGwgYWJvdXQgaXQncyB0b3AtbGV2ZWwgZGVjbGFyYXRpb25zIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvZGF0ZS9qYWxhYWxpL2phbGFhbGktZGF0ZS10aW1lLnRzXCJdKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9