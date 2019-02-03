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

  if (id === undefined) {
    return -1;
  }

  return id;
}

function getAliases(keyID) {
  var aliases = idToAlisesDict[keyID];

  if (aliases === undefined) {
    return {};
  }

  return aliases;
}

var KeyName =
/*#__PURE__*/
function () {
  function KeyName(baseName) {
    _classCallCheck(this, KeyName);

    this.id = determineKeyID(baseName);
    this.alises = getAliases(this.id);
  }

  _createClass(KeyName, [{
    key: "getAliasOfType",
    value: function getAliasOfType(type) {
      if (keyNameSets[type] === undefined) {
        return '';
      }

      var keyNameSet = keyNameSets[type];
      var aliasOfSpecificType = keyNameSet[this.id];

      if (aliasOfSpecificType === undefined) {
        return '';
      }

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
        key.setDisplayNameOfType('specialCSharpM');
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
  }

  _createClass(PianoKey, [{
    key: "toggleHighlighted",
    value: function toggleHighlighted() {
      if (this.color === 'white') {
        this.domNode.classList.toggle('piano-key-highlight--white');
      } else {
        this.domNode.classList.toggle('piano-key-highlight--black');
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvZGlzdC9pbmRleC5qcyIsImFwcC9kaXN0L2tleU5hbWUuanMiLCJhcHAvZGlzdC9rZXlib2FyZC5qcyIsImFwcC9kaXN0L3BpYW5vS2V5LmpzIiwiYXBwL2Rpc3QvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgS2V5Ym9hcmQgPSByZXF1aXJlKCcuL2tleWJvYXJkJyk7XG5cbnZhciB0ZXN0ID0gbmV3IEtleWJvYXJkKCk7XG50ZXN0LnRlc3QoKTsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIGtleU5hbWVTZXRzID0ge1xuICBzaGFycDogWydDJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxuICBmbGF0OiBbJ0MnLCAnROKZrScsICdEJywgJ0Xima0nLCAnRScsICdGJywgJ0fima0nLCAnRycsICdB4pmtJywgJ0EnLCAnQuKZrScsICdCJ10sXG4gIGZpeGVkRG9TaGFycDogWydEbycsICdEaScsICdSZScsICdSaScsICdNaScsICdGYScsICdGaScsICdTbycsICdTaScsICdMYScsICdMaScsICdUaSddLFxuICBmaXhlZERvRmxhdDogWydEbycsICdSYScsICdSZScsICdNZScsICdNaScsICdGYScsICdTZScsICdTbycsICdMZScsICdMYScsICdUZScsICdUaSddLFxuICBzcGVjaWFsRlNoYXJwTTogWydDJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRSMnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXSxcbiAgc3BlY2lhbENTaGFycE06IFsnQiMnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddXG59O1xudmFyIG5hbWVUb0lERW51bSA9IE9iamVjdC5mcmVlemUoe1xuICAnQyc6IDAsXG4gICdD4pmvJzogMSxcbiAgJ0QnOiAyLFxuICAnROKZryc6IDMsXG4gICdFJzogNCxcbiAgJ0YnOiA1LFxuICAnRuKZryc6IDYsXG4gICdHJzogNyxcbiAgJ0fima8nOiA4LFxuICAnQSc6IDksXG4gICdB4pmvJzogMTAsXG4gICdCJzogMTFcbn0pO1xuXG5mdW5jdGlvbiBkZXRlcm1pbmVLZXlJRChiYXNlTmFtZSkge1xuICB2YXIgaWQgPSBuYW1lVG9JREVudW1bYmFzZU5hbWVdO1xuXG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgcmV0dXJuIGlkO1xufVxuXG5mdW5jdGlvbiBnZXRBbGlhc2VzKGtleUlEKSB7XG4gIHZhciBhbGlhc2VzID0gaWRUb0FsaXNlc0RpY3Rba2V5SURdO1xuXG4gIGlmIChhbGlhc2VzID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICByZXR1cm4gYWxpYXNlcztcbn1cblxudmFyIEtleU5hbWUgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBLZXlOYW1lKGJhc2VOYW1lKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEtleU5hbWUpO1xuXG4gICAgdGhpcy5pZCA9IGRldGVybWluZUtleUlEKGJhc2VOYW1lKTtcbiAgICB0aGlzLmFsaXNlcyA9IGdldEFsaWFzZXModGhpcy5pZCk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoS2V5TmFtZSwgW3tcbiAgICBrZXk6IFwiZ2V0QWxpYXNPZlR5cGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QWxpYXNPZlR5cGUodHlwZSkge1xuICAgICAgaWYgKGtleU5hbWVTZXRzW3R5cGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICB2YXIga2V5TmFtZVNldCA9IGtleU5hbWVTZXRzW3R5cGVdO1xuICAgICAgdmFyIGFsaWFzT2ZTcGVjaWZpY1R5cGUgPSBrZXlOYW1lU2V0W3RoaXMuaWRdO1xuXG4gICAgICBpZiAoYWxpYXNPZlNwZWNpZmljVHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFsaWFzT2ZTcGVjaWZpY1R5cGU7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEtleU5hbWU7XG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5TmFtZTsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIFBpYW5vS2V5ID0gcmVxdWlyZSgnLi9waWFub0tleScpO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgICByYW5nZSA9IF9yZXF1aXJlLnJhbmdlO1xuXG52YXIgcGlhbm9LZXlOYW1lcyA9IFsnYycsICdjLXNoYXJwJywgJ2QnLCAnZC1zaGFycCcsICdlJywgJ2YnLCAnZi1zaGFycCcsICdnJywgJ2ctc2hhcnAnLCAnYScsICdhLXNoYXJwJywgJ2InXTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVLZXlOYW1lSURzKCkge1xuICB2YXIga2V5TmFtZXNXaXRoT2N0YXZlcyA9IFtdO1xuICByYW5nZSgxLCAzKS5mb3JFYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgcGlhbm9LZXlOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgbmFtZVdpdGhPY3RhdmUgPSBuYW1lICsgaTtcbiAgICAgIGtleU5hbWVzV2l0aE9jdGF2ZXMucHVzaChuYW1lV2l0aE9jdGF2ZSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4ga2V5TmFtZXNXaXRoT2N0YXZlcztcbn1cblxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlOb2Rlc1VzaW5nSURzKCkge1xuICB2YXIga2V5TmFtZUlEcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG4gIHZhciBwaWFub0tleU5vZGVzID0gW107XG4gIGtleU5hbWVJRHMuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgcGlhbm9LZXkgPSBuZXcgUGlhbm9LZXkoaWQpO1xuICAgIHBpYW5vS2V5Tm9kZXMucHVzaChwaWFub0tleSk7XG4gIH0pO1xuICByZXR1cm4gcGlhbm9LZXlOb2Rlcztcbn1cblxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlOb2RlcygpIHtcbiAgdmFyIGtleU5hbWVJRHMgPSBnZW5lcmF0ZUtleU5hbWVJRHMoKTtcbiAgdmFyIHBpYW5vS2V5Tm9kZXMgPSBnZXRQaWFub0tleU5vZGVzVXNpbmdJRHMoa2V5TmFtZUlEcyk7XG4gIHJldHVybiBwaWFub0tleU5vZGVzO1xufVxuXG52YXIgS2V5Ym9hcmQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBLZXlib2FyZCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgS2V5Ym9hcmQpO1xuXG4gICAgdGhpcy5rZXlOb2RlcyA9IGdldFBpYW5vS2V5Tm9kZXMoKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmtleU5vZGVzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhLZXlib2FyZCwgW3tcbiAgICBrZXk6IFwidGVzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0ZXN0KCkge1xuICAgICAgdGhpcy5rZXlOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAga2V5LnNldERpc3BsYXlOYW1lT2ZUeXBlKCdzcGVjaWFsQ1NoYXJwTScpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEtleWJvYXJkO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgS2V5TmFtZSA9IHJlcXVpcmUoJy4va2V5TmFtZScpO1xuXG5mdW5jdGlvbiBkZXRlcm1pbmVDb2xvcihkb21JRCkge1xuICByZXR1cm4gZG9tSUQuaW5kZXhPZignc2hhcnAnKSAhPT0gLTEgPyAnYmxhY2snIDogJ3doaXRlJztcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpIHtcbiAgdmFyIHRyaW1tZWROYW1lID0gZG9tSUQuc2xpY2UoMCwgLTEpO1xuICB2YXIgcmVmb3JtYXR0ZWROYW1lID0gdHJpbW1lZE5hbWUucmVwbGFjZSgnLXNoYXJwJywgJ+KZrycpLnRvVXBwZXJDYXNlKCk7XG4gIHZhciBrZXlOYW1lID0gbmV3IEtleU5hbWUocmVmb3JtYXR0ZWROYW1lKTtcbiAgcmV0dXJuIGtleU5hbWU7XG59XG5cbnZhciBQaWFub0tleSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFBpYW5vS2V5KGRvbUlEKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBpYW5vS2V5KTtcblxuICAgIHRoaXMubmFtZXMgPSBkZXRlcm1pbmVOYW1lcyhkb21JRCk7XG4gICAgdGhpcy5jb2xvciA9IGRldGVybWluZUNvbG9yKGRvbUlEKTtcbiAgICB0aGlzLm9jdGF2ZSA9IGRvbUlELnNsaWNlKC0xKTtcbiAgICB0aGlzLmRvbU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkb21JRCk7XG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19rZXktbmFtZScpO1xuICAgIHRoaXMuZG9tRmluZ2VyaW5nVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19maW5nZXJpbmcnKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhQaWFub0tleSwgW3tcbiAgICBrZXk6IFwidG9nZ2xlSGlnaGxpZ2h0ZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlSGlnaGxpZ2h0ZWQoKSB7XG4gICAgICBpZiAodGhpcy5jb2xvciA9PT0gJ3doaXRlJykge1xuICAgICAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjaycpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRDdXN0b21EaXNwbGF5TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRDdXN0b21EaXNwbGF5TmFtZShuYW1lKSB7XG4gICAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldERpc3BsYXlOYW1lT2ZUeXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpIHtcbiAgICAgIHZhciBhbGlhcyA9IHRoaXMubmFtZXMuZ2V0QWxpYXNPZlR5cGUodHlwZSk7XG4gICAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IGFsaWFzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRTdGFuZGFyZERpc3BsYXlOYW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFN0YW5kYXJkRGlzcGxheU5hbWUoKSB7XG4gICAgICAvLyBUT0RPXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUGlhbm9LZXk7XG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGlhbm9LZXk7IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhpcyBudW1iZXIgaXMgaW5jbHVkZWRcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7IGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gfVxuXG5mdW5jdGlvbiByYW5nZShzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfdG9Db25zdW1hYmxlQXJyYXkoQXJyYXkoZW5kIC0gc3RhcnQgKyAxKS5maWxsKCkubWFwKGZ1bmN0aW9uIChfLCBpKSB7XG4gICAgcmV0dXJuIGkgKyAxO1xuICB9KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5nZTogcmFuZ2Vcbn07Il19
