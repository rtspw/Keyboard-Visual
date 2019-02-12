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