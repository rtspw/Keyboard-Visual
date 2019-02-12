(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var Keyboard = require('./keyboard');

var ScaleController = require('./scale-controller');

var ScaleDisplay = require('./scale-display');

ScaleController.init();
ScaleDisplay.init();
var test = new Keyboard();
test.setDisplayNameForAllKeysOfType('standard');
},{"./keyboard":3,"./scale-controller":6,"./scale-display":7}],2:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var keyNameSets = {
  standard: ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'],
  sharp: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
  flat: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'],
  fixedDoSharp: ['Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'So', 'Si', 'La', 'Li', 'Ti'],
  fixedDoFlat: ['Do', 'Ra', 'Re', 'Me', 'Mi', 'Fa', 'Se', 'So', 'Le', 'La', 'Te', 'Ti'],
  specialFSharpM: ['C', 'C♯', 'D', 'D♯', 'E', 'E#', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
  specialCSharpM: ['B#', 'C♯', 'D', 'D♯', 'E', 'E#', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
};
var nameToIDEnum = Object.freeze({
  'C': 0,
  'C♯': 1,
  'D': 2,
  'D♯': 3,
  'E': 4,
  'F': 5,
  'F♯': 6,
  'G': 7,
  'G♯': 8,
  'A': 9,
  'A♯': 10,
  'B': 11
});

function determineKeyID(baseName) {
  var id = nameToIDEnum[baseName];
  if (id === undefined) return -1;
  return id;
}

function getKeyNameSet(type) {
  var keyNameSet = keyNameSets[type];
  if (keyNameSet === undefined) return '';
  return keyNameSet;
}

function getAliasOfSpecificType(keyNameSet, keyID) {
  var aliasOfSpecificType = keyNameSet[keyID];
  if (aliasOfSpecificType === undefined) return '';
  return aliasOfSpecificType;
}

var KeyName =
/*#__PURE__*/
function () {
  function KeyName(baseName) {
    _classCallCheck(this, KeyName);

    this.id = determineKeyID(baseName);
  }

  _createClass(KeyName, [{
    key: "getAliasOfType",
    value: function getAliasOfType(type) {
      var keyNameSet = getKeyNameSet(type);
      var aliasOfSpecificType = getAliasOfSpecificType(keyNameSet, this.id);
      return aliasOfSpecificType;
    }
  }]);

  return KeyName;
}();

module.exports = KeyName;
},{}],3:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PianoKey = require('./piano-key');

var ScaleDisplay = require('./scale-display');

var _require = require('./util'),
    range = _require.range;

var pianoKeyNames = ['c', 'c-sharp', 'd', 'd-sharp', 'e', 'f', 'f-sharp', 'g', 'g-sharp', 'a', 'a-sharp', 'b'];

function generateKeyNameIDs() {
  var keyNamesWithOctaves = [];
  range(1, 3).forEach(function (i) {
    pianoKeyNames.forEach(function (name) {
      var nameWithOctave = name + i;
      keyNamesWithOctaves.push(nameWithOctave);
    });
  });
  return keyNamesWithOctaves;
}

function getPianoKeysUsingIDs() {
  var keyNameIDs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var pianoKeyNodes = [];
  keyNameIDs.forEach(function (id, keyIndex) {
    var pianoKey = new PianoKey(id, keyIndex);
    pianoKeyNodes.push(pianoKey);
  });
  return pianoKeyNodes;
}

function getPianoKeys() {
  var keyNameIDs = generateKeyNameIDs();
  var pianoKeys = getPianoKeysUsingIDs(keyNameIDs);
  return pianoKeys;
}

function registerEventListeners(keyboard) {
  keyboard.domNode.addEventListener('click', function (event) {
    var eventSource = keyboard.keys.find(function (item) {
      return item.getDomNode() === event.target.closest('.keyboard__key');
    });
    if (eventSource === undefined) return;
    var index = eventSource.getKeyIndex();
    keyboard.displayScaleStartingFromIndex('major', index);
  });
}

var Keyboard =
/*#__PURE__*/
function () {
  function Keyboard() {
    _classCallCheck(this, Keyboard);

    this.domNode = document.querySelector('.keyboard');
    this.keys = getPianoKeys();
    console.log(this.keys);
    registerEventListeners(this);
  }

  _createClass(Keyboard, [{
    key: "disableHighlightingForAllKeys",
    value: function disableHighlightingForAllKeys() {
      this.keys.forEach(function (key) {
        key.disableHighlighting();
      });
    }
  }, {
    key: "enableHighlightingForRootKey",
    value: function enableHighlightingForRootKey(index) {
      var rootKey = this.keys[index];
      var isRootKey = true;
      rootKey.enableHighlighting(isRootKey);
    }
  }, {
    key: "displayScaleStartingFromIndex",
    value: function displayScaleStartingFromIndex(scale, index) {
      var _this = this;

      this.disableHighlightingForAllKeys();
      this.enableHighlightingForRootKey(index);
      ScaleDisplay.setText(this.keys[index].getCurrentName());
      var iter = index;
      var pattern = [2, 2, 1, 2, 2, 2];
      pattern.forEach(function (increment) {
        iter += increment;
        var nextKey = _this.keys[iter];
        nextKey.enableHighlighting();
      });
    }
  }, {
    key: "setDisplayNameForAllKeysOfType",
    value: function setDisplayNameForAllKeysOfType(type) {
      this.keys.forEach(function (key) {
        key.setDisplayNameOfType(type);
      });
    }
  }]);

  return Keyboard;
}();

module.exports = Keyboard;
},{"./piano-key":5,"./scale-display":7,"./util":8}],4:[function(require,module,exports){
'use strict';

var NameSanitizer = {
  /* 'btn-scale-major' -> 'scale-major' */
  convertButtonIDToStateName: function convertButtonIDToStateName(buttonID) {
    if (buttonID === undefined) return '';
    var stateName = buttonID.substring(4);
    return stateName;
  },

  /* 'c-sharp1' -> 'c♯' */
  convertPianoKeyDomIDToKeyNameBaseName: function convertPianoKeyDomIDToKeyNameBaseName(pianoKeyDomID) {
    if (pianoKeyDomID === undefined) return '';
    var trimmedName = pianoKeyDomID.slice(0, -1);
    var keyNameBaseName = trimmedName.replace('-sharp', '♯').toUpperCase();
    return keyNameBaseName;
  },

  /* 'c-sharp1' -> '1' */
  convertPianoKeyDomIDToOctaveNumber: function convertPianoKeyDomIDToOctaveNumber(pianoKeyDomID) {
    return pianoKeyDomID.slice(-1);
  },

  /* 'c-sharp1' -> 'black' */
  convertPianoKeyDomIDToColor: function convertPianoKeyDomIDToColor(pianoKeyDomID) {
    return pianoKeyDomID.indexOf('sharp') !== -1 ? 'black' : 'white';
  }
};
module.exports = NameSanitizer;
},{}],5:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var KeyName = require('./key-name');

