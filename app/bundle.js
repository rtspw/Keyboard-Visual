(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var Keyboard = require('./keyboard');

var ScaleController = require('./scale-controller');

var ScaleDisplay = require('./scale-display');

ScaleController.init();
ScaleDisplay.init();
var test = new Keyboard();
test.test();
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
  keyboard.keys.forEach(function (key) {
    key.addNewEventListener('click', function () {
      keyboard.displayScaleFromIndex('major', key.getKeyIndex());
    });
  });
}

var Keyboard =
/*#__PURE__*/
function () {
  function Keyboard() {
    _classCallCheck(this, Keyboard);

    this.keys = getPianoKeys();
    console.log(this.keys);
    registerEventListeners(this);
  }

  _createClass(Keyboard, [{
    key: "test",
    value: function test() {
      this.keys.forEach(function (key) {
        key.setDisplayNameOfType('sharp');
      });
    }
  }, {
    key: "displayScaleFromIndex",
    value: function displayScaleFromIndex(scale, index) {
      var _this = this;

      var rootKey = this.keys[index];
      rootKey.enableHighlighting();
      var iter = index;
      ScaleDisplay.setText(rootKey.getCurrentName());
      var pattern = [2, 2, 1, 2, 2, 2, 1];
      pattern.forEach(function (increment) {
        iter += increment;
        var nextKey = _this.keys[iter];
        nextKey.enableHighlighting();
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
  return domID.indexOf('sharp') !== -1 ? 'black' : 'white';
}

function determineNames(domID) {
  var keyNameBaseName = NameSanitizer.convertPianoKeyDomIDToKeyNameBaseName(domID);
  var keyName = new KeyName(keyNameBaseName);
  return keyName;
}

function determineOctave(domID) {
  return domID.slice(-1);
}

function registerEventListeners(pianoKey) {
  pianoKey.domNode.addEventListener('mousedown', pianoKey.enableHighlighting.bind(pianoKey));
  document.addEventListener('mouseup', pianoKey.disableHighlighting.bind(pianoKey));
  pianoKey.domNode.addEventListener('touchstart', pianoKey.enableHighlighting.bind(pianoKey));
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
      var highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
      this.domNode.classList.add(highlightClassName);
    }
  }, {
    key: "disableHighlighting",
    value: function disableHighlighting() {
      var isRootKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
      this.domNode.classList.remove(highlightClassName);
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
    key: "resetDisplayName",
    value: function resetDisplayName() {
      // TODO
      return this;
    }
  }, {
    key: "addNewEventListener",
    value: function addNewEventListener(event, callback) {
      this.domNode.addEventListener(event, callback);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvZGlzdC9pbmRleC5qcyIsImFwcC9kaXN0L2tleS1uYW1lLmpzIiwiYXBwL2Rpc3Qva2V5Ym9hcmQuanMiLCJhcHAvZGlzdC9uYW1lLXNhbml0aXplci5qcyIsImFwcC9kaXN0L3BpYW5vLWtleS5qcyIsImFwcC9kaXN0L3NjYWxlLWNvbnRyb2xsZXIuanMiLCJhcHAvZGlzdC9zY2FsZS1kaXNwbGF5LmpzIiwiYXBwL2Rpc3QvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxudmFyIEtleWJvYXJkID0gcmVxdWlyZSgnLi9rZXlib2FyZCcpO1xuXG52YXIgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XG5cbnZhciBTY2FsZURpc3BsYXkgPSByZXF1aXJlKCcuL3NjYWxlLWRpc3BsYXknKTtcblxuU2NhbGVDb250cm9sbGVyLmluaXQoKTtcblNjYWxlRGlzcGxheS5pbml0KCk7XG52YXIgdGVzdCA9IG5ldyBLZXlib2FyZCgpO1xudGVzdC50ZXN0KCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBrZXlOYW1lU2V0cyA9IHtcbiAgc3RhbmRhcmQ6IFsnQycsICdD4pmvJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdC4pmtJywgJ0InXSxcbiAgc2hhcnA6IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0YnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXSxcbiAgZmxhdDogWydDJywgJ0Tima0nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdH4pmtJywgJ0cnLCAnQeKZrScsICdBJywgJ0Lima0nLCAnQiddLFxuICBmaXhlZERvU2hhcnA6IFsnRG8nLCAnRGknLCAnUmUnLCAnUmknLCAnTWknLCAnRmEnLCAnRmknLCAnU28nLCAnU2knLCAnTGEnLCAnTGknLCAnVGknXSxcbiAgZml4ZWREb0ZsYXQ6IFsnRG8nLCAnUmEnLCAnUmUnLCAnTWUnLCAnTWknLCAnRmEnLCAnU2UnLCAnU28nLCAnTGUnLCAnTGEnLCAnVGUnLCAnVGknXSxcbiAgc3BlY2lhbEZTaGFycE06IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXG4gIHNwZWNpYWxDU2hhcnBNOiBbJ0IjJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRSMnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXVxufTtcbnZhciBuYW1lVG9JREVudW0gPSBPYmplY3QuZnJlZXplKHtcbiAgJ0MnOiAwLFxuICAnQ+KZryc6IDEsXG4gICdEJzogMixcbiAgJ0Tima8nOiAzLFxuICAnRSc6IDQsXG4gICdGJzogNSxcbiAgJ0bima8nOiA2LFxuICAnRyc6IDcsXG4gICdH4pmvJzogOCxcbiAgJ0EnOiA5LFxuICAnQeKZryc6IDEwLFxuICAnQic6IDExXG59KTtcblxuZnVuY3Rpb24gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpIHtcbiAgdmFyIGlkID0gbmFtZVRvSURFbnVtW2Jhc2VOYW1lXTtcbiAgaWYgKGlkID09PSB1bmRlZmluZWQpIHJldHVybiAtMTtcbiAgcmV0dXJuIGlkO1xufVxuXG5mdW5jdGlvbiBnZXRLZXlOYW1lU2V0KHR5cGUpIHtcbiAgdmFyIGtleU5hbWVTZXQgPSBrZXlOYW1lU2V0c1t0eXBlXTtcbiAgaWYgKGtleU5hbWVTZXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xuICByZXR1cm4ga2V5TmFtZVNldDtcbn1cblxuZnVuY3Rpb24gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCBrZXlJRCkge1xuICB2YXIgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGtleU5hbWVTZXRba2V5SURdO1xuICBpZiAoYWxpYXNPZlNwZWNpZmljVHlwZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XG4gIHJldHVybiBhbGlhc09mU3BlY2lmaWNUeXBlO1xufVxuXG52YXIgS2V5TmFtZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEtleU5hbWUoYmFzZU5hbWUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgS2V5TmFtZSk7XG5cbiAgICB0aGlzLmlkID0gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEtleU5hbWUsIFt7XG4gICAga2V5OiBcImdldEFsaWFzT2ZUeXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFsaWFzT2ZUeXBlKHR5cGUpIHtcbiAgICAgIHZhciBrZXlOYW1lU2V0ID0gZ2V0S2V5TmFtZVNldCh0eXBlKTtcbiAgICAgIHZhciBhbGlhc09mU3BlY2lmaWNUeXBlID0gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCB0aGlzLmlkKTtcbiAgICAgIHJldHVybiBhbGlhc09mU3BlY2lmaWNUeXBlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBLZXlOYW1lO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleU5hbWU7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBQaWFub0tleSA9IHJlcXVpcmUoJy4vcGlhbm8ta2V5Jyk7XG5cbnZhciBTY2FsZURpc3BsYXkgPSByZXF1aXJlKCcuL3NjYWxlLWRpc3BsYXknKTtcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgnLi91dGlsJyksXG4gICAgcmFuZ2UgPSBfcmVxdWlyZS5yYW5nZTtcblxudmFyIHBpYW5vS2V5TmFtZXMgPSBbJ2MnLCAnYy1zaGFycCcsICdkJywgJ2Qtc2hhcnAnLCAnZScsICdmJywgJ2Ytc2hhcnAnLCAnZycsICdnLXNoYXJwJywgJ2EnLCAnYS1zaGFycCcsICdiJ107XG5cbmZ1bmN0aW9uIGdlbmVyYXRlS2V5TmFtZUlEcygpIHtcbiAgdmFyIGtleU5hbWVzV2l0aE9jdGF2ZXMgPSBbXTtcbiAgcmFuZ2UoMSwgMykuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgIHBpYW5vS2V5TmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIG5hbWVXaXRoT2N0YXZlID0gbmFtZSArIGk7XG4gICAgICBrZXlOYW1lc1dpdGhPY3RhdmVzLnB1c2gobmFtZVdpdGhPY3RhdmUpO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGtleU5hbWVzV2l0aE9jdGF2ZXM7XG59XG5cbmZ1bmN0aW9uIGdldFBpYW5vS2V5c1VzaW5nSURzKCkge1xuICB2YXIga2V5TmFtZUlEcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG4gIHZhciBwaWFub0tleU5vZGVzID0gW107XG4gIGtleU5hbWVJRHMuZm9yRWFjaChmdW5jdGlvbiAoaWQsIGtleUluZGV4KSB7XG4gICAgdmFyIHBpYW5vS2V5ID0gbmV3IFBpYW5vS2V5KGlkLCBrZXlJbmRleCk7XG4gICAgcGlhbm9LZXlOb2Rlcy5wdXNoKHBpYW5vS2V5KTtcbiAgfSk7XG4gIHJldHVybiBwaWFub0tleU5vZGVzO1xufVxuXG5mdW5jdGlvbiBnZXRQaWFub0tleXMoKSB7XG4gIHZhciBrZXlOYW1lSURzID0gZ2VuZXJhdGVLZXlOYW1lSURzKCk7XG4gIHZhciBwaWFub0tleXMgPSBnZXRQaWFub0tleXNVc2luZ0lEcyhrZXlOYW1lSURzKTtcbiAgcmV0dXJuIHBpYW5vS2V5cztcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhrZXlib2FyZCkge1xuICBrZXlib2FyZC5rZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGtleS5hZGROZXdFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGtleWJvYXJkLmRpc3BsYXlTY2FsZUZyb21JbmRleCgnbWFqb3InLCBrZXkuZ2V0S2V5SW5kZXgoKSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG52YXIgS2V5Ym9hcmQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBLZXlib2FyZCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgS2V5Ym9hcmQpO1xuXG4gICAgdGhpcy5rZXlzID0gZ2V0UGlhbm9LZXlzKCk7XG4gICAgY29uc29sZS5sb2codGhpcy5rZXlzKTtcbiAgICByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHRoaXMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEtleWJvYXJkLCBbe1xuICAgIGtleTogXCJ0ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgICB0aGlzLmtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGtleS5zZXREaXNwbGF5TmFtZU9mVHlwZSgnc2hhcnAnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaXNwbGF5U2NhbGVGcm9tSW5kZXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcGxheVNjYWxlRnJvbUluZGV4KHNjYWxlLCBpbmRleCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIHJvb3RLZXkgPSB0aGlzLmtleXNbaW5kZXhdO1xuICAgICAgcm9vdEtleS5lbmFibGVIaWdobGlnaHRpbmcoKTtcbiAgICAgIHZhciBpdGVyID0gaW5kZXg7XG4gICAgICBTY2FsZURpc3BsYXkuc2V0VGV4dChyb290S2V5LmdldEN1cnJlbnROYW1lKCkpO1xuICAgICAgdmFyIHBhdHRlcm4gPSBbMiwgMiwgMSwgMiwgMiwgMiwgMV07XG4gICAgICBwYXR0ZXJuLmZvckVhY2goZnVuY3Rpb24gKGluY3JlbWVudCkge1xuICAgICAgICBpdGVyICs9IGluY3JlbWVudDtcbiAgICAgICAgdmFyIG5leHRLZXkgPSBfdGhpcy5rZXlzW2l0ZXJdO1xuICAgICAgICBuZXh0S2V5LmVuYWJsZUhpZ2hsaWdodGluZygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEtleWJvYXJkO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIE5hbWVTYW5pdGl6ZXIgPSB7XG4gIC8qICdidG4tc2NhbGUtbWFqb3InIC0+ICdzY2FsZS1tYWpvcicgKi9cbiAgY29udmVydEJ1dHRvbklEVG9TdGF0ZU5hbWU6IGZ1bmN0aW9uIGNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKSB7XG4gICAgaWYgKGJ1dHRvbklEID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcbiAgICB2YXIgc3RhdGVOYW1lID0gYnV0dG9uSUQuc3Vic3RyaW5nKDQpO1xuICAgIHJldHVybiBzdGF0ZU5hbWU7XG4gIH0sXG5cbiAgLyogJ2Mtc2hhcnAxJyAtPiAnY+KZrycgKi9cbiAgY29udmVydFBpYW5vS2V5RG9tSURUb0tleU5hbWVCYXNlTmFtZTogZnVuY3Rpb24gY29udmVydFBpYW5vS2V5RG9tSURUb0tleU5hbWVCYXNlTmFtZShwaWFub0tleURvbUlEKSB7XG4gICAgaWYgKHBpYW5vS2V5RG9tSUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xuICAgIHZhciB0cmltbWVkTmFtZSA9IHBpYW5vS2V5RG9tSUQuc2xpY2UoMCwgLTEpO1xuICAgIHZhciBrZXlOYW1lQmFzZU5hbWUgPSB0cmltbWVkTmFtZS5yZXBsYWNlKCctc2hhcnAnLCAn4pmvJykudG9VcHBlckNhc2UoKTtcbiAgICByZXR1cm4ga2V5TmFtZUJhc2VOYW1lO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBOYW1lU2FuaXRpemVyOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgS2V5TmFtZSA9IHJlcXVpcmUoJy4va2V5LW5hbWUnKTtcblxudmFyIE5hbWVTYW5pdGl6ZXIgPSByZXF1aXJlKCcuL25hbWUtc2FuaXRpemVyJyk7XG5cbmZ1bmN0aW9uIGRldGVybWluZUNvbG9yKGRvbUlEKSB7XG4gIHJldHVybiBkb21JRC5pbmRleE9mKCdzaGFycCcpICE9PSAtMSA/ICdibGFjaycgOiAnd2hpdGUnO1xufVxuXG5mdW5jdGlvbiBkZXRlcm1pbmVOYW1lcyhkb21JRCkge1xuICB2YXIga2V5TmFtZUJhc2VOYW1lID0gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvS2V5TmFtZUJhc2VOYW1lKGRvbUlEKTtcbiAgdmFyIGtleU5hbWUgPSBuZXcgS2V5TmFtZShrZXlOYW1lQmFzZU5hbWUpO1xuICByZXR1cm4ga2V5TmFtZTtcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lT2N0YXZlKGRvbUlEKSB7XG4gIHJldHVybiBkb21JRC5zbGljZSgtMSk7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMocGlhbm9LZXkpIHtcbiAgcGlhbm9LZXkuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBwaWFub0tleS5lbmFibGVIaWdobGlnaHRpbmcuYmluZChwaWFub0tleSkpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcGlhbm9LZXkuZGlzYWJsZUhpZ2hsaWdodGluZy5iaW5kKHBpYW5vS2V5KSk7XG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHBpYW5vS2V5LmVuYWJsZUhpZ2hsaWdodGluZy5iaW5kKHBpYW5vS2V5KSk7XG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBwaWFub0tleS5kaXNhYmxlSGlnaGxpZ2h0aW5nLmJpbmQocGlhbm9LZXkpKTtcbn1cblxudmFyIFBpYW5vS2V5ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUGlhbm9LZXkoZG9tSUQsIGtleUluZGV4KSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBpYW5vS2V5KTtcblxuICAgIHRoaXMuaW5kZXggPSBrZXlJbmRleDtcbiAgICB0aGlzLm5hbWVzID0gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpO1xuICAgIHRoaXMuY29sb3IgPSBkZXRlcm1pbmVDb2xvcihkb21JRCk7XG4gICAgdGhpcy5vY3RhdmUgPSBkZXRlcm1pbmVPY3RhdmUoZG9tSUQpO1xuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlEKTtcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmRfX2tleS1uYW1lJyk7XG4gICAgdGhpcy5kb21GaW5nZXJpbmdUZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmRfX2ZpbmdlcmluZycpO1xuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUGlhbm9LZXksIFt7XG4gICAga2V5OiBcImVuYWJsZUhpZ2hsaWdodGluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGVIaWdobGlnaHRpbmcoKSB7XG4gICAgICB2YXIgaXNSb290S2V5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmYWxzZTtcbiAgICAgIHZhciBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjayc7XG4gICAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmFkZChoaWdobGlnaHRDbGFzc05hbWUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaXNhYmxlSGlnaGxpZ2h0aW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2FibGVIaWdobGlnaHRpbmcoKSB7XG4gICAgICB2YXIgaXNSb290S2V5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmYWxzZTtcbiAgICAgIHZhciBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjayc7XG4gICAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LnJlbW92ZShoaWdobGlnaHRDbGFzc05hbWUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRDdXN0b21EaXNwbGF5TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRDdXN0b21EaXNwbGF5TmFtZShuYW1lKSB7XG4gICAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldERpc3BsYXlOYW1lT2ZUeXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpIHtcbiAgICAgIHZhciBhbGlhcyA9IHRoaXMubmFtZXMuZ2V0QWxpYXNPZlR5cGUodHlwZSk7XG4gICAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IGFsaWFzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRDdXJyZW50TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDdXJyZW50TmFtZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0S2V5SW5kZXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0S2V5SW5kZXgoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVzZXREaXNwbGF5TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldERpc3BsYXlOYW1lKCkge1xuICAgICAgLy8gVE9ET1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZE5ld0V2ZW50TGlzdGVuZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkTmV3RXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFBpYW5vS2V5O1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBpYW5vS2V5OyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlcikgPT09IFwiW29iamVjdCBBcmd1bWVudHNdXCIpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgTmFtZVNhbml0aXplciA9IHJlcXVpcmUoJy4vbmFtZS1zYW5pdGl6ZXInKTtcblxudmFyIFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xuXG52YXIgc2NhbGVTdGF0ZSA9ICdzY2FsZS1tYWpvcic7XG5cbmZ1bmN0aW9uIGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidXR0b25FbGVtKSB7XG4gIHZhciBidXR0b25JRCA9IGJ1dHRvbkVsZW0uaWQ7XG4gIHZhciBzdGF0ZU5hbWUgPSBOYW1lU2FuaXRpemVyLmNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKTtcbiAgcmV0dXJuIHN0YXRlTmFtZTtcbn1cblxuZnVuY3Rpb24gYWRkSGlnaGxpZ2h0T25CdXR0b24oYnRuKSB7XG4gIGJ0bi5jbGFzc0xpc3QuYWRkKCdidG4tLXNlbGVjdGVkJyk7XG59XG5cbmZ1bmN0aW9uIHJlc2V0SGlnaGxpZ2h0T25BbGxCdXR0b25zKHNjYWxlQ29udHJvbGxlcikge1xuICBzY2FsZUNvbnRyb2xsZXIuYnV0dG9ucy5mb3JFYWNoKGZ1bmN0aW9uIChidG4pIHtcbiAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnYnRuLS1zZWxlY3RlZCcpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcbiAgc2NhbGVDb250cm9sbGVyLmJ1dHRvbnMuZm9yRWFjaChmdW5jdGlvbiAoYnRuKSB7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2NhbGVTdGF0ZSA9IGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidG4pO1xuICAgICAgcmVzZXRIaWdobGlnaHRPbkFsbEJ1dHRvbnMoc2NhbGVDb250cm9sbGVyKTtcbiAgICAgIGFkZEhpZ2hsaWdodE9uQnV0dG9uKGJ0bik7XG4gICAgICBTY2FsZURpc3BsYXkuc2V0VGV4dChzY2FsZVN0YXRlKTtcbiAgICB9KTtcbiAgfSk7XG4gIHNjYWxlQ29udHJvbGxlci5jYXRlZ29yaWVzLmZvckVhY2goZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG4gICAgdmFyIGNhdGVnb3J5VGl0bGUgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuc2NhbGUtbGlzdF9fY2F0ZWdvcnktdGl0bGUnKTtcbiAgICB2YXIgZHJvcGRvd25MaXN0ID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLnNjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QnKTtcbiAgICB2YXIgZHJvcGRvd25BcnJvdyA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1hcnJvdycpO1xuICAgIGNhdGVnb3J5VGl0bGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjYXRlZ29yeVRpdGxlLmNsYXNzTGlzdC50b2dnbGUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5LXRpdGxlLS1hY3RpdmUnKTtcbiAgICAgIGRyb3Bkb3duTGlzdC5jbGFzc0xpc3QudG9nZ2xlKCdzY2FsZS1saXN0X19jYXRlZ29yeS1saXN0LS1oaWRkZW4nKTtcbiAgICAgIGRyb3Bkb3duQXJyb3cuY2xhc3NMaXN0LnRvZ2dsZSgnZHJvcGRvd24tYXJyb3ctLWFjdGl2ZScpO1xuICAgIH0pO1xuICB9KTtcbn1cblxudmFyIHNjYWxlQ29udHJvbGxlciA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIHNjYWxlQ29udHJvbGxlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgc2NhbGVDb250cm9sbGVyKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhzY2FsZUNvbnRyb2xsZXIsIG51bGwsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIHRoaXMuYnV0dG9ucyA9IF90b0NvbnN1bWFibGVBcnJheShkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidG4nKSk7XG4gICAgICB0aGlzLmNhdGVnb3JpZXMgPSBfdG9Db25zdW1hYmxlQXJyYXkoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnknKSk7XG4gICAgICByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRTY2FsZVN0YXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFNjYWxlU3RhdGUoKSB7XG4gICAgICByZXR1cm4gc2NhbGVTdGF0ZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gc2NhbGVDb250cm9sbGVyO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNjYWxlQ29udHJvbGxlcjsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIFNjYWxlRGlzcGxheSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNjYWxlRGlzcGxheSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2NhbGVEaXNwbGF5KTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTY2FsZURpc3BsYXksIG51bGwsIFt7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIHRoaXMuZG9tRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1kaXNwbGF5X190ZXh0LXBhbmVsJyk7XG4gICAgICB0aGlzLmRvbUVsZW0udGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0VGV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRUZXh0KHRleHQpIHtcbiAgICAgIHRoaXMuZG9tRWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNjYWxlRGlzcGxheTtcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY2FsZURpc3BsYXk7IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhpcyBudW1iZXIgaXMgaW5jbHVkZWRcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7IGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gfVxuXG5mdW5jdGlvbiByYW5nZShzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfdG9Db25zdW1hYmxlQXJyYXkoQXJyYXkoZW5kIC0gc3RhcnQgKyAxKS5maWxsKCkubWFwKGZ1bmN0aW9uIChfLCBpKSB7XG4gICAgcmV0dXJuIGkgKyAxO1xuICB9KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5nZTogcmFuZ2Vcbn07Il19
