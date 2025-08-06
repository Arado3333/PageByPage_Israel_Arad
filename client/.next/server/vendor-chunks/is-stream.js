"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-stream";
exports.ids = ["vendor-chunks/is-stream"];
exports.modules = {

/***/ "(action-browser)/./node_modules/is-stream/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-stream/index.js ***!
  \*****************************************/
/***/ ((module) => {

eval("\n\nconst isStream = stream =>\n\tstream !== null &&\n\ttypeof stream === 'object' &&\n\ttypeof stream.pipe === 'function';\n\nisStream.writable = stream =>\n\tisStream(stream) &&\n\tstream.writable !== false &&\n\ttypeof stream._write === 'function' &&\n\ttypeof stream._writableState === 'object';\n\nisStream.readable = stream =>\n\tisStream(stream) &&\n\tstream.readable !== false &&\n\ttypeof stream._read === 'function' &&\n\ttypeof stream._readableState === 'object';\n\nisStream.duplex = stream =>\n\tisStream.writable(stream) &&\n\tisStream.readable(stream);\n\nisStream.transform = stream =>\n\tisStream.duplex(stream) &&\n\ttypeof stream._transform === 'function';\n\nmodule.exports = isStream;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9pcy1zdHJlYW0vaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIi9Vc2Vycy9hcmFkZGF2aWQvRG9jdW1lbnRzL0dpdEh1Yi9QYWdlQnlQYWdlX0lzcmFlbF9BcmFkX0NvcHkvY2xpZW50L25vZGVfbW9kdWxlcy9pcy1zdHJlYW0vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBpc1N0cmVhbSA9IHN0cmVhbSA9PlxuXHRzdHJlYW0gIT09IG51bGwgJiZcblx0dHlwZW9mIHN0cmVhbSA9PT0gJ29iamVjdCcgJiZcblx0dHlwZW9mIHN0cmVhbS5waXBlID09PSAnZnVuY3Rpb24nO1xuXG5pc1N0cmVhbS53cml0YWJsZSA9IHN0cmVhbSA9PlxuXHRpc1N0cmVhbShzdHJlYW0pICYmXG5cdHN0cmVhbS53cml0YWJsZSAhPT0gZmFsc2UgJiZcblx0dHlwZW9mIHN0cmVhbS5fd3JpdGUgPT09ICdmdW5jdGlvbicgJiZcblx0dHlwZW9mIHN0cmVhbS5fd3JpdGFibGVTdGF0ZSA9PT0gJ29iamVjdCc7XG5cbmlzU3RyZWFtLnJlYWRhYmxlID0gc3RyZWFtID0+XG5cdGlzU3RyZWFtKHN0cmVhbSkgJiZcblx0c3RyZWFtLnJlYWRhYmxlICE9PSBmYWxzZSAmJlxuXHR0eXBlb2Ygc3RyZWFtLl9yZWFkID09PSAnZnVuY3Rpb24nICYmXG5cdHR5cGVvZiBzdHJlYW0uX3JlYWRhYmxlU3RhdGUgPT09ICdvYmplY3QnO1xuXG5pc1N0cmVhbS5kdXBsZXggPSBzdHJlYW0gPT5cblx0aXNTdHJlYW0ud3JpdGFibGUoc3RyZWFtKSAmJlxuXHRpc1N0cmVhbS5yZWFkYWJsZShzdHJlYW0pO1xuXG5pc1N0cmVhbS50cmFuc2Zvcm0gPSBzdHJlYW0gPT5cblx0aXNTdHJlYW0uZHVwbGV4KHN0cmVhbSkgJiZcblx0dHlwZW9mIHN0cmVhbS5fdHJhbnNmb3JtID09PSAnZnVuY3Rpb24nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyZWFtO1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/is-stream/index.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/is-stream/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-stream/index.js ***!
  \*****************************************/
/***/ ((module) => {

eval("\n\nconst isStream = stream =>\n\tstream !== null &&\n\ttypeof stream === 'object' &&\n\ttypeof stream.pipe === 'function';\n\nisStream.writable = stream =>\n\tisStream(stream) &&\n\tstream.writable !== false &&\n\ttypeof stream._write === 'function' &&\n\ttypeof stream._writableState === 'object';\n\nisStream.readable = stream =>\n\tisStream(stream) &&\n\tstream.readable !== false &&\n\ttypeof stream._read === 'function' &&\n\ttypeof stream._readableState === 'object';\n\nisStream.duplex = stream =>\n\tisStream.writable(stream) &&\n\tisStream.readable(stream);\n\nisStream.transform = stream =>\n\tisStream.duplex(stream) &&\n\ttypeof stream._transform === 'function';\n\nmodule.exports = isStream;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvaXMtc3RyZWFtL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyIvVXNlcnMvYXJhZGRhdmlkL0RvY3VtZW50cy9HaXRIdWIvUGFnZUJ5UGFnZV9Jc3JhZWxfQXJhZF9Db3B5L2NsaWVudC9ub2RlX21vZHVsZXMvaXMtc3RyZWFtL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNTdHJlYW0gPSBzdHJlYW0gPT5cblx0c3RyZWFtICE9PSBudWxsICYmXG5cdHR5cGVvZiBzdHJlYW0gPT09ICdvYmplY3QnICYmXG5cdHR5cGVvZiBzdHJlYW0ucGlwZSA9PT0gJ2Z1bmN0aW9uJztcblxuaXNTdHJlYW0ud3JpdGFibGUgPSBzdHJlYW0gPT5cblx0aXNTdHJlYW0oc3RyZWFtKSAmJlxuXHRzdHJlYW0ud3JpdGFibGUgIT09IGZhbHNlICYmXG5cdHR5cGVvZiBzdHJlYW0uX3dyaXRlID09PSAnZnVuY3Rpb24nICYmXG5cdHR5cGVvZiBzdHJlYW0uX3dyaXRhYmxlU3RhdGUgPT09ICdvYmplY3QnO1xuXG5pc1N0cmVhbS5yZWFkYWJsZSA9IHN0cmVhbSA9PlxuXHRpc1N0cmVhbShzdHJlYW0pICYmXG5cdHN0cmVhbS5yZWFkYWJsZSAhPT0gZmFsc2UgJiZcblx0dHlwZW9mIHN0cmVhbS5fcmVhZCA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHR0eXBlb2Ygc3RyZWFtLl9yZWFkYWJsZVN0YXRlID09PSAnb2JqZWN0JztcblxuaXNTdHJlYW0uZHVwbGV4ID0gc3RyZWFtID0+XG5cdGlzU3RyZWFtLndyaXRhYmxlKHN0cmVhbSkgJiZcblx0aXNTdHJlYW0ucmVhZGFibGUoc3RyZWFtKTtcblxuaXNTdHJlYW0udHJhbnNmb3JtID0gc3RyZWFtID0+XG5cdGlzU3RyZWFtLmR1cGxleChzdHJlYW0pICYmXG5cdHR5cGVvZiBzdHJlYW0uX3RyYW5zZm9ybSA9PT0gJ2Z1bmN0aW9uJztcblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmVhbTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/is-stream/index.js\n");

/***/ })

};
;