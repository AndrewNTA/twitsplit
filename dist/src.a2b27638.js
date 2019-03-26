// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function chunkMessage(msg) {
  var lengthMsg = msg.length;

  if (lengthMsg <= 50) {
    // Does not split this message
    return [msg];
  } else {
    // Handle to split this message
    // Forecast the number of digits of the max section will be split
    var forecastNumber = forecastNumberDigitsOfMaxSplitMsg(lengthMsg);

    if (!forecastNumber) {
      return {
        error: "Message is over the max length"
      };
    } // Store all index of whitespace of this string message


    var spaceIndexArr = [];

    for (var i = 0; i < lengthMsg; i++) {
      if (msg[i] === " ") {
        spaceIndexArr.push(i);
      }
    }

    return handleSplit(msg, spaceIndexArr, lengthMsg, forecastNumber);
  }
}

function handleSplit(msg, spaceIndexArr, lengthMsg, forecastNumber) {
  var result = []; // Handle the first message

  var theFirstIndex = getIndexSplit(spaceIndexArr, 47 - forecastNumber);
  var theFirstMsg = msg.substring(0, theFirstIndex);
  result.push(theFirstMsg);
  var temp = theFirstIndex;
  var count = 1; // Iterator to get all message sections

  while (temp < lengthMsg) {
    count++;
    var numberDigitsOfCount = count.toString().length;
    var tempMsg = ""; // Find the location should be split

    var tempPivot = temp + (49 - numberDigitsOfCount - forecastNumber); // The last message section will be push to result

    if (tempPivot > lengthMsg) {
      tempMsg = msg.substring(temp, lengthMsg);
      result.push(tempMsg);
      break;
    } // Find index of whitespace to split


    var findIndexMsg = getIndexSplit(spaceIndexArr, tempPivot); // Through an error when total characters of indicator and message is greater than 50

    if (temp === findIndexMsg) {
      return {
        error: "Has an error !!!"
      };
    }

    tempMsg = msg.substring(temp, findIndexMsg);
    result.push(tempMsg);
    temp = findIndexMsg;
  }

  var expectedResult = result.map(function (msg, index) {
    // Append the indicator
    if (index === 0) {
      var _indicator = "".concat(index + 1, "/").concat(count, " ");

      return _indicator.concat(msg);
    }

    var indicator = "".concat(index + 1, "/").concat(count);
    return indicator.concat(msg);
  }); // Verify the result of split message

  var correctlyResult = verifyResultCorrectly(expectedResult);

  if (!correctlyResult) {
    // Loops again to make sure the result is correct
    return handleSplit(msg, spaceIndexArr, lengthMsg, forecastNumber + 1);
  }

  return expectedResult;
}

function verifyResultCorrectly(result) {
  for (var i = 0; i < result.length; i++) {
    if (result[i].length > 50) {
      return false;
    }
  }

  return true;
}

function getIndexSplit(arr, pivot) {
  var tempIndex = arr.findIndex(function (e) {
    return e > pivot;
  });

  if (arr[arr.length - 1] <= pivot) {
    return arr[arr.length - 1];
  }

  return arr[tempIndex - 1];
}

function forecastNumberDigitsOfMaxSplitMsg(lengthMsg) {
  if (lengthMsg <= 422) {
    return 1;
  } else if (lengthMsg <= 4463) {
    return 2;
  } else if (lengthMsg <= 42000) {
    return 3;
  } else {
    return 0;
  }
}

var _default = chunkMessage;
exports.default = _default;
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.getElementById("chatForm").addEventListener("submit", saveMessage);
document.getElementById("btnClearMsg").addEventListener("click", clearAllMessage);
window.addEventListener("load", fetchAllMessage);

function clearAllMessage() {
  sessionStorage.setItem("messages", JSON.stringify([]));
  document.getElementById("errorMessage").innerHTML = "";
  fetchAllMessage();
}

function saveMessage(e) {
  var contentMessage = document.getElementById("messageInput").value;
  var chunkedMessages = (0, _utils.default)(contentMessage);

  if (chunkedMessages && chunkedMessages.error) {
    document.getElementById("chatForm").reset();
    document.getElementById("errorMessage").innerHTML = '<div class="alert alert-danger w-100 mt-2">' + chunkedMessages.error + "</div>";
  } else {
    var allMsg = chunkedMessages.map(function (m) {
      return {
        id: uuid(),
        content: m
      };
    });
    var messages = [];

    if (sessionStorage.getItem("messages") != null) {
      messages = JSON.parse(sessionStorage.getItem("messages"));
    }

    allMsg.map(function (msg) {
      return messages.push(msg);
    });
    sessionStorage.setItem("messages", JSON.stringify(messages));
    document.getElementById("chatForm").reset();
    document.getElementById("errorMessage").innerHTML = "";
    fetchAllMessage();
  }

  e.preventDefault();
}

function fetchAllMessage() {
  var messages = JSON.parse(sessionStorage.getItem("messages"));
  var listMessages = document.getElementById("listMessages");
  listMessages.innerHTML = "";

  if (messages && messages.length > 0) {
    for (var i = 0; i < messages.length; i++) {
      var content = messages[i].content;
      listMessages.innerHTML += '<div class="alert alert-info">' + content + "</div>";
    }
  }
}
},{"./utils":"src/utils.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64101" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map