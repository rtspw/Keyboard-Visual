'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var KeyName = require('./key-name');

function determineColor(domID) {
  return domID.indexOf('sharp') !== -1 ? 'black' : 'white';
}

function determineNames(domID) {
  var trimmedName = domID.slice(0, -1);
  var reformattedName = trimmedName.replace('-sharp', '♯').toUpperCase();
  var keyName = new KeyName(reformattedName);
  return keyName;
}

var PianoKey =
/*#__PURE__*/
function () {
  function PianoKey(domID) {
    _classCallCheck(this, PianoKey);

    this.names = determineNames(domID);
    this.color = determineColor(domID);
    this.octave = domID.slice(-1);
    this.domNode = document.getElementById(domID);
    this.domNameTextNode = this.domNode.querySelector('.keyboard__key-name');
    this.domFingeringTextNode = this.domNode.querySelector('.keyboard__fingering');
    this.registerEventListeners();
  }

  _createClass(PianoKey, [{
    key: "registerEventListeners",
    value: function registerEventListeners() {
      this.domNode.addEventListener('mousedown', this.enableHighlighting.bind(this));
      this.domNode.addEventListener('mouseup', this.disableHighlighting.bind(this));
      this.domNode.addEventListener('touchstart', this.enableHighlighting.bind(this));
      this.domNode.addEventListener('touchend', this.disableHighlighting.bind(this));
    }
  }, {
    key: "enableHighlighting",
    value: function enableHighlighting() {
      var highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
      this.domNode.classList.add(highlightClassName);
      this.setDisplayNameOfType('flat');
    }
  }, {
    key: "disableHighlighting",
    value: function disableHighlighting() {
      var highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
      this.domNode.classList.remove(highlightClassName);
      this.setCustomDisplayName('');
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
    key: "resetDisplayName",
    value: function resetDisplayName() {
      // TODO
      return this;
    }
  }]);

  return PianoKey;
}();

module.exports = PianoKey;