var NameSanitizer = require('./name-sanitizer');

function determineColor(domID) {
  return NameSanitizer.convertPianoKeyDomIDToColor(domID);
}

function determineNames(domID) {
  var keyNameBaseName = NameSanitizer.convertPianoKeyDomIDToKeyNameBaseName(domID);
  var keyName = new KeyName(keyNameBaseName);
  return keyName;
}

function determineOctave(domID) {
  return NameSanitizer.convertPianoKeyDomIDToOctaveNumber(domID);
}

function registerEventListeners(pianoKey) {
  pianoKey.domNode.addEventListener('mousedown', pianoKey.enableHighlighting.bind(pianoKey, false));
  pianoKey.domNode.addEventListener('mouseup', pianoKey.disableHighlighting.bind(pianoKey));
  pianoKey.domNode.addEventListener('touchstart', pianoKey.enableHighlighting.bind(pianoKey, false));
  pianoKey.domNode.addEventListener('touchend', pianoKey.disableHighlighting.bind(pianoKey));
}

var PianoKey =
/*#__PURE__*/
function () {
  function PianoKey(domID, keyIndex) {
    _classCallCheck(this, PianoKey);

    this.index = keyIndex;
    this.names = determineNames(domID);
    this.color = determineColor(domID);
    this.octave = determineOctave(domID);
    this.domNode = document.getElementById(domID);
    this.domNameTextNode = this.domNode.querySelector('.keyboard__key-name');
    this.domFingeringTextNode = this.domNode.querySelector('.keyboard__fingering');
    registerEventListeners(this);
  }

  _createClass(PianoKey, [{
    key: "enableHighlighting",
    value: function enableHighlighting() {
      var isRootKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var highlightClassName = '';

      if (isRootKey) {
        highlightClassName = this.color === 'white' ? 'piano-key-highlight--white--root' : 'piano-key-highlight--black--root';
      } else {
        highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
      }

      this.domNode.classList.add(highlightClassName);
    }
  }, {
    key: "disableHighlighting",
    value: function disableHighlighting() {
      var _this = this;

      var highlightingClassNames = ['piano-key-highlight--white--root', 'piano-key-highlight--black--root', 'piano-key-highlight--white', 'piano-key-highlight--black'];
      highlightingClassNames.forEach(function (className) {
        _this.domNode.classList.remove(className);
      });
    }
  }, {
    key: "setCustomDisplayName",
    value: function setCustomDisplayName(name) {
      this.domNameTextNode.textContent = name;
    }
  }, {
    key: "setDisplayNameOfType",
    value: function setDisplayNameOfType(type) {
      var alias = this.names.getAliasOfType(type);
      this.domNameTextNode.textContent = alias;
    }
  }, {
    key: "getCurrentName",
    value: function getCurrentName() {
      return this.domNameTextNode.textContent;
    }
  }, {
    key: "getKeyIndex",
    value: function getKeyIndex() {
      return this.index;
    }
  }, {
    key: "getDomNode",
    value: function getDomNode() {
      return this.domNode;
    }
  }, {
    key: "resetDisplayName",
    value: function resetDisplayName() {
      // TODO: Get default type from settings object
      return this;
    }
  }]);

  return PianoKey;
}();

