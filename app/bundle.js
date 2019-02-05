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
        key.setDisplayNameOfType('specialCSharpM');
        setTimeout(function () {
          key.setDisplayNameOfType('shar');
        }, 3000);
        key.setStandardDisplayName();
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
      var highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
      console.log(highlightClassName);
      this.domNode.classList.toggle(highlightClassName);
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
      this.toggleHighlighted();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvZGlzdC9pbmRleC5qcyIsImFwcC9kaXN0L2tleU5hbWUuanMiLCJhcHAvZGlzdC9rZXlib2FyZC5qcyIsImFwcC9kaXN0L3BpYW5vS2V5LmpzIiwiYXBwL2Rpc3QvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxudmFyIEtleWJvYXJkID0gcmVxdWlyZSgnLi9rZXlib2FyZCcpO1xuXG52YXIgdGVzdCA9IG5ldyBLZXlib2FyZCgpO1xudGVzdC50ZXN0KCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBrZXlOYW1lU2V0cyA9IHtcbiAgc2hhcnA6IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0YnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXSxcbiAgZmxhdDogWydDJywgJ0Tima0nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdH4pmtJywgJ0cnLCAnQeKZrScsICdBJywgJ0Lima0nLCAnQiddLFxuICBmaXhlZERvU2hhcnA6IFsnRG8nLCAnRGknLCAnUmUnLCAnUmknLCAnTWknLCAnRmEnLCAnRmknLCAnU28nLCAnU2knLCAnTGEnLCAnTGknLCAnVGknXSxcbiAgZml4ZWREb0ZsYXQ6IFsnRG8nLCAnUmEnLCAnUmUnLCAnTWUnLCAnTWknLCAnRmEnLCAnU2UnLCAnU28nLCAnTGUnLCAnTGEnLCAnVGUnLCAnVGknXSxcbiAgc3BlY2lhbEZTaGFycE06IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXG4gIHNwZWNpYWxDU2hhcnBNOiBbJ0IjJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRSMnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXVxufTtcbnZhciBuYW1lVG9JREVudW0gPSBPYmplY3QuZnJlZXplKHtcbiAgJ0MnOiAwLFxuICAnQ+KZryc6IDEsXG4gICdEJzogMixcbiAgJ0Tima8nOiAzLFxuICAnRSc6IDQsXG4gICdGJzogNSxcbiAgJ0bima8nOiA2LFxuICAnRyc6IDcsXG4gICdH4pmvJzogOCxcbiAgJ0EnOiA5LFxuICAnQeKZryc6IDEwLFxuICAnQic6IDExXG59KTtcblxuZnVuY3Rpb24gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpIHtcbiAgdmFyIGlkID0gbmFtZVRvSURFbnVtW2Jhc2VOYW1lXTtcbiAgaWYgKGlkID09PSB1bmRlZmluZWQpIHJldHVybiAtMTtcbiAgcmV0dXJuIGlkO1xufVxuXG5mdW5jdGlvbiBnZXRLZXlOYW1lU2V0KHR5cGUpIHtcbiAgdmFyIGtleU5hbWVTZXQgPSBrZXlOYW1lU2V0c1t0eXBlXTtcbiAgaWYgKGtleU5hbWVTZXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xuICByZXR1cm4ga2V5TmFtZVNldDtcbn1cblxuZnVuY3Rpb24gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCBrZXlJRCkge1xuICB2YXIgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGtleU5hbWVTZXRba2V5SURdO1xuICBpZiAoYWxpYXNPZlNwZWNpZmljVHlwZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XG4gIHJldHVybiBhbGlhc09mU3BlY2lmaWNUeXBlO1xufVxuXG52YXIgS2V5TmFtZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEtleU5hbWUoYmFzZU5hbWUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgS2V5TmFtZSk7XG5cbiAgICB0aGlzLmlkID0gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEtleU5hbWUsIFt7XG4gICAga2V5OiBcImdldEFsaWFzT2ZUeXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFsaWFzT2ZUeXBlKHR5cGUpIHtcbiAgICAgIHZhciBrZXlOYW1lU2V0ID0gZ2V0S2V5TmFtZVNldCh0eXBlKTtcbiAgICAgIHZhciBhbGlhc09mU3BlY2lmaWNUeXBlID0gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCB0aGlzLmlkKTtcbiAgICAgIHJldHVybiBhbGlhc09mU3BlY2lmaWNUeXBlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBLZXlOYW1lO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleU5hbWU7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBQaWFub0tleSA9IHJlcXVpcmUoJy4vcGlhbm9LZXknKTtcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgnLi91dGlsJyksXG4gICAgcmFuZ2UgPSBfcmVxdWlyZS5yYW5nZTtcblxudmFyIHBpYW5vS2V5TmFtZXMgPSBbJ2MnLCAnYy1zaGFycCcsICdkJywgJ2Qtc2hhcnAnLCAnZScsICdmJywgJ2Ytc2hhcnAnLCAnZycsICdnLXNoYXJwJywgJ2EnLCAnYS1zaGFycCcsICdiJ107XG5cbmZ1bmN0aW9uIGdlbmVyYXRlS2V5TmFtZUlEcygpIHtcbiAgdmFyIGtleU5hbWVzV2l0aE9jdGF2ZXMgPSBbXTtcbiAgcmFuZ2UoMSwgMykuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgIHBpYW5vS2V5TmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIG5hbWVXaXRoT2N0YXZlID0gbmFtZSArIGk7XG4gICAgICBrZXlOYW1lc1dpdGhPY3RhdmVzLnB1c2gobmFtZVdpdGhPY3RhdmUpO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGtleU5hbWVzV2l0aE9jdGF2ZXM7XG59XG5cbmZ1bmN0aW9uIGdldFBpYW5vS2V5Tm9kZXNVc2luZ0lEcygpIHtcbiAgdmFyIGtleU5hbWVJRHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFtdO1xuICB2YXIgcGlhbm9LZXlOb2RlcyA9IFtdO1xuICBrZXlOYW1lSURzLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHBpYW5vS2V5ID0gbmV3IFBpYW5vS2V5KGlkKTtcbiAgICBwaWFub0tleU5vZGVzLnB1c2gocGlhbm9LZXkpO1xuICB9KTtcbiAgcmV0dXJuIHBpYW5vS2V5Tm9kZXM7XG59XG5cbmZ1bmN0aW9uIGdldFBpYW5vS2V5Tm9kZXMoKSB7XG4gIHZhciBrZXlOYW1lSURzID0gZ2VuZXJhdGVLZXlOYW1lSURzKCk7XG4gIHZhciBwaWFub0tleU5vZGVzID0gZ2V0UGlhbm9LZXlOb2Rlc1VzaW5nSURzKGtleU5hbWVJRHMpO1xuICByZXR1cm4gcGlhbm9LZXlOb2Rlcztcbn1cblxudmFyIEtleWJvYXJkID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gS2V5Ym9hcmQoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEtleWJvYXJkKTtcblxuICAgIHRoaXMua2V5Tm9kZXMgPSBnZXRQaWFub0tleU5vZGVzKCk7XG4gICAgY29uc29sZS5sb2codGhpcy5rZXlOb2Rlcyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoS2V5Ym9hcmQsIFt7XG4gICAga2V5OiBcInRlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGVzdCgpIHtcbiAgICAgIHRoaXMua2V5Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGtleS5zZXREaXNwbGF5TmFtZU9mVHlwZSgnc3BlY2lhbENTaGFycE0nKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAga2V5LnNldERpc3BsYXlOYW1lT2ZUeXBlKCdzaGFyJyk7XG4gICAgICAgIH0sIDMwMDApO1xuICAgICAgICBrZXkuc2V0U3RhbmRhcmREaXNwbGF5TmFtZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEtleWJvYXJkO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgS2V5TmFtZSA9IHJlcXVpcmUoJy4va2V5TmFtZScpO1xuXG5mdW5jdGlvbiBkZXRlcm1pbmVDb2xvcihkb21JRCkge1xuICByZXR1cm4gZG9tSUQuaW5kZXhPZignc2hhcnAnKSAhPT0gLTEgPyAnYmxhY2snIDogJ3doaXRlJztcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpIHtcbiAgdmFyIHRyaW1tZWROYW1lID0gZG9tSUQuc2xpY2UoMCwgLTEpO1xuICB2YXIgcmVmb3JtYXR0ZWROYW1lID0gdHJpbW1lZE5hbWUucmVwbGFjZSgnLXNoYXJwJywgJ+KZrycpLnRvVXBwZXJDYXNlKCk7XG4gIHZhciBrZXlOYW1lID0gbmV3IEtleU5hbWUocmVmb3JtYXR0ZWROYW1lKTtcbiAgcmV0dXJuIGtleU5hbWU7XG59XG5cbnZhciBQaWFub0tleSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFBpYW5vS2V5KGRvbUlEKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBpYW5vS2V5KTtcblxuICAgIHRoaXMubmFtZXMgPSBkZXRlcm1pbmVOYW1lcyhkb21JRCk7XG4gICAgdGhpcy5jb2xvciA9IGRldGVybWluZUNvbG9yKGRvbUlEKTtcbiAgICB0aGlzLm9jdGF2ZSA9IGRvbUlELnNsaWNlKC0xKTtcbiAgICB0aGlzLmRvbU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkb21JRCk7XG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19rZXktbmFtZScpO1xuICAgIHRoaXMuZG9tRmluZ2VyaW5nVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19maW5nZXJpbmcnKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhQaWFub0tleSwgW3tcbiAgICBrZXk6IFwidG9nZ2xlSGlnaGxpZ2h0ZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlSGlnaGxpZ2h0ZWQoKSB7XG4gICAgICB2YXIgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/ICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScgOiAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2snO1xuICAgICAgY29uc29sZS5sb2coaGlnaGxpZ2h0Q2xhc3NOYW1lKTtcbiAgICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QudG9nZ2xlKGhpZ2hsaWdodENsYXNzTmFtZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldEN1c3RvbURpc3BsYXlOYW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldEN1c3RvbURpc3BsYXlOYW1lKG5hbWUpIHtcbiAgICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gbmFtZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0RGlzcGxheU5hbWVPZlR5cGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0RGlzcGxheU5hbWVPZlR5cGUodHlwZSkge1xuICAgICAgdmFyIGFsaWFzID0gdGhpcy5uYW1lcy5nZXRBbGlhc09mVHlwZSh0eXBlKTtcbiAgICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gYWxpYXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldFN0YW5kYXJkRGlzcGxheU5hbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0U3RhbmRhcmREaXNwbGF5TmFtZSgpIHtcbiAgICAgIC8vIFRPRE9cbiAgICAgIHRoaXMudG9nZ2xlSGlnaGxpZ2h0ZWQoKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUGlhbm9LZXk7XG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGlhbm9LZXk7IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhpcyBudW1iZXIgaXMgaW5jbHVkZWRcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7IGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gfVxuXG5mdW5jdGlvbiByYW5nZShzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfdG9Db25zdW1hYmxlQXJyYXkoQXJyYXkoZW5kIC0gc3RhcnQgKyAxKS5maWxsKCkubWFwKGZ1bmN0aW9uIChfLCBpKSB7XG4gICAgcmV0dXJuIGkgKyAxO1xuICB9KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5nZTogcmFuZ2Vcbn07Il19
