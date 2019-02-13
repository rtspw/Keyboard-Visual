(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const highlightingClassNames = [
  'piano-key-highlight--white--root',
  'piano-key-highlight--black--root',
  'piano-key-highlight--white',
  'piano-key-highlight--black',
];

module.exports = highlightingClassNames;

},{}],2:[function(require,module,exports){
'use strict';

const keyNameSets = {
  standard: ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'],
  sharp: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
  flat: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'],
  fixedDoSharp: ['Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'So', 'Si', 'La', 'Li', 'Ti'],
  fixedDoFlat: ['Do', 'Ra', 'Re', 'Me', 'Mi', 'Fa', 'Se', 'So', 'Le', 'La', 'Te', 'Ti'],
  specialFSharpM: ['C', 'C♯', 'D', 'D♯', 'E', 'E#', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
  specialCSharpM: ['B#', 'C♯', 'D', 'D♯', 'E', 'E#', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
};

module.exports = keyNameSets;

},{}],3:[function(require,module,exports){
'use strict';

const keyNameToIDEnum = Object.freeze({
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
  'B': 11,
});

module.exports = keyNameToIDEnum;

},{}],4:[function(require,module,exports){
'use strict';

const data = {
  patterns: {
    scales: {
      'major': [2, 2, 1, 2, 2, 2],
      'minor': [2, 1, 2, 2, 1, 2],
      'harmonic minor': [2, 1, 2, 2, 1, 3],
      'melodic minor': [2, 1, 2, 2, 2, 2],

    },
    chords: {
      'major': [4, 3],
      'minor': [3, 4],
      'diminished': [3, 3],
      'augmented': [4, 4],
      'suspended2': [2, 5],
      'suspended4': [5, 2],
    },
  },
};

module.exports = data;

},{}],5:[function(require,module,exports){
'use strict';

const Keyboard = require('./keyboard');
const ScaleController = require('./scale-controller');
const ScaleDisplay = require('./scale-display');

ScaleController.init();
ScaleDisplay.init();

const test = new Keyboard();
test.setDisplayNameForAllKeysOfType('standard');

},{"./keyboard":7,"./scale-controller":10,"./scale-display":12}],6:[function(require,module,exports){
'use strict';

const keyNameSets = require('./data/key-name-sets');
const keyNameToIDEnum = require('./data/key-name-to-id-enum');

function determineKeyID(baseName) {
  const id = keyNameToIDEnum[baseName];
  if (id === undefined) return -1;
  return id;
}

function getKeyNameSet(type) {
  const keyNameSet = keyNameSets[type];
  if (keyNameSet === undefined) return '';
  return keyNameSet;
}

function getAliasOfSpecificType(keyNameSet, keyID) {
  const aliasOfSpecificType = keyNameSet[keyID];
  if (aliasOfSpecificType === undefined) return '';
  return aliasOfSpecificType;
}


class KeyName {
  constructor(baseName) {
    this.id = determineKeyID(baseName);
  }

  getAliasOfType(type) {
    const keyNameSet = getKeyNameSet(type);
    const aliasOfSpecificType = getAliasOfSpecificType(keyNameSet, this.id);
    return aliasOfSpecificType;
  }
}

module.exports = KeyName;

},{"./data/key-name-sets":2,"./data/key-name-to-id-enum":3}],7:[function(require,module,exports){
'use strict';

const PianoKey = require('./piano-key');
const ScaleDisplay = require('./scale-display');
const ScaleController = require('./scale-controller');
const ScaleDatabase = require('./scale-database');
const TimerManager = require('./timer-manager');
const { range } = require('./util');

const pianoKeyNames = ['c', 'c-sharp', 'd', 'd-sharp', 'e',
  'f', 'f-sharp', 'g', 'g-sharp', 'a', 'a-sharp', 'b'];

function generateKeyNameDomIDs() {
  const keyNamesWithOctaves = [];
  const NUM_OF_OCTAVES = 3;
  range(1, NUM_OF_OCTAVES).forEach((octave) => {
    pianoKeyNames.forEach((name) => {
      const nameWithOctave = name + octave;
      keyNamesWithOctaves.push(nameWithOctave);
    });
  });
  return keyNamesWithOctaves;
}

function getPianoKeysUsingDomIDs(keyNameIDs = []) {
  const pianoKeyNodes = [];
  keyNameIDs.forEach((id, keyIndex) => {
    const pianoKey = new PianoKey(id, keyIndex);
    pianoKeyNodes.push(pianoKey);
  });
  return pianoKeyNodes;
}

function getPianoKeys() {
  const keyNameIDs = generateKeyNameDomIDs();
  const pianoKeys = getPianoKeysUsingDomIDs(keyNameIDs);
  return pianoKeys;
}

function registerEventListeners(keyboard) {
  keyboard.domNode.addEventListener('click', (event) => {
    const eventSource = keyboard.keys.find(item => item.getDomNode() === event.target.closest('.keyboard__key'));
    if (eventSource === undefined) return;
    const index = eventSource.getKeyIndex();
    keyboard.displayScaleStartingFromIndex(index);
  });
}


class Keyboard {
  constructor() {
    this.domNode = document.querySelector('.keyboard');
    this.keys = getPianoKeys();
    this.timerManager = new TimerManager();
    registerEventListeners(this);
  }

  disableHighlightingForAllKeys() {
    this.keys.forEach((key) => {
      key.disableHighlighting();
    });
  }

  enableHighlightingForRootKey(indexOfRoot) {
    const rootKey = this.keys[indexOfRoot];
    const isRootKey = true;
    rootKey.enableHighlighting(isRootKey);
  }

  displayScaleStartingFromIndex(index) {
    const scalePattern = ScaleDatabase.getPatternOfSelectedScale();
    if (scalePattern.length === 0) return;
    this.timerManager.clearAllTimers();
    this.disableHighlightingForAllKeys();
    this.enableHighlightingForRootKey(index);
    let iter = index;
    scalePattern.forEach((increment, idx) => {
      iter += increment;
      const nextKey = this.keys[iter];
      if (nextKey === undefined) return;
      this.timerManager.addTimer(nextKey.enableHighlighting.bind(nextKey), idx + 1);
    });
  }

  setDisplayNameForAllKeysOfType(type) {
    this.keys.forEach((key) => {
      key.setDisplayNameOfType(type);
    });
  }
}

module.exports = Keyboard;

},{"./piano-key":9,"./scale-controller":10,"./scale-database":11,"./scale-display":12,"./timer-manager":13,"./util":14}],8:[function(require,module,exports){
'use strict';

const NameSanitizer = {

  /* 'btn-scale-major' -> 'scale-major' */
  convertButtonIDToStateName(buttonID) {
    if (buttonID === undefined) return '';
    const stateName = buttonID.substring(4);
    return stateName;
  },

  /* 'c-sharp1' -> 'c♯' */
  convertPianoKeyDomIDToKeyNameBaseName(pianoKeyDomID) {
    if (pianoKeyDomID === undefined) return '';
    const trimmedName = pianoKeyDomID.slice(0, -1);
    const keyNameBaseName = trimmedName.replace('-sharp', '♯').toUpperCase();
    return keyNameBaseName;
  },

  /* 'c-sharp1' -> '1' */
  convertPianoKeyDomIDToOctaveNumber(pianoKeyDomID) {
    return pianoKeyDomID.slice(-1);
  },

  /* 'c-sharp1' -> 'black' */
  convertPianoKeyDomIDToColor(pianoKeyDomID) {
    return (pianoKeyDomID.indexOf('sharp') !== -1) ? 'black' : 'white';
  },

};

module.exports = NameSanitizer;

},{}],9:[function(require,module,exports){
'use strict';

const KeyName = require('./key-name');
const NameSanitizer = require('./name-sanitizer');

const highlightingClassNames = require('./data/highlighting-class-names');

function determineColor(domID) {
  return NameSanitizer.convertPianoKeyDomIDToColor(domID);
}

function determineNames(domID) {
  const keyNameBaseName = NameSanitizer.convertPianoKeyDomIDToKeyNameBaseName(domID);
  const keyName = new KeyName(keyNameBaseName);
  return keyName;
}

function determineOctave(domID) {
  return NameSanitizer.convertPianoKeyDomIDToOctaveNumber(domID);
}

function addMouseListener(pianoKey) {
  pianoKey.domNode.addEventListener('mousedown', () => {
    if (pianoKey.isHighlighted()) return;
    pianoKey.enableHighlighting(true);
    function onMouseUp() {
      pianoKey.disableHighlighting();
      setTimeout(document.removeEventListener('mouseup', onMouseUp), 0);
    }
    document.addEventListener('mouseup', onMouseUp);
  });
}

function addTouchListener(pianoKey) {
  pianoKey.domNode.addEventListener('touchstart', () => {
    if (pianoKey.isHighlighted()) return;
    pianoKey.enableHighlighting(true);
    function onTouchEnd() {
      pianoKey.disableHighlighting();
      setTimeout(document.removeEventListener('touchend', onTouchEnd), 0);
    }
    document.addEventListener('touchend', onTouchEnd);
  });
}

function registerEventListeners(pianoKey) {
  addMouseListener(pianoKey);
  addTouchListener(pianoKey);
}


class PianoKey {
  constructor(domID, keyIndex) {
    this.index = keyIndex;
    this.names = determineNames(domID);
    this.color = determineColor(domID);
    this.octave = determineOctave(domID);
    this.domNode = document.getElementById(domID);
    this.domNameTextNode = this.domNode.querySelector('.keyboard__key-name');
    this.domFingeringTextNode = this.domNode.querySelector('.keyboard__fingering');
    registerEventListeners(this);
  }

  isHighlighted() {
    let isHighlighted = false;
    highlightingClassNames.forEach((className) => {
      if (this.domNode.classList.contains(className)) {
        isHighlighted = true;
      }
    });
    return isHighlighted;
  }

  enableHighlighting(isRootKey = false) {
    let highlightClassName = '';
    if (isRootKey) {
      highlightClassName = this.color === 'white' ? 'piano-key-highlight--white--root' : 'piano-key-highlight--black--root';
    } else {
      highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
    }
    this.domNode.classList.add(highlightClassName);
  }

  disableHighlighting() {
    highlightingClassNames.forEach((className) => {
      this.domNode.classList.remove(className);
    });
  }

  setCustomDisplayName(name) {
    this.domNameTextNode.textContent = name;
  }

  setDisplayNameOfType(type) {
    const alias = this.names.getAliasOfType(type);
    this.domNameTextNode.textContent = alias;
  }

  getCurrentName() {
    return this.domNameTextNode.textContent;
  }

  getKeyIndex() {
    return this.index;
  }

  getDomNode() {
    return this.domNode;
  }

  resetDisplayName() {
    // TODO: Get default type from settings object
    return this;
  }
}

module.exports = PianoKey;

},{"./data/highlighting-class-names":1,"./key-name":6,"./name-sanitizer":8}],10:[function(require,module,exports){
'use strict';

const NameSanitizer = require('./name-sanitizer');
const ScaleDisplay = require('./scale-display');

let scaleState = '';

function getStateNameFromButtonID(buttonElem) {
  const buttonID = buttonElem.id;
  const stateName = NameSanitizer.convertButtonIDToStateName(buttonID);
  return stateName;
}

function addHighlightOnButton(btn) {
  btn.classList.add('btn--selected');
}

function resetHighlightOnAllButtons(scaleController) {
  scaleController.buttons.forEach((btn) => {
    btn.classList.remove('btn--selected');
  });
}

function registerEventListeners(scaleController) {
  scaleController.buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      scaleState = getStateNameFromButtonID(btn);
      resetHighlightOnAllButtons(scaleController);
      addHighlightOnButton(btn);
      ScaleDisplay.setText(scaleState);
    });
  });

  scaleController.categories.forEach((category) => {
    const categoryTitle = category.querySelector('.scale-list__category-title');
    const dropdownList = category.querySelector('.scale-list__category-list');
    const dropdownArrow = category.querySelector('.dropdown-arrow');
    categoryTitle.addEventListener('click', () => {
      categoryTitle.classList.toggle('scale-list__category-title--active');
      dropdownList.classList.toggle('scale-list__category-list--hidden');
      dropdownArrow.classList.toggle('dropdown-arrow--active');
    });
  });
}


class scaleController {
  static init() {
    this.buttons = [...document.getElementsByClassName('btn')];
    this.categories = [...document.getElementsByClassName('scale-list__category')];
    registerEventListeners(this);
  }

  static getScaleState() {
    return scaleState;
  }
}


module.exports = scaleController;

},{"./name-sanitizer":8,"./scale-display":12}],11:[function(require,module,exports){
'use strict';

const ScaleController = require('./scale-controller');

const scaleData = require('./data/scale-data');

function getInfoOfScaleState(scaleState = '') {
  const [chordOrScale, ...scaleTypeTokens] = scaleState.split('-');
  const scaleType = scaleTypeTokens.join(' ');
  return [chordOrScale, scaleType];
}

function getScalePattern(scaleType) {
  const pattern = scaleData.patterns.scales[scaleType];
  if (pattern === undefined) return [];
  return pattern;
}

function getChordPattern(scaleType) {
  const pattern = scaleData.patterns.chords[scaleType];
  if (pattern === undefined) return [];
  return pattern;
}

function getPattern(scaleInfo) {
  const [chordOrScale, scaleType] = scaleInfo;
  let pattern = [];
  if (chordOrScale === 'scale') {
    pattern = getScalePattern(scaleType);
  } else if (chordOrScale === 'chord') {
    pattern = getChordPattern(scaleType);
  }
  return pattern;
}


class scaleDatabase {
  static getPatternOf(scaleState = '') {
    const scaleInfo = getInfoOfScaleState(scaleState);
    const pattern = getPattern(scaleInfo);
    return pattern;
  }

  static getPatternOfSelectedScale() {
    const scaleState = ScaleController.getScaleState();
    const scalePattern = this.getPatternOf(scaleState);
    return scalePattern;
  }
}

module.exports = scaleDatabase;

},{"./data/scale-data":4,"./scale-controller":10}],12:[function(require,module,exports){
'use strict';

class ScaleDisplay {
  static init() {
    this.domElem = document.querySelector('.scale-display__text-panel');
    this.domElem.textContent = '';
  }

  static setText(text) {
    this.domElem.textContent = text;
  }
}

module.exports = ScaleDisplay;

},{}],13:[function(require,module,exports){
'use strict';

class TimerManager {
  constructor() {
    this.timers = [];
  }

  // TODO: Take offset time from settings
  addTimer(callback, offsetIndex) {
    const timer = setTimeout(callback, 200 * offsetIndex);
    this.timers.push(timer);
  }

  clearAllTimers() {
    this.timers.forEach((timer) => {
      clearTimeout(timer);
    });
    this.timers = [];
  }
}

module.exports = TimerManager;

},{}],14:[function(require,module,exports){
'use strict';

/**
 * @param {number} start
 * @param {number} end This number is included
 * @returns {number[]}
 */
function range(start, end) {
  return [...Array(end - start + 1).fill().map((_, i) => i + 1)];
}

module.exports = { range };

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzLmpzIiwiYXBwL3NyYy9kYXRhL2tleS1uYW1lLXNldHMuanMiLCJhcHAvc3JjL2RhdGEva2V5LW5hbWUtdG8taWQtZW51bS5qcyIsImFwcC9zcmMvZGF0YS9zY2FsZS1kYXRhLmpzIiwiYXBwL3NyYy9pbmRleC5qcyIsImFwcC9zcmMva2V5LW5hbWUuanMiLCJhcHAvc3JjL2tleWJvYXJkLmpzIiwiYXBwL3NyYy9uYW1lLXNhbml0aXplci5qcyIsImFwcC9zcmMvcGlhbm8ta2V5LmpzIiwiYXBwL3NyYy9zY2FsZS1jb250cm9sbGVyLmpzIiwiYXBwL3NyYy9zY2FsZS1kYXRhYmFzZS5qcyIsImFwcC9zcmMvc2NhbGUtZGlzcGxheS5qcyIsImFwcC9zcmMvdGltZXItbWFuYWdlci5qcyIsImFwcC9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMgPSBbXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JyxcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2stLXJvb3QnLFxyXG4gICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScsXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJyxcclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qga2V5TmFtZVNldHMgPSB7XHJcbiAgc3RhbmRhcmQ6IFsnQycsICdD4pmvJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdC4pmtJywgJ0InXSxcclxuICBzaGFycDogWydDJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG4gIGZsYXQ6IFsnQycsICdE4pmtJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnR+KZrScsICdHJywgJ0Hima0nLCAnQScsICdC4pmtJywgJ0InXSxcclxuICBmaXhlZERvU2hhcnA6IFsnRG8nLCAnRGknLCAnUmUnLCAnUmknLCAnTWknLCAnRmEnLCAnRmknLCAnU28nLCAnU2knLCAnTGEnLCAnTGknLCAnVGknXSxcclxuICBmaXhlZERvRmxhdDogWydEbycsICdSYScsICdSZScsICdNZScsICdNaScsICdGYScsICdTZScsICdTbycsICdMZScsICdMYScsICdUZScsICdUaSddLFxyXG4gIHNwZWNpYWxGU2hhcnBNOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG4gIHNwZWNpYWxDU2hhcnBNOiBbJ0IjJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRSMnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga2V5TmFtZVNldHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGtleU5hbWVUb0lERW51bSA9IE9iamVjdC5mcmVlemUoe1xyXG4gICdDJzogMCxcclxuICAnQ+KZryc6IDEsXHJcbiAgJ0QnOiAyLFxyXG4gICdE4pmvJzogMyxcclxuICAnRSc6IDQsXHJcbiAgJ0YnOiA1LFxyXG4gICdG4pmvJzogNixcclxuICAnRyc6IDcsXHJcbiAgJ0fima8nOiA4LFxyXG4gICdBJzogOSxcclxuICAnQeKZryc6IDEwLFxyXG4gICdCJzogMTEsXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlOYW1lVG9JREVudW07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGRhdGEgPSB7XHJcbiAgcGF0dGVybnM6IHtcclxuICAgIHNjYWxlczoge1xyXG4gICAgICAnbWFqb3InOiBbMiwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICdtaW5vcic6IFsyLCAxLCAyLCAyLCAxLCAyXSxcclxuICAgICAgJ2hhcm1vbmljIG1pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAnbWVsb2RpYyBtaW5vcic6IFsyLCAxLCAyLCAyLCAyLCAyXSxcclxuXHJcbiAgICB9LFxyXG4gICAgY2hvcmRzOiB7XHJcbiAgICAgICdtYWpvcic6IFs0LCAzXSxcclxuICAgICAgJ21pbm9yJzogWzMsIDRdLFxyXG4gICAgICAnZGltaW5pc2hlZCc6IFszLCAzXSxcclxuICAgICAgJ2F1Z21lbnRlZCc6IFs0LCA0XSxcclxuICAgICAgJ3N1c3BlbmRlZDInOiBbMiwgNV0sXHJcbiAgICAgICdzdXNwZW5kZWQ0JzogWzUsIDJdLFxyXG4gICAgfSxcclxuICB9LFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkYXRhO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBLZXlib2FyZCA9IHJlcXVpcmUoJy4va2V5Ym9hcmQnKTtcclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcbmNvbnN0IFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xyXG5cclxuU2NhbGVDb250cm9sbGVyLmluaXQoKTtcclxuU2NhbGVEaXNwbGF5LmluaXQoKTtcclxuXHJcbmNvbnN0IHRlc3QgPSBuZXcgS2V5Ym9hcmQoKTtcclxudGVzdC5zZXREaXNwbGF5TmFtZUZvckFsbEtleXNPZlR5cGUoJ3N0YW5kYXJkJyk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGtleU5hbWVTZXRzID0gcmVxdWlyZSgnLi9kYXRhL2tleS1uYW1lLXNldHMnKTtcclxuY29uc3Qga2V5TmFtZVRvSURFbnVtID0gcmVxdWlyZSgnLi9kYXRhL2tleS1uYW1lLXRvLWlkLWVudW0nKTtcclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZUtleUlEKGJhc2VOYW1lKSB7XHJcbiAgY29uc3QgaWQgPSBrZXlOYW1lVG9JREVudW1bYmFzZU5hbWVdO1xyXG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gLTE7XHJcbiAgcmV0dXJuIGlkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRLZXlOYW1lU2V0KHR5cGUpIHtcclxuICBjb25zdCBrZXlOYW1lU2V0ID0ga2V5TmFtZVNldHNbdHlwZV07XHJcbiAgaWYgKGtleU5hbWVTZXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gIHJldHVybiBrZXlOYW1lU2V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbGlhc09mU3BlY2lmaWNUeXBlKGtleU5hbWVTZXQsIGtleUlEKSB7XHJcbiAgY29uc3QgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGtleU5hbWVTZXRba2V5SURdO1xyXG4gIGlmIChhbGlhc09mU3BlY2lmaWNUeXBlID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcclxufVxyXG5cclxuXHJcbmNsYXNzIEtleU5hbWUge1xyXG4gIGNvbnN0cnVjdG9yKGJhc2VOYW1lKSB7XHJcbiAgICB0aGlzLmlkID0gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxpYXNPZlR5cGUodHlwZSkge1xyXG4gICAgY29uc3Qga2V5TmFtZVNldCA9IGdldEtleU5hbWVTZXQodHlwZSk7XHJcbiAgICBjb25zdCBhbGlhc09mU3BlY2lmaWNUeXBlID0gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCB0aGlzLmlkKTtcclxuICAgIHJldHVybiBhbGlhc09mU3BlY2lmaWNUeXBlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlOYW1lO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBQaWFub0tleSA9IHJlcXVpcmUoJy4vcGlhbm8ta2V5Jyk7XHJcbmNvbnN0IFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuY29uc3QgU2NhbGVEYXRhYmFzZSA9IHJlcXVpcmUoJy4vc2NhbGUtZGF0YWJhc2UnKTtcclxuY29uc3QgVGltZXJNYW5hZ2VyID0gcmVxdWlyZSgnLi90aW1lci1tYW5hZ2VyJyk7XHJcbmNvbnN0IHsgcmFuZ2UgfSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xyXG5cclxuY29uc3QgcGlhbm9LZXlOYW1lcyA9IFsnYycsICdjLXNoYXJwJywgJ2QnLCAnZC1zaGFycCcsICdlJyxcclxuICAnZicsICdmLXNoYXJwJywgJ2cnLCAnZy1zaGFycCcsICdhJywgJ2Etc2hhcnAnLCAnYiddO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVLZXlOYW1lRG9tSURzKCkge1xyXG4gIGNvbnN0IGtleU5hbWVzV2l0aE9jdGF2ZXMgPSBbXTtcclxuICBjb25zdCBOVU1fT0ZfT0NUQVZFUyA9IDM7XHJcbiAgcmFuZ2UoMSwgTlVNX09GX09DVEFWRVMpLmZvckVhY2goKG9jdGF2ZSkgPT4ge1xyXG4gICAgcGlhbm9LZXlOYW1lcy5mb3JFYWNoKChuYW1lKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5hbWVXaXRoT2N0YXZlID0gbmFtZSArIG9jdGF2ZTtcclxuICAgICAga2V5TmFtZXNXaXRoT2N0YXZlcy5wdXNoKG5hbWVXaXRoT2N0YXZlKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBrZXlOYW1lc1dpdGhPY3RhdmVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQaWFub0tleXNVc2luZ0RvbUlEcyhrZXlOYW1lSURzID0gW10pIHtcclxuICBjb25zdCBwaWFub0tleU5vZGVzID0gW107XHJcbiAga2V5TmFtZUlEcy5mb3JFYWNoKChpZCwga2V5SW5kZXgpID0+IHtcclxuICAgIGNvbnN0IHBpYW5vS2V5ID0gbmV3IFBpYW5vS2V5KGlkLCBrZXlJbmRleCk7XHJcbiAgICBwaWFub0tleU5vZGVzLnB1c2gocGlhbm9LZXkpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBwaWFub0tleU5vZGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQaWFub0tleXMoKSB7XHJcbiAgY29uc3Qga2V5TmFtZUlEcyA9IGdlbmVyYXRlS2V5TmFtZURvbUlEcygpO1xyXG4gIGNvbnN0IHBpYW5vS2V5cyA9IGdldFBpYW5vS2V5c1VzaW5nRG9tSURzKGtleU5hbWVJRHMpO1xyXG4gIHJldHVybiBwaWFub0tleXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMoa2V5Ym9hcmQpIHtcclxuICBrZXlib2FyZC5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBldmVudFNvdXJjZSA9IGtleWJvYXJkLmtleXMuZmluZChpdGVtID0+IGl0ZW0uZ2V0RG9tTm9kZSgpID09PSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmtleWJvYXJkX19rZXknKSk7XHJcbiAgICBpZiAoZXZlbnRTb3VyY2UgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgY29uc3QgaW5kZXggPSBldmVudFNvdXJjZS5nZXRLZXlJbmRleCgpO1xyXG4gICAga2V5Ym9hcmQuZGlzcGxheVNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuY2xhc3MgS2V5Ym9hcmQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmtleWJvYXJkJyk7XHJcbiAgICB0aGlzLmtleXMgPSBnZXRQaWFub0tleXMoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyID0gbmV3IFRpbWVyTWFuYWdlcigpO1xyXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcclxuICB9XHJcblxyXG4gIGRpc2FibGVIaWdobGlnaHRpbmdGb3JBbGxLZXlzKCkge1xyXG4gICAgdGhpcy5rZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICBrZXkuZGlzYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBlbmFibGVIaWdobGlnaHRpbmdGb3JSb290S2V5KGluZGV4T2ZSb290KSB7XHJcbiAgICBjb25zdCByb290S2V5ID0gdGhpcy5rZXlzW2luZGV4T2ZSb290XTtcclxuICAgIGNvbnN0IGlzUm9vdEtleSA9IHRydWU7XHJcbiAgICByb290S2V5LmVuYWJsZUhpZ2hsaWdodGluZyhpc1Jvb3RLZXkpO1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheVNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpIHtcclxuICAgIGNvbnN0IHNjYWxlUGF0dGVybiA9IFNjYWxlRGF0YWJhc2UuZ2V0UGF0dGVybk9mU2VsZWN0ZWRTY2FsZSgpO1xyXG4gICAgaWYgKHNjYWxlUGF0dGVybi5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyLmNsZWFyQWxsVGltZXJzKCk7XHJcbiAgICB0aGlzLmRpc2FibGVIaWdobGlnaHRpbmdGb3JBbGxLZXlzKCk7XHJcbiAgICB0aGlzLmVuYWJsZUhpZ2hsaWdodGluZ0ZvclJvb3RLZXkoaW5kZXgpO1xyXG4gICAgbGV0IGl0ZXIgPSBpbmRleDtcclxuICAgIHNjYWxlUGF0dGVybi5mb3JFYWNoKChpbmNyZW1lbnQsIGlkeCkgPT4ge1xyXG4gICAgICBpdGVyICs9IGluY3JlbWVudDtcclxuICAgICAgY29uc3QgbmV4dEtleSA9IHRoaXMua2V5c1tpdGVyXTtcclxuICAgICAgaWYgKG5leHRLZXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICB0aGlzLnRpbWVyTWFuYWdlci5hZGRUaW1lcihuZXh0S2V5LmVuYWJsZUhpZ2hsaWdodGluZy5iaW5kKG5leHRLZXkpLCBpZHggKyAxKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheU5hbWVGb3JBbGxLZXlzT2ZUeXBlKHR5cGUpIHtcclxuICAgIHRoaXMua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAga2V5LnNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBOYW1lU2FuaXRpemVyID0ge1xyXG5cclxuICAvKiAnYnRuLXNjYWxlLW1ham9yJyAtPiAnc2NhbGUtbWFqb3InICovXHJcbiAgY29udmVydEJ1dHRvbklEVG9TdGF0ZU5hbWUoYnV0dG9uSUQpIHtcclxuICAgIGlmIChidXR0b25JRCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgICBjb25zdCBzdGF0ZU5hbWUgPSBidXR0b25JRC5zdWJzdHJpbmcoNCk7XHJcbiAgICByZXR1cm4gc3RhdGVOYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJ2Pima8nICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb0tleU5hbWVCYXNlTmFtZShwaWFub0tleURvbUlEKSB7XHJcbiAgICBpZiAocGlhbm9LZXlEb21JRCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgICBjb25zdCB0cmltbWVkTmFtZSA9IHBpYW5vS2V5RG9tSUQuc2xpY2UoMCwgLTEpO1xyXG4gICAgY29uc3Qga2V5TmFtZUJhc2VOYW1lID0gdHJpbW1lZE5hbWUucmVwbGFjZSgnLXNoYXJwJywgJ+KZrycpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICByZXR1cm4ga2V5TmFtZUJhc2VOYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJzEnICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb09jdGF2ZU51bWJlcihwaWFub0tleURvbUlEKSB7XHJcbiAgICByZXR1cm4gcGlhbm9LZXlEb21JRC5zbGljZSgtMSk7XHJcbiAgfSxcclxuXHJcbiAgLyogJ2Mtc2hhcnAxJyAtPiAnYmxhY2snICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb0NvbG9yKHBpYW5vS2V5RG9tSUQpIHtcclxuICAgIHJldHVybiAocGlhbm9LZXlEb21JRC5pbmRleE9mKCdzaGFycCcpICE9PSAtMSkgPyAnYmxhY2snIDogJ3doaXRlJztcclxuICB9LFxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmFtZVNhbml0aXplcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgS2V5TmFtZSA9IHJlcXVpcmUoJy4va2V5LW5hbWUnKTtcclxuY29uc3QgTmFtZVNhbml0aXplciA9IHJlcXVpcmUoJy4vbmFtZS1zYW5pdGl6ZXInKTtcclxuXHJcbmNvbnN0IGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMgPSByZXF1aXJlKCcuL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzJyk7XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVDb2xvcihkb21JRCkge1xyXG4gIHJldHVybiBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9Db2xvcihkb21JRCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZU5hbWVzKGRvbUlEKSB7XHJcbiAgY29uc3Qga2V5TmFtZUJhc2VOYW1lID0gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvS2V5TmFtZUJhc2VOYW1lKGRvbUlEKTtcclxuICBjb25zdCBrZXlOYW1lID0gbmV3IEtleU5hbWUoa2V5TmFtZUJhc2VOYW1lKTtcclxuICByZXR1cm4ga2V5TmFtZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lT2N0YXZlKGRvbUlEKSB7XHJcbiAgcmV0dXJuIE5hbWVTYW5pdGl6ZXIuY29udmVydFBpYW5vS2V5RG9tSURUb09jdGF2ZU51bWJlcihkb21JRCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZE1vdXNlTGlzdGVuZXIocGlhbm9LZXkpIHtcclxuICBwaWFub0tleS5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHtcclxuICAgIGlmIChwaWFub0tleS5pc0hpZ2hsaWdodGVkKCkpIHJldHVybjtcclxuICAgIHBpYW5vS2V5LmVuYWJsZUhpZ2hsaWdodGluZyh0cnVlKTtcclxuICAgIGZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcclxuICAgICAgcGlhbm9LZXkuZGlzYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgICBzZXRUaW1lb3V0KGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApLCAwKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUb3VjaExpc3RlbmVyKHBpYW5vS2V5KSB7XHJcbiAgcGlhbm9LZXkuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKCkgPT4ge1xyXG4gICAgaWYgKHBpYW5vS2V5LmlzSGlnaGxpZ2h0ZWQoKSkgcmV0dXJuO1xyXG4gICAgcGlhbm9LZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKHRydWUpO1xyXG4gICAgZnVuY3Rpb24gb25Ub3VjaEVuZCgpIHtcclxuICAgICAgcGlhbm9LZXkuZGlzYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgICBzZXRUaW1lb3V0KGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCksIDApO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhwaWFub0tleSkge1xyXG4gIGFkZE1vdXNlTGlzdGVuZXIocGlhbm9LZXkpO1xyXG4gIGFkZFRvdWNoTGlzdGVuZXIocGlhbm9LZXkpO1xyXG59XHJcblxyXG5cclxuY2xhc3MgUGlhbm9LZXkge1xyXG4gIGNvbnN0cnVjdG9yKGRvbUlELCBrZXlJbmRleCkge1xyXG4gICAgdGhpcy5pbmRleCA9IGtleUluZGV4O1xyXG4gICAgdGhpcy5uYW1lcyA9IGRldGVybWluZU5hbWVzKGRvbUlEKTtcclxuICAgIHRoaXMuY29sb3IgPSBkZXRlcm1pbmVDb2xvcihkb21JRCk7XHJcbiAgICB0aGlzLm9jdGF2ZSA9IGRldGVybWluZU9jdGF2ZShkb21JRCk7XHJcbiAgICB0aGlzLmRvbU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkb21JRCk7XHJcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmRfX2tleS1uYW1lJyk7XHJcbiAgICB0aGlzLmRvbUZpbmdlcmluZ1RleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fZmluZ2VyaW5nJyk7XHJcbiAgICByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaXNIaWdobGlnaHRlZCgpIHtcclxuICAgIGxldCBpc0hpZ2hsaWdodGVkID0gZmFsc2U7XHJcbiAgICBoaWdobGlnaHRpbmdDbGFzc05hbWVzLmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XHJcbiAgICAgICAgaXNIaWdobGlnaHRlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGlzSGlnaGxpZ2h0ZWQ7XHJcbiAgfVxyXG5cclxuICBlbmFibGVIaWdobGlnaHRpbmcoaXNSb290S2V5ID0gZmFsc2UpIHtcclxuICAgIGxldCBoaWdobGlnaHRDbGFzc05hbWUgPSAnJztcclxuICAgIGlmIChpc1Jvb3RLZXkpIHtcclxuICAgICAgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/ICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZS0tcm9vdCcgOiAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2stLXJvb3QnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/ICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScgOiAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2snO1xyXG4gICAgfVxyXG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoaGlnaGxpZ2h0Q2xhc3NOYW1lKTtcclxuICB9XHJcblxyXG4gIGRpc2FibGVIaWdobGlnaHRpbmcoKSB7XHJcbiAgICBoaWdobGlnaHRpbmdDbGFzc05hbWVzLmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xyXG4gICAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRDdXN0b21EaXNwbGF5TmFtZShuYW1lKSB7XHJcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IG5hbWU7XHJcbiAgfVxyXG5cclxuICBzZXREaXNwbGF5TmFtZU9mVHlwZSh0eXBlKSB7XHJcbiAgICBjb25zdCBhbGlhcyA9IHRoaXMubmFtZXMuZ2V0QWxpYXNPZlR5cGUodHlwZSk7XHJcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IGFsaWFzO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudE5hbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQ7XHJcbiAgfVxyXG5cclxuICBnZXRLZXlJbmRleCgpIHtcclxuICAgIHJldHVybiB0aGlzLmluZGV4O1xyXG4gIH1cclxuXHJcbiAgZ2V0RG9tTm9kZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRvbU5vZGU7XHJcbiAgfVxyXG5cclxuICByZXNldERpc3BsYXlOYW1lKCkge1xyXG4gICAgLy8gVE9ETzogR2V0IGRlZmF1bHQgdHlwZSBmcm9tIHNldHRpbmdzIG9iamVjdFxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBpYW5vS2V5O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBOYW1lU2FuaXRpemVyID0gcmVxdWlyZSgnLi9uYW1lLXNhbml0aXplcicpO1xyXG5jb25zdCBTY2FsZURpc3BsYXkgPSByZXF1aXJlKCcuL3NjYWxlLWRpc3BsYXknKTtcclxuXHJcbmxldCBzY2FsZVN0YXRlID0gJyc7XHJcblxyXG5mdW5jdGlvbiBnZXRTdGF0ZU5hbWVGcm9tQnV0dG9uSUQoYnV0dG9uRWxlbSkge1xyXG4gIGNvbnN0IGJ1dHRvbklEID0gYnV0dG9uRWxlbS5pZDtcclxuICBjb25zdCBzdGF0ZU5hbWUgPSBOYW1lU2FuaXRpemVyLmNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKTtcclxuICByZXR1cm4gc3RhdGVOYW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRIaWdobGlnaHRPbkJ1dHRvbihidG4pIHtcclxuICBidG4uY2xhc3NMaXN0LmFkZCgnYnRuLS1zZWxlY3RlZCcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldEhpZ2hsaWdodE9uQWxsQnV0dG9ucyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBzY2FsZUNvbnRyb2xsZXIuYnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcclxuICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdidG4tLXNlbGVjdGVkJyk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMoc2NhbGVDb250cm9sbGVyKSB7XHJcbiAgc2NhbGVDb250cm9sbGVyLmJ1dHRvbnMuZm9yRWFjaCgoYnRuKSA9PiB7XHJcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIHNjYWxlU3RhdGUgPSBnZXRTdGF0ZU5hbWVGcm9tQnV0dG9uSUQoYnRuKTtcclxuICAgICAgcmVzZXRIaWdobGlnaHRPbkFsbEJ1dHRvbnMoc2NhbGVDb250cm9sbGVyKTtcclxuICAgICAgYWRkSGlnaGxpZ2h0T25CdXR0b24oYnRuKTtcclxuICAgICAgU2NhbGVEaXNwbGF5LnNldFRleHQoc2NhbGVTdGF0ZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgc2NhbGVDb250cm9sbGVyLmNhdGVnb3JpZXMuZm9yRWFjaCgoY2F0ZWdvcnkpID0+IHtcclxuICAgIGNvbnN0IGNhdGVnb3J5VGl0bGUgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuc2NhbGUtbGlzdF9fY2F0ZWdvcnktdGl0bGUnKTtcclxuICAgIGNvbnN0IGRyb3Bkb3duTGlzdCA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1saXN0X19jYXRlZ29yeS1saXN0Jyk7XHJcbiAgICBjb25zdCBkcm9wZG93bkFycm93ID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLWFycm93Jyk7XHJcbiAgICBjYXRlZ29yeVRpdGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBjYXRlZ29yeVRpdGxlLmNsYXNzTGlzdC50b2dnbGUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5LXRpdGxlLS1hY3RpdmUnKTtcclxuICAgICAgZHJvcGRvd25MaXN0LmNsYXNzTGlzdC50b2dnbGUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QtLWhpZGRlbicpO1xyXG4gICAgICBkcm9wZG93bkFycm93LmNsYXNzTGlzdC50b2dnbGUoJ2Ryb3Bkb3duLWFycm93LS1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuY2xhc3Mgc2NhbGVDb250cm9sbGVyIHtcclxuICBzdGF0aWMgaW5pdCgpIHtcclxuICAgIHRoaXMuYnV0dG9ucyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidG4nKV07XHJcbiAgICB0aGlzLmNhdGVnb3JpZXMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnknKV07XHJcbiAgICByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldFNjYWxlU3RhdGUoKSB7XHJcbiAgICByZXR1cm4gc2NhbGVTdGF0ZTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNjYWxlQ29udHJvbGxlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcblxyXG5jb25zdCBzY2FsZURhdGEgPSByZXF1aXJlKCcuL2RhdGEvc2NhbGUtZGF0YScpO1xyXG5cclxuZnVuY3Rpb24gZ2V0SW5mb09mU2NhbGVTdGF0ZShzY2FsZVN0YXRlID0gJycpIHtcclxuICBjb25zdCBbY2hvcmRPclNjYWxlLCAuLi5zY2FsZVR5cGVUb2tlbnNdID0gc2NhbGVTdGF0ZS5zcGxpdCgnLScpO1xyXG4gIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlVHlwZVRva2Vucy5qb2luKCcgJyk7XHJcbiAgcmV0dXJuIFtjaG9yZE9yU2NhbGUsIHNjYWxlVHlwZV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNjYWxlUGF0dGVybihzY2FsZVR5cGUpIHtcclxuICBjb25zdCBwYXR0ZXJuID0gc2NhbGVEYXRhLnBhdHRlcm5zLnNjYWxlc1tzY2FsZVR5cGVdO1xyXG4gIGlmIChwYXR0ZXJuID09PSB1bmRlZmluZWQpIHJldHVybiBbXTtcclxuICByZXR1cm4gcGF0dGVybjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2hvcmRQYXR0ZXJuKHNjYWxlVHlwZSkge1xyXG4gIGNvbnN0IHBhdHRlcm4gPSBzY2FsZURhdGEucGF0dGVybnMuY2hvcmRzW3NjYWxlVHlwZV07XHJcbiAgaWYgKHBhdHRlcm4gPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xyXG4gIHJldHVybiBwYXR0ZXJuO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQYXR0ZXJuKHNjYWxlSW5mbykge1xyXG4gIGNvbnN0IFtjaG9yZE9yU2NhbGUsIHNjYWxlVHlwZV0gPSBzY2FsZUluZm87XHJcbiAgbGV0IHBhdHRlcm4gPSBbXTtcclxuICBpZiAoY2hvcmRPclNjYWxlID09PSAnc2NhbGUnKSB7XHJcbiAgICBwYXR0ZXJuID0gZ2V0U2NhbGVQYXR0ZXJuKHNjYWxlVHlwZSk7XHJcbiAgfSBlbHNlIGlmIChjaG9yZE9yU2NhbGUgPT09ICdjaG9yZCcpIHtcclxuICAgIHBhdHRlcm4gPSBnZXRDaG9yZFBhdHRlcm4oc2NhbGVUeXBlKTtcclxuICB9XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcblxyXG5jbGFzcyBzY2FsZURhdGFiYXNlIHtcclxuICBzdGF0aWMgZ2V0UGF0dGVybk9mKHNjYWxlU3RhdGUgPSAnJykge1xyXG4gICAgY29uc3Qgc2NhbGVJbmZvID0gZ2V0SW5mb09mU2NhbGVTdGF0ZShzY2FsZVN0YXRlKTtcclxuICAgIGNvbnN0IHBhdHRlcm4gPSBnZXRQYXR0ZXJuKHNjYWxlSW5mbyk7XHJcbiAgICByZXR1cm4gcGF0dGVybjtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRQYXR0ZXJuT2ZTZWxlY3RlZFNjYWxlKCkge1xyXG4gICAgY29uc3Qgc2NhbGVTdGF0ZSA9IFNjYWxlQ29udHJvbGxlci5nZXRTY2FsZVN0YXRlKCk7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSB0aGlzLmdldFBhdHRlcm5PZihzY2FsZVN0YXRlKTtcclxuICAgIHJldHVybiBzY2FsZVBhdHRlcm47XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNjYWxlRGF0YWJhc2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNsYXNzIFNjYWxlRGlzcGxheSB7XHJcbiAgc3RhdGljIGluaXQoKSB7XHJcbiAgICB0aGlzLmRvbUVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2NhbGUtZGlzcGxheV9fdGV4dC1wYW5lbCcpO1xyXG4gICAgdGhpcy5kb21FbGVtLnRleHRDb250ZW50ID0gJyc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2V0VGV4dCh0ZXh0KSB7XHJcbiAgICB0aGlzLmRvbUVsZW0udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2FsZURpc3BsYXk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNsYXNzIFRpbWVyTWFuYWdlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnRpbWVycyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogVGFrZSBvZmZzZXQgdGltZSBmcm9tIHNldHRpbmdzXHJcbiAgYWRkVGltZXIoY2FsbGJhY2ssIG9mZnNldEluZGV4KSB7XHJcbiAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIDIwMCAqIG9mZnNldEluZGV4KTtcclxuICAgIHRoaXMudGltZXJzLnB1c2godGltZXIpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJBbGxUaW1lcnMoKSB7XHJcbiAgICB0aGlzLnRpbWVycy5mb3JFYWNoKCh0aW1lcikgPT4ge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRpbWVycyA9IFtdO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lck1hbmFnZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhpcyBudW1iZXIgaXMgaW5jbHVkZWRcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCkge1xuICByZXR1cm4gWy4uLkFycmF5KGVuZCAtIHN0YXJ0ICsgMSkuZmlsbCgpLm1hcCgoXywgaSkgPT4gaSArIDEpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IHJhbmdlIH07XG4iXX0=