module.exports = PianoKey;
},{"./key-name":2,"./name-sanitizer":4}],6:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NameSanitizer = require('./name-sanitizer');

var ScaleDisplay = require('./scale-display');

var scaleState = 'scale-major';

function getStateNameFromButtonID(buttonElem) {
  var buttonID = buttonElem.id;
  var stateName = NameSanitizer.convertButtonIDToStateName(buttonID);
  return stateName;
}

function addHighlightOnButton(btn) {
  btn.classList.add('btn--selected');
}

function resetHighlightOnAllButtons(scaleController) {
  scaleController.buttons.forEach(function (btn) {
    btn.classList.remove('btn--selected');
  });
}

function registerEventListeners(scaleController) {
  scaleController.buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      scaleState = getStateNameFromButtonID(btn);
      resetHighlightOnAllButtons(scaleController);
      addHighlightOnButton(btn);
      ScaleDisplay.setText(scaleState);
    });
  });
  scaleController.categories.forEach(function (category) {
    var categoryTitle = category.querySelector('.scale-list__category-title');
    var dropdownList = category.querySelector('.scale-list__category-list');
    var dropdownArrow = category.querySelector('.dropdown-arrow');
    categoryTitle.addEventListener('click', function () {
      categoryTitle.classList.toggle('scale-list__category-title--active');
      dropdownList.classList.toggle('scale-list__category-list--hidden');
      dropdownArrow.classList.toggle('dropdown-arrow--active');
    });
  });
}

var scaleController =
/*#__PURE__*/
function () {
  function scaleController() {
    _classCallCheck(this, scaleController);
  }

  _createClass(scaleController, null, [{
    key: "init",
    value: function init() {
      this.buttons = _toConsumableArray(document.getElementsByClassName('btn'));
      this.categories = _toConsumableArray(document.getElementsByClassName('scale-list__category'));
      registerEventListeners(this);
    }
  }, {
    key: "getScaleState",
    value: function getScaleState() {
      return scaleState;
    }
  }]);

  return scaleController;
}();

module.exports = scaleController;
},{"./name-sanitizer":4,"./scale-display":7}],7:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ScaleDisplay =
/*#__PURE__*/
function () {
  function ScaleDisplay() {
    _classCallCheck(this, ScaleDisplay);
  }

  _createClass(ScaleDisplay, null, [{
    key: "init",
    value: function init() {
      this.domElem = document.querySelector('.scale-display__text-panel');
      this.domElem.textContent = '';
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this.domElem.textContent = text;
    }
  }]);

  return ScaleDisplay;
}();

