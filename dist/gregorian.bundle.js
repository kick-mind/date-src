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

/***/ "./src/date/gregorian/gregorian-date-time.ts":
/*!***************************************************!*\
  !*** ./src/date/gregorian/gregorian-date-time.ts ***!
  \***************************************************/
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
/******/ 	__webpack_modules__["./src/date/gregorian/gregorian-date-time.ts"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AanMtc3VnYXIvZGF0ZS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQGpzLXN1Z2FyL2RhdGUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7O1VDVkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJncmVnb3JpYW4uYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQGpzLXN1Z2FyL2RhdGVcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiQGpzLXN1Z2FyL2RhdGVcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRvZXNuJ3QgdGVsbCBhYm91dCBpdCdzIHRvcC1sZXZlbCBkZWNsYXJhdGlvbnMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9kYXRlL2dyZWdvcmlhbi9ncmVnb3JpYW4tZGF0ZS10aW1lLnRzXCJdKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9