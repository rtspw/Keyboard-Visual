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
        setTimeout(function () {
          key.setDisplayNameOfType('shar');
        }, 3000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvZGlzdC9pbmRleC5qcyIsImFwcC9kaXN0L2tleU5hbWUuanMiLCJhcHAvZGlzdC9rZXlib2FyZC5qcyIsImFwcC9kaXN0L3BpYW5vS2V5LmpzIiwiYXBwL2Rpc3QvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxudmFyIEtleWJvYXJkID0gcmVxdWlyZSgnLi9rZXlib2FyZCcpO1xuXG52YXIgdGVzdCA9IG5ldyBLZXlib2FyZCgpO1xudGVzdC50ZXN0KCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBrZXlOYW1lU2V0cyA9IHtcbiAgc2hhcnA6IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0YnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXSxcbiAgZmxhdDogWydDJywgJ0Tima0nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdH4pmtJywgJ0cnLCAnQeKZrScsICdBJywgJ0Lima0nLCAnQiddLFxuICBmaXhlZERvU2hhcnA6IFsnRG8nLCAnRGknLCAnUmUnLCAnUmknLCAnTWknLCAnRmEnLCAnRmknLCAnU28nLCAnU2knLCAnTGEnLCAnTGknLCAnVGknXSxcbiAgZml4ZWREb0ZsYXQ6IFsnRG8nLCAnUmEnLCAnUmUnLCAnTWUnLCAnTWknLCAnRmEnLCAnU2UnLCAnU28nLCAnTGUnLCAnTGEnLCAnVGUnLCAnVGknXSxcbiAgc3BlY2lhbEZTaGFycE06IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXG4gIHNwZWNpYWxDU2hhcnBNOiBbJ0IjJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRSMnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXVxufTtcbnZhciBuYW1lVG9JREVudW0gPSBPYmplY3QuZnJlZXplKHtcbiAgJ0MnOiAwLFxuICAnQ+KZryc6IDEsXG4gICdEJzogMixcbiAgJ0Tima8nOiAzLFxuICAnRSc6IDQsXG4gICdGJzogNSxcbiAgJ0bima8nOiA2LFxuICAnRyc6IDcsXG4gICdH4pmvJzogOCxcbiAgJ0EnOiA5LFxuICAnQeKZryc6IDEwLFxuICAnQic6IDExXG59KTtcblxuZnVuY3Rpb24gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpIHtcbiAgdmFyIGlkID0gbmFtZVRvSURFbnVtW2Jhc2VOYW1lXTtcblxuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gZ2V0QWxpYXNlcyhrZXlJRCkge1xuICB2YXIgYWxpYXNlcyA9IGlkVG9BbGlzZXNEaWN0W2tleUlEXTtcblxuICBpZiAoYWxpYXNlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmV0dXJuIGFsaWFzZXM7XG59XG5cbnZhciBLZXlOYW1lID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gS2V5TmFtZShiYXNlTmFtZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBLZXlOYW1lKTtcblxuICAgIHRoaXMuaWQgPSBkZXRlcm1pbmVLZXlJRChiYXNlTmFtZSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoS2V5TmFtZSwgW3tcbiAgICBrZXk6IFwiZ2V0QWxpYXNPZlR5cGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QWxpYXNPZlR5cGUodHlwZSkge1xuICAgICAgaWYgKGtleU5hbWVTZXRzW3R5cGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICB2YXIga2V5TmFtZVNldCA9IGtleU5hbWVTZXRzW3R5cGVdO1xuICAgICAgdmFyIGFsaWFzT2ZTcGVjaWZpY1R5cGUgPSBrZXlOYW1lU2V0W3RoaXMuaWRdO1xuXG4gICAgICBpZiAoYWxpYXNPZlNwZWNpZmljVHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFsaWFzT2ZTcGVjaWZpY1R5cGU7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEtleU5hbWU7XG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5TmFtZTsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIFBpYW5vS2V5ID0gcmVxdWlyZSgnLi9waWFub0tleScpO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgICByYW5nZSA9IF9yZXF1aXJlLnJhbmdlO1xuXG52YXIgcGlhbm9LZXlOYW1lcyA9IFsnYycsICdjLXNoYXJwJywgJ2QnLCAnZC1zaGFycCcsICdlJywgJ2YnLCAnZi1zaGFycCcsICdnJywgJ2ctc2hhcnAnLCAnYScsICdhLXNoYXJwJywgJ2InXTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVLZXlOYW1lSURzKCkge1xuICB2YXIga2V5TmFtZXNXaXRoT2N0YXZlcyA9IFtdO1xuICByYW5nZSgxLCAzKS5mb3JFYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgcGlhbm9LZXlOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgbmFtZVdpdGhPY3RhdmUgPSBuYW1lICsgaTtcbiAgICAgIGtleU5hbWVzV2l0aE9jdGF2ZXMucHVzaChuYW1lV2l0aE9jdGF2ZSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4ga2V5TmFtZXNXaXRoT2N0YXZlcztcbn1cblxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlOb2Rlc1VzaW5nSURzKCkge1xuICB2YXIga2V5TmFtZUlEcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG4gIHZhciBwaWFub0tleU5vZGVzID0gW107XG4gIGtleU5hbWVJRHMuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgcGlhbm9LZXkgPSBuZXcgUGlhbm9LZXkoaWQpO1xuICAgIHBpYW5vS2V5Tm9kZXMucHVzaChwaWFub0tleSk7XG4gIH0pO1xuICByZXR1cm4gcGlhbm9LZXlOb2Rlcztcbn1cblxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlOb2RlcygpIHtcbiAgdmFyIGtleU5hbWVJRHMgPSBnZW5lcmF0ZUtleU5hbWVJRHMoKTtcbiAgdmFyIHBpYW5vS2V5Tm9kZXMgPSBnZXRQaWFub0tleU5vZGVzVXNpbmdJRHMoa2V5TmFtZUlEcyk7XG4gIHJldHVybiBwaWFub0tleU5vZGVzO1xufVxuXG52YXIgS2V5Ym9hcmQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBLZXlib2FyZCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgS2V5Ym9hcmQpO1xuXG4gICAgdGhpcy5rZXlOb2RlcyA9IGdldFBpYW5vS2V5Tm9kZXMoKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmtleU5vZGVzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhLZXlib2FyZCwgW3tcbiAgICBrZXk6IFwidGVzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0ZXN0KCkge1xuICAgICAgdGhpcy5rZXlOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAga2V5LnNldERpc3BsYXlOYW1lT2ZUeXBlKCdzcGVjaWFsQ1NoYXJwTScpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBrZXkuc2V0RGlzcGxheU5hbWVPZlR5cGUoJ3NoYXInKTtcbiAgICAgICAgfSwgMzAwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gS2V5Ym9hcmQ7XG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbnZhciBLZXlOYW1lID0gcmVxdWlyZSgnLi9rZXlOYW1lJyk7XG5cbmZ1bmN0aW9uIGRldGVybWluZUNvbG9yKGRvbUlEKSB7XG4gIHJldHVybiBkb21JRC5pbmRleE9mKCdzaGFycCcpICE9PSAtMSA/ICdibGFjaycgOiAnd2hpdGUnO1xufVxuXG5mdW5jdGlvbiBkZXRlcm1pbmVOYW1lcyhkb21JRCkge1xuICB2YXIgdHJpbW1lZE5hbWUgPSBkb21JRC5zbGljZSgwLCAtMSk7XG4gIHZhciByZWZvcm1hdHRlZE5hbWUgPSB0cmltbWVkTmFtZS5yZXBsYWNlKCctc2hhcnAnLCAn4pmvJykudG9VcHBlckNhc2UoKTtcbiAgdmFyIGtleU5hbWUgPSBuZXcgS2V5TmFtZShyZWZvcm1hdHRlZE5hbWUpO1xuICByZXR1cm4ga2V5TmFtZTtcbn1cblxudmFyIFBpYW5vS2V5ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUGlhbm9LZXkoZG9tSUQpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGlhbm9LZXkpO1xuXG4gICAgdGhpcy5uYW1lcyA9IGRldGVybWluZU5hbWVzKGRvbUlEKTtcbiAgICB0aGlzLmNvbG9yID0gZGV0ZXJtaW5lQ29sb3IoZG9tSUQpO1xuICAgIHRoaXMub2N0YXZlID0gZG9tSUQuc2xpY2UoLTEpO1xuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlEKTtcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmRfX2tleS1uYW1lJyk7XG4gICAgdGhpcy5kb21GaW5nZXJpbmdUZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmRfX2ZpbmdlcmluZycpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFBpYW5vS2V5LCBbe1xuICAgIGtleTogXCJ0b2dnbGVIaWdobGlnaHRlZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVIaWdobGlnaHRlZCgpIHtcbiAgICAgIGlmICh0aGlzLmNvbG9yID09PSAnd2hpdGUnKSB7XG4gICAgICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC50b2dnbGUoJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJyk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldEN1c3RvbURpc3BsYXlOYW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldEN1c3RvbURpc3BsYXlOYW1lKG5hbWUpIHtcbiAgICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gbmFtZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0RGlzcGxheU5hbWVPZlR5cGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0RGlzcGxheU5hbWVPZlR5cGUodHlwZSkge1xuICAgICAgdmFyIGFsaWFzID0gdGhpcy5uYW1lcy5nZXRBbGlhc09mVHlwZSh0eXBlKTtcbiAgICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gYWxpYXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldFN0YW5kYXJkRGlzcGxheU5hbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0U3RhbmRhcmREaXNwbGF5TmFtZSgpIHtcbiAgICAgIC8vIFRPRE9cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBQaWFub0tleTtcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQaWFub0tleTsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGlzIG51bWJlciBpcyBpbmNsdWRlZFxuICogQHJldHVybnMge251bWJlcltdfVxuICovXG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcikgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZXIpID09PSBcIltvYmplY3QgQXJndW1lbnRzXVwiKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfSB9XG5cbmZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF90b0NvbnN1bWFibGVBcnJheShBcnJheShlbmQgLSBzdGFydCArIDEpLmZpbGwoKS5tYXAoZnVuY3Rpb24gKF8sIGkpIHtcbiAgICByZXR1cm4gaSArIDE7XG4gIH0pKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmdlOiByYW5nZVxufTsiXX0=
