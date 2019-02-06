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

var PianoKey = require('./pianoKey');

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
        key.setDisplayNameOfType('');
      });
    }
  }]);

  return Keyboard;
}();

module.exports = Keyboard;
},{"./pianoKey":4,"./util":5}],4:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var KeyName = require('./keyName');

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
    key: "setStandardDisplayName",
    value: function setStandardDisplayName() {
      // TODO
      return this;
    }
  }]);

  return PianoKey;
}();

module.exports = PianoKey;
},{"./keyName":2}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvZGlzdC9pbmRleC5qcyIsImFwcC9kaXN0L2tleU5hbWUuanMiLCJhcHAvZGlzdC9rZXlib2FyZC5qcyIsImFwcC9kaXN0L3BpYW5vS2V5LmpzIiwiYXBwL2Rpc3QvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBLZXlib2FyZCA9IHJlcXVpcmUoJy4va2V5Ym9hcmQnKTtcblxudmFyIHRlc3QgPSBuZXcgS2V5Ym9hcmQoKTtcbnRlc3QudGVzdCgpOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIga2V5TmFtZVNldHMgPSB7XG4gIHN0YW5kYXJkOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Xima0nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQuKZrScsICdCJ10sXG4gIHNoYXJwOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXG4gIGZsYXQ6IFsnQycsICdE4pmtJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnR+KZrScsICdHJywgJ0Hima0nLCAnQScsICdC4pmtJywgJ0InXSxcbiAgZml4ZWREb1NoYXJwOiBbJ0RvJywgJ0RpJywgJ1JlJywgJ1JpJywgJ01pJywgJ0ZhJywgJ0ZpJywgJ1NvJywgJ1NpJywgJ0xhJywgJ0xpJywgJ1RpJ10sXG4gIGZpeGVkRG9GbGF0OiBbJ0RvJywgJ1JhJywgJ1JlJywgJ01lJywgJ01pJywgJ0ZhJywgJ1NlJywgJ1NvJywgJ0xlJywgJ0xhJywgJ1RlJywgJ1RpJ10sXG4gIHNwZWNpYWxGU2hhcnBNOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxuICBzcGVjaWFsQ1NoYXJwTTogWydCIycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ11cbn07XG52YXIgbmFtZVRvSURFbnVtID0gT2JqZWN0LmZyZWV6ZSh7XG4gICdDJzogMCxcbiAgJ0Pima8nOiAxLFxuICAnRCc6IDIsXG4gICdE4pmvJzogMyxcbiAgJ0UnOiA0LFxuICAnRic6IDUsXG4gICdG4pmvJzogNixcbiAgJ0cnOiA3LFxuICAnR+KZryc6IDgsXG4gICdBJzogOSxcbiAgJ0Hima8nOiAxMCxcbiAgJ0InOiAxMVxufSk7XG5cbmZ1bmN0aW9uIGRldGVybWluZUtleUlEKGJhc2VOYW1lKSB7XG4gIHZhciBpZCA9IG5hbWVUb0lERW51bVtiYXNlTmFtZV07XG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gLTE7XG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gZ2V0S2V5TmFtZVNldCh0eXBlKSB7XG4gIHZhciBrZXlOYW1lU2V0ID0ga2V5TmFtZVNldHNbdHlwZV07XG4gIGlmIChrZXlOYW1lU2V0ID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcbiAgcmV0dXJuIGtleU5hbWVTZXQ7XG59XG5cbmZ1bmN0aW9uIGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwga2V5SUQpIHtcbiAgdmFyIGFsaWFzT2ZTcGVjaWZpY1R5cGUgPSBrZXlOYW1lU2V0W2tleUlEXTtcbiAgaWYgKGFsaWFzT2ZTcGVjaWZpY1R5cGUgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xuICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcbn1cblxudmFyIEtleU5hbWUgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBLZXlOYW1lKGJhc2VOYW1lKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEtleU5hbWUpO1xuXG4gICAgdGhpcy5pZCA9IGRldGVybWluZUtleUlEKGJhc2VOYW1lKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhLZXlOYW1lLCBbe1xuICAgIGtleTogXCJnZXRBbGlhc09mVHlwZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRBbGlhc09mVHlwZSh0eXBlKSB7XG4gICAgICB2YXIga2V5TmFtZVNldCA9IGdldEtleU5hbWVTZXQodHlwZSk7XG4gICAgICB2YXIgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwgdGhpcy5pZCk7XG4gICAgICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gS2V5TmFtZTtcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXlOYW1lOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgUGlhbm9LZXkgPSByZXF1aXJlKCcuL3BpYW5vS2V5Jyk7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICAgIHJhbmdlID0gX3JlcXVpcmUucmFuZ2U7XG5cbnZhciBwaWFub0tleU5hbWVzID0gWydjJywgJ2Mtc2hhcnAnLCAnZCcsICdkLXNoYXJwJywgJ2UnLCAnZicsICdmLXNoYXJwJywgJ2cnLCAnZy1zaGFycCcsICdhJywgJ2Etc2hhcnAnLCAnYiddO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUtleU5hbWVJRHMoKSB7XG4gIHZhciBrZXlOYW1lc1dpdGhPY3RhdmVzID0gW107XG4gIHJhbmdlKDEsIDMpLmZvckVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICBwaWFub0tleU5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBuYW1lV2l0aE9jdGF2ZSA9IG5hbWUgKyBpO1xuICAgICAga2V5TmFtZXNXaXRoT2N0YXZlcy5wdXNoKG5hbWVXaXRoT2N0YXZlKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBrZXlOYW1lc1dpdGhPY3RhdmVzO1xufVxuXG5mdW5jdGlvbiBnZXRQaWFub0tleU5vZGVzVXNpbmdJRHMoKSB7XG4gIHZhciBrZXlOYW1lSURzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBbXTtcbiAgdmFyIHBpYW5vS2V5Tm9kZXMgPSBbXTtcbiAga2V5TmFtZUlEcy5mb3JFYWNoKGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBwaWFub0tleSA9IG5ldyBQaWFub0tleShpZCk7XG4gICAgcGlhbm9LZXlOb2Rlcy5wdXNoKHBpYW5vS2V5KTtcbiAgfSk7XG4gIHJldHVybiBwaWFub0tleU5vZGVzO1xufVxuXG5mdW5jdGlvbiBnZXRQaWFub0tleU5vZGVzKCkge1xuICB2YXIga2V5TmFtZUlEcyA9IGdlbmVyYXRlS2V5TmFtZUlEcygpO1xuICB2YXIgcGlhbm9LZXlOb2RlcyA9IGdldFBpYW5vS2V5Tm9kZXNVc2luZ0lEcyhrZXlOYW1lSURzKTtcbiAgcmV0dXJuIHBpYW5vS2V5Tm9kZXM7XG59XG5cbnZhciBLZXlib2FyZCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEtleWJvYXJkKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBLZXlib2FyZCk7XG5cbiAgICB0aGlzLmtleU5vZGVzID0gZ2V0UGlhbm9LZXlOb2RlcygpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMua2V5Tm9kZXMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEtleWJvYXJkLCBbe1xuICAgIGtleTogXCJ0ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgICB0aGlzLmtleU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBrZXkuc2V0RGlzcGxheU5hbWVPZlR5cGUoJycpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEtleWJvYXJkO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgS2V5TmFtZSA9IHJlcXVpcmUoJy4va2V5TmFtZScpO1xuXG5mdW5jdGlvbiBkZXRlcm1pbmVDb2xvcihkb21JRCkge1xuICByZXR1cm4gZG9tSUQuaW5kZXhPZignc2hhcnAnKSAhPT0gLTEgPyAnYmxhY2snIDogJ3doaXRlJztcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpIHtcbiAgdmFyIHRyaW1tZWROYW1lID0gZG9tSUQuc2xpY2UoMCwgLTEpO1xuICB2YXIgcmVmb3JtYXR0ZWROYW1lID0gdHJpbW1lZE5hbWUucmVwbGFjZSgnLXNoYXJwJywgJ+KZrycpLnRvVXBwZXJDYXNlKCk7XG4gIHZhciBrZXlOYW1lID0gbmV3IEtleU5hbWUocmVmb3JtYXR0ZWROYW1lKTtcbiAgcmV0dXJuIGtleU5hbWU7XG59XG5cbnZhciBQaWFub0tleSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFBpYW5vS2V5KGRvbUlEKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBpYW5vS2V5KTtcblxuICAgIHRoaXMubmFtZXMgPSBkZXRlcm1pbmVOYW1lcyhkb21JRCk7XG4gICAgdGhpcy5jb2xvciA9IGRldGVybWluZUNvbG9yKGRvbUlEKTtcbiAgICB0aGlzLm9jdGF2ZSA9IGRvbUlELnNsaWNlKC0xKTtcbiAgICB0aGlzLmRvbU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkb21JRCk7XG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19rZXktbmFtZScpO1xuICAgIHRoaXMuZG9tRmluZ2VyaW5nVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19maW5nZXJpbmcnKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhQaWFub0tleSwgW3tcbiAgICBrZXk6IFwicmVnaXN0ZXJFdmVudExpc3RlbmVyc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgdGhpcy5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuZW5hYmxlSGlnaGxpZ2h0aW5nLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmRpc2FibGVIaWdobGlnaHRpbmcuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImVuYWJsZUhpZ2hsaWdodGluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGVIaWdobGlnaHRpbmcoKSB7XG4gICAgICB2YXIgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/ICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScgOiAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2snO1xuICAgICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoaGlnaGxpZ2h0Q2xhc3NOYW1lKTtcbiAgICAgIHRoaXMuc2V0RGlzcGxheU5hbWVPZlR5cGUoJ2ZsYXQnKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzYWJsZUhpZ2hsaWdodGluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlSGlnaGxpZ2h0aW5nKCkge1xuICAgICAgdmFyIGhpZ2hsaWdodENsYXNzTmFtZSA9IHRoaXMuY29sb3IgPT09ICd3aGl0ZScgPyAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUnIDogJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJztcbiAgICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGhpZ2hsaWdodENsYXNzTmFtZSk7XG4gICAgICB0aGlzLnNldEN1c3RvbURpc3BsYXlOYW1lKCcnKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0Q3VzdG9tRGlzcGxheU5hbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0Q3VzdG9tRGlzcGxheU5hbWUobmFtZSkge1xuICAgICAgdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQgPSBuYW1lO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXREaXNwbGF5TmFtZU9mVHlwZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXREaXNwbGF5TmFtZU9mVHlwZSh0eXBlKSB7XG4gICAgICB2YXIgYWxpYXMgPSB0aGlzLm5hbWVzLmdldEFsaWFzT2ZUeXBlKHR5cGUpO1xuICAgICAgdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQgPSBhbGlhcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0U3RhbmRhcmREaXNwbGF5TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRTdGFuZGFyZERpc3BsYXlOYW1lKCkge1xuICAgICAgLy8gVE9ET1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFBpYW5vS2V5O1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBpYW5vS2V5OyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0XG4gKiBAcGFyYW0ge251bWJlcn0gZW5kIFRoaXMgbnVtYmVyIGlzIGluY2x1ZGVkXG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlcikgPT09IFwiW29iamVjdCBBcmd1bWVudHNdXCIpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IH1cblxuZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX3RvQ29uc3VtYWJsZUFycmF5KEFycmF5KGVuZCAtIHN0YXJ0ICsgMSkuZmlsbCgpLm1hcChmdW5jdGlvbiAoXywgaSkge1xuICAgIHJldHVybiBpICsgMTtcbiAgfSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZ2U6IHJhbmdlXG59OyJdfQ==
