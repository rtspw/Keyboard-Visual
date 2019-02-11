(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var Keyboard = require('./keyboard');

var test = new Keyboard();
test.test();
},{"./keyboard":3}],2:[function(require,module,exports){
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

function getPianoKeyNodesUsingIDs() {
  var keyNameIDs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var pianoKeyNodes = [];
  keyNameIDs.forEach(function (id) {
    var pianoKey = new PianoKey(id);
    pianoKeyNodes.push(pianoKey);
  });
  return pianoKeyNodes;
}

function getPianoKeyNodes() {
  var keyNameIDs = generateKeyNameIDs();
  var pianoKeyNodes = getPianoKeyNodesUsingIDs(keyNameIDs);
  return pianoKeyNodes;
}

var Keyboard =
/*#__PURE__*/
function () {
  function Keyboard() {
    _classCallCheck(this, Keyboard);

    this.keyNodes = getPianoKeyNodes();
    console.log(this.keyNodes);
  }

  _createClass(Keyboard, [{
    key: "test",
    value: function test() {
      this.keyNodes.forEach(function (key) {
        key.setDisplayNameOfType('sharp');
      });
    }
  }]);

  return Keyboard;
}();

module.exports = Keyboard;
},{"./piano-key":4,"./util":5}],4:[function(require,module,exports){
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
},{"./key-name":2}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvZGlzdC9pbmRleC5qcyIsImFwcC9kaXN0L2tleS1uYW1lLmpzIiwiYXBwL2Rpc3Qva2V5Ym9hcmQuanMiLCJhcHAvZGlzdC9waWFuby1rZXkuanMiLCJhcHAvZGlzdC91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBLZXlib2FyZCA9IHJlcXVpcmUoJy4va2V5Ym9hcmQnKTtcblxudmFyIHRlc3QgPSBuZXcgS2V5Ym9hcmQoKTtcbnRlc3QudGVzdCgpOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIga2V5TmFtZVNldHMgPSB7XG4gIHN0YW5kYXJkOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Xima0nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQuKZrScsICdCJ10sXG4gIHNoYXJwOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXG4gIGZsYXQ6IFsnQycsICdE4pmtJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnR+KZrScsICdHJywgJ0Hima0nLCAnQScsICdC4pmtJywgJ0InXSxcbiAgZml4ZWREb1NoYXJwOiBbJ0RvJywgJ0RpJywgJ1JlJywgJ1JpJywgJ01pJywgJ0ZhJywgJ0ZpJywgJ1NvJywgJ1NpJywgJ0xhJywgJ0xpJywgJ1RpJ10sXG4gIGZpeGVkRG9GbGF0OiBbJ0RvJywgJ1JhJywgJ1JlJywgJ01lJywgJ01pJywgJ0ZhJywgJ1NlJywgJ1NvJywgJ0xlJywgJ0xhJywgJ1RlJywgJ1RpJ10sXG4gIHNwZWNpYWxGU2hhcnBNOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxuICBzcGVjaWFsQ1NoYXJwTTogWydCIycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ11cbn07XG52YXIgbmFtZVRvSURFbnVtID0gT2JqZWN0LmZyZWV6ZSh7XG4gICdDJzogMCxcbiAgJ0Pima8nOiAxLFxuICAnRCc6IDIsXG4gICdE4pmvJzogMyxcbiAgJ0UnOiA0LFxuICAnRic6IDUsXG4gICdG4pmvJzogNixcbiAgJ0cnOiA3LFxuICAnR+KZryc6IDgsXG4gICdBJzogOSxcbiAgJ0Hima8nOiAxMCxcbiAgJ0InOiAxMVxufSk7XG5cbmZ1bmN0aW9uIGRldGVybWluZUtleUlEKGJhc2VOYW1lKSB7XG4gIHZhciBpZCA9IG5hbWVUb0lERW51bVtiYXNlTmFtZV07XG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gLTE7XG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gZ2V0S2V5TmFtZVNldCh0eXBlKSB7XG4gIHZhciBrZXlOYW1lU2V0ID0ga2V5TmFtZVNldHNbdHlwZV07XG4gIGlmIChrZXlOYW1lU2V0ID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcbiAgcmV0dXJuIGtleU5hbWVTZXQ7XG59XG5cbmZ1bmN0aW9uIGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwga2V5SUQpIHtcbiAgdmFyIGFsaWFzT2ZTcGVjaWZpY1R5cGUgPSBrZXlOYW1lU2V0W2tleUlEXTtcbiAgaWYgKGFsaWFzT2ZTcGVjaWZpY1R5cGUgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xuICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcbn1cblxudmFyIEtleU5hbWUgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBLZXlOYW1lKGJhc2VOYW1lKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEtleU5hbWUpO1xuXG4gICAgdGhpcy5pZCA9IGRldGVybWluZUtleUlEKGJhc2VOYW1lKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhLZXlOYW1lLCBbe1xuICAgIGtleTogXCJnZXRBbGlhc09mVHlwZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRBbGlhc09mVHlwZSh0eXBlKSB7XG4gICAgICB2YXIga2V5TmFtZVNldCA9IGdldEtleU5hbWVTZXQodHlwZSk7XG4gICAgICB2YXIgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwgdGhpcy5pZCk7XG4gICAgICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gS2V5TmFtZTtcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXlOYW1lOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgUGlhbm9LZXkgPSByZXF1aXJlKCcuL3BpYW5vLWtleScpO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgICByYW5nZSA9IF9yZXF1aXJlLnJhbmdlO1xuXG52YXIgcGlhbm9LZXlOYW1lcyA9IFsnYycsICdjLXNoYXJwJywgJ2QnLCAnZC1zaGFycCcsICdlJywgJ2YnLCAnZi1zaGFycCcsICdnJywgJ2ctc2hhcnAnLCAnYScsICdhLXNoYXJwJywgJ2InXTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVLZXlOYW1lSURzKCkge1xuICB2YXIga2V5TmFtZXNXaXRoT2N0YXZlcyA9IFtdO1xuICByYW5nZSgxLCAzKS5mb3JFYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgcGlhbm9LZXlOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgbmFtZVdpdGhPY3RhdmUgPSBuYW1lICsgaTtcbiAgICAgIGtleU5hbWVzV2l0aE9jdGF2ZXMucHVzaChuYW1lV2l0aE9jdGF2ZSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4ga2V5TmFtZXNXaXRoT2N0YXZlcztcbn1cblxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlOb2Rlc1VzaW5nSURzKCkge1xuICB2YXIga2V5TmFtZUlEcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG4gIHZhciBwaWFub0tleU5vZGVzID0gW107XG4gIGtleU5hbWVJRHMuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgcGlhbm9LZXkgPSBuZXcgUGlhbm9LZXkoaWQpO1xuICAgIHBpYW5vS2V5Tm9kZXMucHVzaChwaWFub0tleSk7XG4gIH0pO1xuICByZXR1cm4gcGlhbm9LZXlOb2Rlcztcbn1cblxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlOb2RlcygpIHtcbiAgdmFyIGtleU5hbWVJRHMgPSBnZW5lcmF0ZUtleU5hbWVJRHMoKTtcbiAgdmFyIHBpYW5vS2V5Tm9kZXMgPSBnZXRQaWFub0tleU5vZGVzVXNpbmdJRHMoa2V5TmFtZUlEcyk7XG4gIHJldHVybiBwaWFub0tleU5vZGVzO1xufVxuXG52YXIgS2V5Ym9hcmQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBLZXlib2FyZCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgS2V5Ym9hcmQpO1xuXG4gICAgdGhpcy5rZXlOb2RlcyA9IGdldFBpYW5vS2V5Tm9kZXMoKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmtleU5vZGVzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhLZXlib2FyZCwgW3tcbiAgICBrZXk6IFwidGVzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0ZXN0KCkge1xuICAgICAgdGhpcy5rZXlOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAga2V5LnNldERpc3BsYXlOYW1lT2ZUeXBlKCdzaGFycCcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEtleWJvYXJkO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgS2V5TmFtZSA9IHJlcXVpcmUoJy4va2V5LW5hbWUnKTtcblxuZnVuY3Rpb24gZGV0ZXJtaW5lQ29sb3IoZG9tSUQpIHtcbiAgcmV0dXJuIGRvbUlELmluZGV4T2YoJ3NoYXJwJykgIT09IC0xID8gJ2JsYWNrJyA6ICd3aGl0ZSc7XG59XG5cbmZ1bmN0aW9uIGRldGVybWluZU5hbWVzKGRvbUlEKSB7XG4gIHZhciB0cmltbWVkTmFtZSA9IGRvbUlELnNsaWNlKDAsIC0xKTtcbiAgdmFyIHJlZm9ybWF0dGVkTmFtZSA9IHRyaW1tZWROYW1lLnJlcGxhY2UoJy1zaGFycCcsICfima8nKS50b1VwcGVyQ2FzZSgpO1xuICB2YXIga2V5TmFtZSA9IG5ldyBLZXlOYW1lKHJlZm9ybWF0dGVkTmFtZSk7XG4gIHJldHVybiBrZXlOYW1lO1xufVxuXG52YXIgUGlhbm9LZXkgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBQaWFub0tleShkb21JRCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQaWFub0tleSk7XG5cbiAgICB0aGlzLm5hbWVzID0gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpO1xuICAgIHRoaXMuY29sb3IgPSBkZXRlcm1pbmVDb2xvcihkb21JRCk7XG4gICAgdGhpcy5vY3RhdmUgPSBkb21JRC5zbGljZSgtMSk7XG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSUQpO1xuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fa2V5LW5hbWUnKTtcbiAgICB0aGlzLmRvbUZpbmdlcmluZ1RleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fZmluZ2VyaW5nJyk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUGlhbm9LZXksIFt7XG4gICAga2V5OiBcInJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycygpIHtcbiAgICAgIHRoaXMuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmVuYWJsZUhpZ2hsaWdodGluZy5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5kaXNhYmxlSGlnaGxpZ2h0aW5nLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmVuYWJsZUhpZ2hsaWdodGluZy5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuZGlzYWJsZUhpZ2hsaWdodGluZy5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZW5hYmxlSGlnaGxpZ2h0aW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVuYWJsZUhpZ2hsaWdodGluZygpIHtcbiAgICAgIHZhciBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjayc7XG4gICAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmFkZChoaWdobGlnaHRDbGFzc05hbWUpO1xuICAgICAgdGhpcy5zZXREaXNwbGF5TmFtZU9mVHlwZSgnZmxhdCcpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaXNhYmxlSGlnaGxpZ2h0aW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2FibGVIaWdobGlnaHRpbmcoKSB7XG4gICAgICB2YXIgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/ICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScgOiAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2snO1xuICAgICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoaGlnaGxpZ2h0Q2xhc3NOYW1lKTtcbiAgICAgIHRoaXMuc2V0Q3VzdG9tRGlzcGxheU5hbWUoJycpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRDdXN0b21EaXNwbGF5TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRDdXN0b21EaXNwbGF5TmFtZShuYW1lKSB7XG4gICAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldERpc3BsYXlOYW1lT2ZUeXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpIHtcbiAgICAgIHZhciBhbGlhcyA9IHRoaXMubmFtZXMuZ2V0QWxpYXNPZlR5cGUodHlwZSk7XG4gICAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IGFsaWFzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXNldERpc3BsYXlOYW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICAvLyBUT0RPXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUGlhbm9LZXk7XG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGlhbm9LZXk7IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhpcyBudW1iZXIgaXMgaW5jbHVkZWRcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7IGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gfVxuXG5mdW5jdGlvbiByYW5nZShzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfdG9Db25zdW1hYmxlQXJyYXkoQXJyYXkoZW5kIC0gc3RhcnQgKyAxKS5maWxsKCkubWFwKGZ1bmN0aW9uIChfLCBpKSB7XG4gICAgcmV0dXJuIGkgKyAxO1xuICB9KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5nZTogcmFuZ2Vcbn07Il19
