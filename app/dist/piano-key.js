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