module.exports = ScaleDisplay;
},{}],8:[function(require,module,exports){
'use strict';
/**
 * @param {number} start
 * @param {number} end This number is included
 * @returns {number[]}
 */

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function range(start, end) {
  return _toConsumableArray(Array(end - start + 1).fill().map(function (_, i) {
    return i + 1;
  }));
}

module.exports = {
  range: range
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvZGlzdC9pbmRleC5qcyIsImFwcC9kaXN0L2tleS1uYW1lLmpzIiwiYXBwL2Rpc3Qva2V5Ym9hcmQuanMiLCJhcHAvZGlzdC9uYW1lLXNhbml0aXplci5qcyIsImFwcC9kaXN0L3BpYW5vLWtleS5qcyIsImFwcC9kaXN0L3NjYWxlLWNvbnRyb2xsZXIuanMiLCJhcHAvZGlzdC9zY2FsZS1kaXNwbGF5LmpzIiwiYXBwL2Rpc3QvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBLZXlib2FyZCA9IHJlcXVpcmUoJy4va2V5Ym9hcmQnKTtcblxudmFyIFNjYWxlQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vc2NhbGUtY29udHJvbGxlcicpO1xuXG52YXIgU2NhbGVEaXNwbGF5ID0gcmVxdWlyZSgnLi9zY2FsZS1kaXNwbGF5Jyk7XG5cblNjYWxlQ29udHJvbGxlci5pbml0KCk7XG5TY2FsZURpc3BsYXkuaW5pdCgpO1xudmFyIHRlc3QgPSBuZXcgS2V5Ym9hcmQoKTtcbnRlc3Quc2V0RGlzcGxheU5hbWVGb3JBbGxLZXlzT2ZUeXBlKCdzdGFuZGFyZCcpOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIga2V5TmFtZVNldHMgPSB7XG4gIHN0YW5kYXJkOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Xima0nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQuKZrScsICdCJ10sXG4gIHNoYXJwOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXG4gIGZsYXQ6IFsnQycsICdE4pmtJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnR+KZrScsICdHJywgJ0Hima0nLCAnQScsICdC4pmtJywgJ0InXSxcbiAgZml4ZWREb1NoYXJwOiBbJ0RvJywgJ0RpJywgJ1JlJywgJ1JpJywgJ01pJywgJ0ZhJywgJ0ZpJywgJ1NvJywgJ1NpJywgJ0xhJywgJ0xpJywgJ1RpJ10sXG4gIGZpeGVkRG9GbGF0OiBbJ0RvJywgJ1JhJywgJ1JlJywgJ01lJywgJ01pJywgJ0ZhJywgJ1NlJywgJ1NvJywgJ0xlJywgJ0xhJywgJ1RlJywgJ1RpJ10sXG4gIHNwZWNpYWxGU2hhcnBNOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxuICBzcGVjaWFsQ1NoYXJwTTogWydCIycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ11cbn07XG52YXIgbmFtZVRvSURFbnVtID0gT2JqZWN0LmZyZWV6ZSh7XG4gICdDJzogMCxcbiAgJ0Pima8nOiAxLFxuICAnRCc6IDIsXG4gICdE4pmvJzogMyxcbiAgJ0UnOiA0LFxuICAnRic6IDUsXG4gICdG4pmvJzogNixcbiAgJ0cnOiA3LFxuICAnR+KZryc6IDgsXG4gICdBJzogOSxcbiAgJ0Hima8nOiAxMCxcbiAgJ0InOiAxMVxufSk7XG5cbmZ1bmN0aW9uIGRldGVybWluZUtleUlEKGJhc2VOYW1lKSB7XG4gIHZhciBpZCA9IG5hbWVUb0lERW51bVtiYXNlTmFtZV07XG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gLTE7XG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gZ2V0S2V5TmFtZVNldCh0eXBlKSB7XG4gIHZhciBrZXlOYW1lU2V0ID0ga2V5TmFtZVNldHNbdHlwZV07XG4gIGlmIChrZXlOYW1lU2V0ID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcbiAgcmV0dXJuIGtleU5hbWVTZXQ7XG59XG5cbmZ1bmN0aW9uIGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwga2V5SUQpIHtcbiAgdmFyIGFsaWFzT2ZTcGVjaWZpY1R5cGUgPSBrZXlOYW1lU2V0W2tleUlEXTtcbiAgaWYgKGFsaWFzT2ZTcGVjaWZpY1R5cGUgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xuICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcbn1cblxudmFyIEtleU5hbWUgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBLZXlOYW1lKGJhc2VOYW1lKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEtleU5hbWUpO1xuXG4gICAgdGhpcy5pZCA9IGRldGVybWluZUtleUlEKGJhc2VOYW1lKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhLZXlOYW1lLCBbe1xuICAgIGtleTogXCJnZXRBbGlhc09mVHlwZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRBbGlhc09mVHlwZSh0eXBlKSB7XG4gICAgICB2YXIga2V5TmFtZVNldCA9IGdldEtleU5hbWVTZXQodHlwZSk7XG4gICAgICB2YXIgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwgdGhpcy5pZCk7XG4gICAgICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gS2V5TmFtZTtcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXlOYW1lOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgUGlhbm9LZXkgPSByZXF1aXJlKCcuL3BpYW5vLWtleScpO1xuXG52YXIgU2NhbGVEaXNwbGF5ID0gcmVxdWlyZSgnLi9zY2FsZS1kaXNwbGF5Jyk7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICAgIHJhbmdlID0gX3JlcXVpcmUucmFuZ2U7XG5cbnZhciBwaWFub0tleU5hbWVzID0gWydjJywgJ2Mtc2hhcnAnLCAnZCcsICdkLXNoYXJwJywgJ2UnLCAnZicsICdmLXNoYXJwJywgJ2cnLCAnZy1zaGFycCcsICdhJywgJ2Etc2hhcnAnLCAnYiddO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUtleU5hbWVJRHMoKSB7XG4gIHZhciBrZXlOYW1lc1dpdGhPY3RhdmVzID0gW107XG4gIHJhbmdlKDEsIDMpLmZvckVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICBwaWFub0tleU5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBuYW1lV2l0aE9jdGF2ZSA9IG5hbWUgKyBpO1xuICAgICAga2V5TmFtZXNXaXRoT2N0YXZlcy5wdXNoKG5hbWVXaXRoT2N0YXZlKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBrZXlOYW1lc1dpdGhPY3RhdmVzO1xufVxuXG5mdW5jdGlvbiBnZXRQaWFub0tleXNVc2luZ0lEcygpIHtcbiAgdmFyIGtleU5hbWVJRHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFtdO1xuICB2YXIgcGlhbm9LZXlOb2RlcyA9IFtdO1xuICBrZXlOYW1lSURzLmZvckVhY2goZnVuY3Rpb24gKGlkLCBrZXlJbmRleCkge1xuICAgIHZhciBwaWFub0tleSA9IG5ldyBQaWFub0tleShpZCwga2V5SW5kZXgpO1xuICAgIHBpYW5vS2V5Tm9kZXMucHVzaChwaWFub0tleSk7XG4gIH0pO1xuICByZXR1cm4gcGlhbm9LZXlOb2Rlcztcbn1cblxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlzKCkge1xuICB2YXIga2V5TmFtZUlEcyA9IGdlbmVyYXRlS2V5TmFtZUlEcygpO1xuICB2YXIgcGlhbm9LZXlzID0gZ2V0UGlhbm9LZXlzVXNpbmdJRHMoa2V5TmFtZUlEcyk7XG4gIHJldHVybiBwaWFub0tleXM7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMoa2V5Ym9hcmQpIHtcbiAga2V5Ym9hcmQuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBldmVudFNvdXJjZSA9IGtleWJvYXJkLmtleXMuZmluZChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0uZ2V0RG9tTm9kZSgpID09PSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmtleWJvYXJkX19rZXknKTtcbiAgICB9KTtcbiAgICBpZiAoZXZlbnRTb3VyY2UgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIHZhciBpbmRleCA9IGV2ZW50U291cmNlLmdldEtleUluZGV4KCk7XG4gICAga2V5Ym9hcmQuZGlzcGxheVNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoJ21ham9yJywgaW5kZXgpO1xuICB9KTtcbn1cblxudmFyIEtleWJvYXJkID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gS2V5Ym9hcmQoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEtleWJvYXJkKTtcblxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZCcpO1xuICAgIHRoaXMua2V5cyA9IGdldFBpYW5vS2V5cygpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMua2V5cyk7XG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhLZXlib2FyZCwgW3tcbiAgICBrZXk6IFwiZGlzYWJsZUhpZ2hsaWdodGluZ0ZvckFsbEtleXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzYWJsZUhpZ2hsaWdodGluZ0ZvckFsbEtleXMoKSB7XG4gICAgICB0aGlzLmtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGtleS5kaXNhYmxlSGlnaGxpZ2h0aW5nKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZW5hYmxlSGlnaGxpZ2h0aW5nRm9yUm9vdEtleVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGVIaWdobGlnaHRpbmdGb3JSb290S2V5KGluZGV4KSB7XG4gICAgICB2YXIgcm9vdEtleSA9IHRoaXMua2V5c1tpbmRleF07XG4gICAgICB2YXIgaXNSb290S2V5ID0gdHJ1ZTtcbiAgICAgIHJvb3RLZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKGlzUm9vdEtleSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRpc3BsYXlTY2FsZVN0YXJ0aW5nRnJvbUluZGV4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3BsYXlTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KHNjYWxlLCBpbmRleCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdGhpcy5kaXNhYmxlSGlnaGxpZ2h0aW5nRm9yQWxsS2V5cygpO1xuICAgICAgdGhpcy5lbmFibGVIaWdobGlnaHRpbmdGb3JSb290S2V5KGluZGV4KTtcbiAgICAgIFNjYWxlRGlzcGxheS5zZXRUZXh0KHRoaXMua2V5c1tpbmRleF0uZ2V0Q3VycmVudE5hbWUoKSk7XG4gICAgICB2YXIgaXRlciA9IGluZGV4O1xuICAgICAgdmFyIHBhdHRlcm4gPSBbMiwgMiwgMSwgMiwgMiwgMl07XG4gICAgICBwYXR0ZXJuLmZvckVhY2goZnVuY3Rpb24gKGluY3JlbWVudCkge1xuICAgICAgICBpdGVyICs9IGluY3JlbWVudDtcbiAgICAgICAgdmFyIG5leHRLZXkgPSBfdGhpcy5rZXlzW2l0ZXJdO1xuICAgICAgICBuZXh0S2V5LmVuYWJsZUhpZ2hsaWdodGluZygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldERpc3BsYXlOYW1lRm9yQWxsS2V5c09mVHlwZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXREaXNwbGF5TmFtZUZvckFsbEtleXNPZlR5cGUodHlwZSkge1xuICAgICAgdGhpcy5rZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBrZXkuc2V0RGlzcGxheU5hbWVPZlR5cGUodHlwZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gS2V5Ym9hcmQ7XG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTmFtZVNhbml0aXplciA9IHtcbiAgLyogJ2J0bi1zY2FsZS1tYWpvcicgLT4gJ3NjYWxlLW1ham9yJyAqL1xuICBjb252ZXJ0QnV0dG9uSURUb1N0YXRlTmFtZTogZnVuY3Rpb24gY29udmVydEJ1dHRvbklEVG9TdGF0ZU5hbWUoYnV0dG9uSUQpIHtcbiAgICBpZiAoYnV0dG9uSUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xuICAgIHZhciBzdGF0ZU5hbWUgPSBidXR0b25JRC5zdWJzdHJpbmcoNCk7XG4gICAgcmV0dXJuIHN0YXRlTmFtZTtcbiAgfSxcblxuICAvKiAnYy1zaGFycDEnIC0+ICdj4pmvJyAqL1xuICBjb252ZXJ0UGlhbm9LZXlEb21JRFRvS2V5TmFtZUJhc2VOYW1lOiBmdW5jdGlvbiBjb252ZXJ0UGlhbm9LZXlEb21JRFRvS2V5TmFtZUJhc2VOYW1lKHBpYW5vS2V5RG9tSUQpIHtcbiAgICBpZiAocGlhbm9LZXlEb21JRCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XG4gICAgdmFyIHRyaW1tZWROYW1lID0gcGlhbm9LZXlEb21JRC5zbGljZSgwLCAtMSk7XG4gICAgdmFyIGtleU5hbWVCYXNlTmFtZSA9IHRyaW1tZWROYW1lLnJlcGxhY2UoJy1zaGFycCcsICfima8nKS50b1VwcGVyQ2FzZSgpO1xuICAgIHJldHVybiBrZXlOYW1lQmFzZU5hbWU7XG4gIH0sXG5cbiAgLyogJ2Mtc2hhcnAxJyAtPiAnMScgKi9cbiAgY29udmVydFBpYW5vS2V5RG9tSURUb09jdGF2ZU51bWJlcjogZnVuY3Rpb24gY29udmVydFBpYW5vS2V5RG9tSURUb09jdGF2ZU51bWJlcihwaWFub0tleURvbUlEKSB7XG4gICAgcmV0dXJuIHBpYW5vS2V5RG9tSUQuc2xpY2UoLTEpO1xuICB9LFxuXG4gIC8qICdjLXNoYXJwMScgLT4gJ2JsYWNrJyAqL1xuICBjb252ZXJ0UGlhbm9LZXlEb21JRFRvQ29sb3I6IGZ1bmN0aW9uIGNvbnZlcnRQaWFub0tleURvbUlEVG9Db2xvcihwaWFub0tleURvbUlEKSB7XG4gICAgcmV0dXJuIHBpYW5vS2V5RG9tSUQuaW5kZXhPZignc2hhcnAnKSAhPT0gLTEgPyAnYmxhY2snIDogJ3doaXRlJztcbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gTmFtZVNhbml0aXplcjsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIEtleU5hbWUgPSByZXF1aXJlKCcuL2tleS1uYW1lJyk7XG5cbnZhciBOYW1lU2FuaXRpemVyID0gcmVxdWlyZSgnLi9uYW1lLXNhbml0aXplcicpO1xuXG5mdW5jdGlvbiBkZXRlcm1pbmVDb2xvcihkb21JRCkge1xuICByZXR1cm4gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvQ29sb3IoZG9tSUQpO1xufVxuXG5mdW5jdGlvbiBkZXRlcm1pbmVOYW1lcyhkb21JRCkge1xuICB2YXIga2V5TmFtZUJhc2VOYW1lID0gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvS2V5TmFtZUJhc2VOYW1lKGRvbUlEKTtcbiAgdmFyIGtleU5hbWUgPSBuZXcgS2V5TmFtZShrZXlOYW1lQmFzZU5hbWUpO1xuICByZXR1cm4ga2V5TmFtZTtcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lT2N0YXZlKGRvbUlEKSB7XG4gIHJldHVybiBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9PY3RhdmVOdW1iZXIoZG9tSUQpO1xufVxuXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHBpYW5vS2V5KSB7XG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgcGlhbm9LZXkuZW5hYmxlSGlnaGxpZ2h0aW5nLmJpbmQocGlhbm9LZXksIGZhbHNlKSk7XG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHBpYW5vS2V5LmRpc2FibGVIaWdobGlnaHRpbmcuYmluZChwaWFub0tleSkpO1xuICBwaWFub0tleS5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBwaWFub0tleS5lbmFibGVIaWdobGlnaHRpbmcuYmluZChwaWFub0tleSwgZmFsc2UpKTtcbiAgcGlhbm9LZXkuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHBpYW5vS2V5LmRpc2FibGVIaWdobGlnaHRpbmcuYmluZChwaWFub0tleSkpO1xufVxuXG52YXIgUGlhbm9LZXkgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBQaWFub0tleShkb21JRCwga2V5SW5kZXgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGlhbm9LZXkpO1xuXG4gICAgdGhpcy5pbmRleCA9IGtleUluZGV4O1xuICAgIHRoaXMubmFtZXMgPSBkZXRlcm1pbmVOYW1lcyhkb21JRCk7XG4gICAgdGhpcy5jb2xvciA9IGRldGVybWluZUNvbG9yKGRvbUlEKTtcbiAgICB0aGlzLm9jdGF2ZSA9IGRldGVybWluZU9jdGF2ZShkb21JRCk7XG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSUQpO1xuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fa2V5LW5hbWUnKTtcbiAgICB0aGlzLmRvbUZpbmdlcmluZ1RleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fZmluZ2VyaW5nJyk7XG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhQaWFub0tleSwgW3tcbiAgICBrZXk6IFwiZW5hYmxlSGlnaGxpZ2h0aW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVuYWJsZUhpZ2hsaWdodGluZygpIHtcbiAgICAgIHZhciBpc1Jvb3RLZXkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGZhbHNlO1xuICAgICAgdmFyIGhpZ2hsaWdodENsYXNzTmFtZSA9ICcnO1xuXG4gICAgICBpZiAoaXNSb290S2V5KSB7XG4gICAgICAgIGhpZ2hsaWdodENsYXNzTmFtZSA9IHRoaXMuY29sb3IgPT09ICd3aGl0ZScgPyAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUtLXJvb3QnIDogJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrLS1yb290JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhpZ2hsaWdodENsYXNzTmFtZSA9IHRoaXMuY29sb3IgPT09ICd3aGl0ZScgPyAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUnIDogJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoaGlnaGxpZ2h0Q2xhc3NOYW1lKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzYWJsZUhpZ2hsaWdodGluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlSGlnaGxpZ2h0aW5nKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMgPSBbJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JywgJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrLS1yb290JywgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJywgJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJ107XG4gICAgICBoaWdobGlnaHRpbmdDbGFzc05hbWVzLmZvckVhY2goZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgICBfdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRDdXN0b21EaXNwbGF5TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRDdXN0b21EaXNwbGF5TmFtZShuYW1lKSB7XG4gICAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldERpc3BsYXlOYW1lT2ZUeXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpIHtcbiAgICAgIHZhciBhbGlhcyA9IHRoaXMubmFtZXMuZ2V0QWxpYXNPZlR5cGUodHlwZSk7XG4gICAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IGFsaWFzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRDdXJyZW50TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDdXJyZW50TmFtZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0S2V5SW5kZXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0S2V5SW5kZXgoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RG9tTm9kZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXREb21Ob2RlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZG9tTm9kZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVzZXREaXNwbGF5TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldERpc3BsYXlOYW1lKCkge1xuICAgICAgLy8gVE9ETzogR2V0IGRlZmF1bHQgdHlwZSBmcm9tIHNldHRpbmdzIG9iamVjdFxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFBpYW5vS2V5O1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBpYW5vS2V5OyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlcikgPT09IFwiW29iamVjdCBBcmd1bWVudHNdXCIpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgTmFtZVNhbml0aXplciA9IHJlcXVpcmUoJy4vbmFtZS1zYW5pdGl6ZXInKTtcblxudmFyIFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xuXG52YXIgc2NhbGVTdGF0ZSA9ICdzY2FsZS1tYWpvcic7XG5cbmZ1bmN0aW9uIGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidXR0b25FbGVtKSB7XG4gIHZhciBidXR0b25JRCA9IGJ1dHRvbkVsZW0uaWQ7XG4gIHZhciBzdGF0ZU5hbWUgPSBOYW1lU2FuaXRpemVyLmNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKTtcbiAgcmV0dXJuIHN0YXRlTmFtZTtcbn1cblxuZnVuY3Rpb24gYWRkSGlnaGxpZ2h0T25CdXR0b24oYnRuKSB7XG4gIGJ0bi5jbGFzc0xpc3QuYWRkKCdidG4tLXNlbGVjdGVkJyk7XG59XG5cbmZ1bmN0aW9uIHJlc2V0SGlnaGxpZ2h0T25BbGxCdXR0b25zKHNjYWxlQ29udHJvbGxlcikge1xuICBzY2FsZUNvbnRyb2xsZXIuYnV0dG9ucy5mb3JFYWNoKGZ1bmN0aW9uIChidG4pIHtcbiAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnYnRuLS1zZWxlY3RlZCcpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcbiAgc2NhbGVDb250cm9sbGVyLmJ1dHRvbnMuZm9yRWFjaChmdW5jdGlvbiAoYnRuKSB7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2NhbGVTdGF0ZSA9IGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidG4pO1xuICAgICAgcmVzZXRIaWdobGlnaHRPbkFsbEJ1dHRvbnMoc2NhbGVDb250cm9sbGVyKTtcbiAgICAgIGFkZEhpZ2hsaWdodE9uQnV0dG9uKGJ0bik7XG4gICAgICBTY2FsZURpc3BsYXkuc2V0VGV4dChzY2FsZVN0YXRlKTtcbiAgICB9KTtcbiAgfSk7XG4gIHNjYWxlQ29udHJvbGxlci5jYXRlZ29yaWVzLmZvckVhY2goZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG4gICAgdmFyIGNhdGVnb3J5VGl0bGUgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuc2NhbGUtbGlzdF9fY2F0ZWdvcnktdGl0bGUnKTtcbiAgICB2YXIgZHJvcGRvd25MaXN0ID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLnNjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QnKTtcbiAgICB2YXIgZHJvcGRvd25BcnJvdyA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1hcnJvdycpO1xuICAgIGNhdGVnb3J5VGl0bGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjYXRlZ29yeVRpdGxlLmNsYXNzTGlzdC50b2dnbGUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5LXRpdGxlLS1hY3RpdmUnKTtcbiAgICAgIGRyb3Bkb3duTGlzdC5jbGFzc0xpc3QudG9nZ2xlKCdzY2FsZS1saXN0X19jYXRlZ29yeS1saXN0LS1oaWRkZW4nKTtcbiAgICAgIGRyb3Bkb3duQXJyb3cuY2xhc3NMaXN0LnRvZ2dsZSgnZHJvcGRvd24tYXJyb3ctLWFjdGl2ZScpO1xuICAgIH0pO1xuICB9KTtcbn1cblxudmFyIHNjYWxlQ29udHJvbGxlciA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIHNjYWxlQ29udHJvbGxlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgc2NhbGVDb250cm9sbGVyKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhzY2FsZUNvbnRyb2xsZXIsIG51bGwsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIHRoaXMuYnV0dG9ucyA9IF90b0NvbnN1bWFibGVBcnJheShkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidG4nKSk7XG4gICAgICB0aGlzLmNhdGVnb3JpZXMgPSBfdG9Db25zdW1hYmxlQXJyYXkoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnknKSk7XG4gICAgICByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRTY2FsZVN0YXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFNjYWxlU3RhdGUoKSB7XG4gICAgICByZXR1cm4gc2NhbGVTdGF0ZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gc2NhbGVDb250cm9sbGVyO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNjYWxlQ29udHJvbGxlcjsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIFNjYWxlRGlzcGxheSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNjYWxlRGlzcGxheSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2NhbGVEaXNwbGF5KTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTY2FsZURpc3BsYXksIG51bGwsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIHRoaXMuZG9tRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1kaXNwbGF5X190ZXh0LXBhbmVsJyk7XG4gICAgICB0aGlzLmRvbUVsZW0udGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0VGV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRUZXh0KHRleHQpIHtcbiAgICAgIHRoaXMuZG9tRWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNjYWxlRGlzcGxheTtcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY2FsZURpc3BsYXk7IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhpcyBudW1iZXIgaXMgaW5jbHVkZWRcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7IGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gfVxuXG5mdW5jdGlvbiByYW5nZShzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfdG9Db25zdW1hYmxlQXJyYXkoQXJyYXkoZW5kIC0gc3RhcnQgKyAxKS5maWxsKCkubWFwKGZ1bmN0aW9uIChfLCBpKSB7XG4gICAgcmV0dXJuIGkgKyAxO1xuICB9KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5nZTogcmFuZ2Vcbn07Il19
