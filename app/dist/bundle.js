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

const mainKeyboard = new Keyboard();
mainKeyboard.setDisplayNameForAllKeysOfType('standard');

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

function getInfoOfScaleState() {
  const [chordOrScale, ...scaleTypeTokens] = scaleState.split('-');
  const scaleType = scaleTypeTokens.join(' ');
  return { chordOrScale, scaleType };
}


class scaleController {
  static init() {
    this.buttons = [...document.getElementsByClassName('btn')];
    this.categories = [...document.getElementsByClassName('scale-list__category')];
    registerEventListeners(this);
  }

  static getChordOrScale() {
    const { chordOrScale } = getInfoOfScaleState();
    return chordOrScale;
  }

  static getScaleType() {
    const { scaleType } = getInfoOfScaleState();
    return scaleType;
  }
}


module.exports = scaleController;

},{"./name-sanitizer":8,"./scale-display":12}],11:[function(require,module,exports){
'use strict';

const ScaleController = require('./scale-controller');

const scaleData = require('./data/scale-data');

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

function getPattern() {
  const chordOrScale = ScaleController.getChordOrScale();
  const scaleType = ScaleController.getScaleType();
  let pattern = [];
  if (chordOrScale === 'scale') {
    pattern = getScalePattern(scaleType);
  } else if (chordOrScale === 'chord') {
    pattern = getChordPattern(scaleType);
  }
  return pattern;
}


class scaleDatabase {
  static getPatternOfSelectedScale() {
    const scalePattern = getPattern();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzLmpzIiwiYXBwL3NyYy9kYXRhL2tleS1uYW1lLXNldHMuanMiLCJhcHAvc3JjL2RhdGEva2V5LW5hbWUtdG8taWQtZW51bS5qcyIsImFwcC9zcmMvZGF0YS9zY2FsZS1kYXRhLmpzIiwiYXBwL3NyYy9pbmRleC5qcyIsImFwcC9zcmMva2V5LW5hbWUuanMiLCJhcHAvc3JjL2tleWJvYXJkLmpzIiwiYXBwL3NyYy9uYW1lLXNhbml0aXplci5qcyIsImFwcC9zcmMvcGlhbm8ta2V5LmpzIiwiYXBwL3NyYy9zY2FsZS1jb250cm9sbGVyLmpzIiwiYXBwL3NyYy9zY2FsZS1kYXRhYmFzZS5qcyIsImFwcC9zcmMvc2NhbGUtZGlzcGxheS5qcyIsImFwcC9zcmMvdGltZXItbWFuYWdlci5qcyIsImFwcC9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMgPSBbXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JyxcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2stLXJvb3QnLFxyXG4gICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScsXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJyxcclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qga2V5TmFtZVNldHMgPSB7XHJcbiAgc3RhbmRhcmQ6IFsnQycsICdD4pmvJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdC4pmtJywgJ0InXSxcclxuICBzaGFycDogWydDJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG4gIGZsYXQ6IFsnQycsICdE4pmtJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnR+KZrScsICdHJywgJ0Hima0nLCAnQScsICdC4pmtJywgJ0InXSxcclxuICBmaXhlZERvU2hhcnA6IFsnRG8nLCAnRGknLCAnUmUnLCAnUmknLCAnTWknLCAnRmEnLCAnRmknLCAnU28nLCAnU2knLCAnTGEnLCAnTGknLCAnVGknXSxcclxuICBmaXhlZERvRmxhdDogWydEbycsICdSYScsICdSZScsICdNZScsICdNaScsICdGYScsICdTZScsICdTbycsICdMZScsICdMYScsICdUZScsICdUaSddLFxyXG4gIHNwZWNpYWxGU2hhcnBNOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG4gIHNwZWNpYWxDU2hhcnBNOiBbJ0IjJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRSMnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga2V5TmFtZVNldHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGtleU5hbWVUb0lERW51bSA9IE9iamVjdC5mcmVlemUoe1xyXG4gICdDJzogMCxcclxuICAnQ+KZryc6IDEsXHJcbiAgJ0QnOiAyLFxyXG4gICdE4pmvJzogMyxcclxuICAnRSc6IDQsXHJcbiAgJ0YnOiA1LFxyXG4gICdG4pmvJzogNixcclxuICAnRyc6IDcsXHJcbiAgJ0fima8nOiA4LFxyXG4gICdBJzogOSxcclxuICAnQeKZryc6IDEwLFxyXG4gICdCJzogMTEsXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlOYW1lVG9JREVudW07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGRhdGEgPSB7XHJcbiAgcGF0dGVybnM6IHtcclxuICAgIHNjYWxlczoge1xyXG4gICAgICAnbWFqb3InOiBbMiwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICdtaW5vcic6IFsyLCAxLCAyLCAyLCAxLCAyXSxcclxuICAgICAgJ2hhcm1vbmljIG1pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAnbWVsb2RpYyBtaW5vcic6IFsyLCAxLCAyLCAyLCAyLCAyXSxcclxuXHJcbiAgICB9LFxyXG4gICAgY2hvcmRzOiB7XHJcbiAgICAgICdtYWpvcic6IFs0LCAzXSxcclxuICAgICAgJ21pbm9yJzogWzMsIDRdLFxyXG4gICAgICAnZGltaW5pc2hlZCc6IFszLCAzXSxcclxuICAgICAgJ2F1Z21lbnRlZCc6IFs0LCA0XSxcclxuICAgICAgJ3N1c3BlbmRlZDInOiBbMiwgNV0sXHJcbiAgICAgICdzdXNwZW5kZWQ0JzogWzUsIDJdLFxyXG4gICAgfSxcclxuICB9LFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkYXRhO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBLZXlib2FyZCA9IHJlcXVpcmUoJy4va2V5Ym9hcmQnKTtcclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcbmNvbnN0IFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xyXG5cclxuU2NhbGVDb250cm9sbGVyLmluaXQoKTtcclxuU2NhbGVEaXNwbGF5LmluaXQoKTtcclxuXHJcbmNvbnN0IG1haW5LZXlib2FyZCA9IG5ldyBLZXlib2FyZCgpO1xyXG5tYWluS2V5Ym9hcmQuc2V0RGlzcGxheU5hbWVGb3JBbGxLZXlzT2ZUeXBlKCdzdGFuZGFyZCcpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBrZXlOYW1lU2V0cyA9IHJlcXVpcmUoJy4vZGF0YS9rZXktbmFtZS1zZXRzJyk7XHJcbmNvbnN0IGtleU5hbWVUb0lERW51bSA9IHJlcXVpcmUoJy4vZGF0YS9rZXktbmFtZS10by1pZC1lbnVtJyk7XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVLZXlJRChiYXNlTmFtZSkge1xyXG4gIGNvbnN0IGlkID0ga2V5TmFtZVRvSURFbnVtW2Jhc2VOYW1lXTtcclxuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIC0xO1xyXG4gIHJldHVybiBpZDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0S2V5TmFtZVNldCh0eXBlKSB7XHJcbiAgY29uc3Qga2V5TmFtZVNldCA9IGtleU5hbWVTZXRzW3R5cGVdO1xyXG4gIGlmIChrZXlOYW1lU2V0ID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICByZXR1cm4ga2V5TmFtZVNldDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCBrZXlJRCkge1xyXG4gIGNvbnN0IGFsaWFzT2ZTcGVjaWZpY1R5cGUgPSBrZXlOYW1lU2V0W2tleUlEXTtcclxuICBpZiAoYWxpYXNPZlNwZWNpZmljVHlwZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgcmV0dXJuIGFsaWFzT2ZTcGVjaWZpY1R5cGU7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBLZXlOYW1lIHtcclxuICBjb25zdHJ1Y3RvcihiYXNlTmFtZSkge1xyXG4gICAgdGhpcy5pZCA9IGRldGVybWluZUtleUlEKGJhc2VOYW1lKTtcclxuICB9XHJcblxyXG4gIGdldEFsaWFzT2ZUeXBlKHR5cGUpIHtcclxuICAgIGNvbnN0IGtleU5hbWVTZXQgPSBnZXRLZXlOYW1lU2V0KHR5cGUpO1xyXG4gICAgY29uc3QgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwgdGhpcy5pZCk7XHJcbiAgICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5TmFtZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgUGlhbm9LZXkgPSByZXF1aXJlKCcuL3BpYW5vLWtleScpO1xyXG5jb25zdCBTY2FsZURpc3BsYXkgPSByZXF1aXJlKCcuL3NjYWxlLWRpc3BsYXknKTtcclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcbmNvbnN0IFNjYWxlRGF0YWJhc2UgPSByZXF1aXJlKCcuL3NjYWxlLWRhdGFiYXNlJyk7XHJcbmNvbnN0IFRpbWVyTWFuYWdlciA9IHJlcXVpcmUoJy4vdGltZXItbWFuYWdlcicpO1xyXG5jb25zdCB7IHJhbmdlIH0gPSByZXF1aXJlKCcuL3V0aWwnKTtcclxuXHJcbmNvbnN0IHBpYW5vS2V5TmFtZXMgPSBbJ2MnLCAnYy1zaGFycCcsICdkJywgJ2Qtc2hhcnAnLCAnZScsXHJcbiAgJ2YnLCAnZi1zaGFycCcsICdnJywgJ2ctc2hhcnAnLCAnYScsICdhLXNoYXJwJywgJ2InXTtcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlS2V5TmFtZURvbUlEcygpIHtcclxuICBjb25zdCBrZXlOYW1lc1dpdGhPY3RhdmVzID0gW107XHJcbiAgY29uc3QgTlVNX09GX09DVEFWRVMgPSAzO1xyXG4gIHJhbmdlKDEsIE5VTV9PRl9PQ1RBVkVTKS5mb3JFYWNoKChvY3RhdmUpID0+IHtcclxuICAgIHBpYW5vS2V5TmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xyXG4gICAgICBjb25zdCBuYW1lV2l0aE9jdGF2ZSA9IG5hbWUgKyBvY3RhdmU7XHJcbiAgICAgIGtleU5hbWVzV2l0aE9jdGF2ZXMucHVzaChuYW1lV2l0aE9jdGF2ZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4ga2V5TmFtZXNXaXRoT2N0YXZlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlzVXNpbmdEb21JRHMoa2V5TmFtZUlEcyA9IFtdKSB7XHJcbiAgY29uc3QgcGlhbm9LZXlOb2RlcyA9IFtdO1xyXG4gIGtleU5hbWVJRHMuZm9yRWFjaCgoaWQsIGtleUluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBwaWFub0tleSA9IG5ldyBQaWFub0tleShpZCwga2V5SW5kZXgpO1xyXG4gICAgcGlhbm9LZXlOb2Rlcy5wdXNoKHBpYW5vS2V5KTtcclxuICB9KTtcclxuICByZXR1cm4gcGlhbm9LZXlOb2RlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlzKCkge1xyXG4gIGNvbnN0IGtleU5hbWVJRHMgPSBnZW5lcmF0ZUtleU5hbWVEb21JRHMoKTtcclxuICBjb25zdCBwaWFub0tleXMgPSBnZXRQaWFub0tleXNVc2luZ0RvbUlEcyhrZXlOYW1lSURzKTtcclxuICByZXR1cm4gcGlhbm9LZXlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKGtleWJvYXJkKSB7XHJcbiAga2V5Ym9hcmQuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZXZlbnRTb3VyY2UgPSBrZXlib2FyZC5rZXlzLmZpbmQoaXRlbSA9PiBpdGVtLmdldERvbU5vZGUoKSA9PT0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5rZXlib2FyZF9fa2V5JykpO1xyXG4gICAgaWYgKGV2ZW50U291cmNlID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgIGNvbnN0IGluZGV4ID0gZXZlbnRTb3VyY2UuZ2V0S2V5SW5kZXgoKTtcclxuICAgIGtleWJvYXJkLmRpc3BsYXlTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KTtcclxuICB9KTtcclxufVxyXG5cclxuXHJcbmNsYXNzIEtleWJvYXJkIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZCcpO1xyXG4gICAgdGhpcy5rZXlzID0gZ2V0UGlhbm9LZXlzKCk7XHJcbiAgICB0aGlzLnRpbWVyTWFuYWdlciA9IG5ldyBUaW1lck1hbmFnZXIoKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlnaGxpZ2h0aW5nRm9yQWxsS2V5cygpIHtcclxuICAgIHRoaXMua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAga2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlnaGxpZ2h0aW5nRm9yUm9vdEtleShpbmRleE9mUm9vdCkge1xyXG4gICAgY29uc3Qgcm9vdEtleSA9IHRoaXMua2V5c1tpbmRleE9mUm9vdF07XHJcbiAgICBjb25zdCBpc1Jvb3RLZXkgPSB0cnVlO1xyXG4gICAgcm9vdEtleS5lbmFibGVIaWdobGlnaHRpbmcoaXNSb290S2V5KTtcclxuICB9XHJcblxyXG4gIGRpc3BsYXlTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KSB7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSBTY2FsZURhdGFiYXNlLmdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKTtcclxuICAgIGlmIChzY2FsZVBhdHRlcm4ubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLnRpbWVyTWFuYWdlci5jbGVhckFsbFRpbWVycygpO1xyXG4gICAgdGhpcy5kaXNhYmxlSGlnaGxpZ2h0aW5nRm9yQWxsS2V5cygpO1xyXG4gICAgdGhpcy5lbmFibGVIaWdobGlnaHRpbmdGb3JSb290S2V5KGluZGV4KTtcclxuICAgIGxldCBpdGVyID0gaW5kZXg7XHJcbiAgICBzY2FsZVBhdHRlcm4uZm9yRWFjaCgoaW5jcmVtZW50LCBpZHgpID0+IHtcclxuICAgICAgaXRlciArPSBpbmNyZW1lbnQ7XHJcbiAgICAgIGNvbnN0IG5leHRLZXkgPSB0aGlzLmtleXNbaXRlcl07XHJcbiAgICAgIGlmIChuZXh0S2V5ID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgICAgdGhpcy50aW1lck1hbmFnZXIuYWRkVGltZXIobmV4dEtleS5lbmFibGVIaWdobGlnaHRpbmcuYmluZChuZXh0S2V5KSwgaWR4ICsgMSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldERpc3BsYXlOYW1lRm9yQWxsS2V5c09mVHlwZSh0eXBlKSB7XHJcbiAgICB0aGlzLmtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgIGtleS5zZXREaXNwbGF5TmFtZU9mVHlwZSh0eXBlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgTmFtZVNhbml0aXplciA9IHtcclxuXHJcbiAgLyogJ2J0bi1zY2FsZS1tYWpvcicgLT4gJ3NjYWxlLW1ham9yJyAqL1xyXG4gIGNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKSB7XHJcbiAgICBpZiAoYnV0dG9uSUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gICAgY29uc3Qgc3RhdGVOYW1lID0gYnV0dG9uSUQuc3Vic3RyaW5nKDQpO1xyXG4gICAgcmV0dXJuIHN0YXRlTmFtZTtcclxuICB9LFxyXG5cclxuICAvKiAnYy1zaGFycDEnIC0+ICdj4pmvJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9LZXlOYW1lQmFzZU5hbWUocGlhbm9LZXlEb21JRCkge1xyXG4gICAgaWYgKHBpYW5vS2V5RG9tSUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gICAgY29uc3QgdHJpbW1lZE5hbWUgPSBwaWFub0tleURvbUlELnNsaWNlKDAsIC0xKTtcclxuICAgIGNvbnN0IGtleU5hbWVCYXNlTmFtZSA9IHRyaW1tZWROYW1lLnJlcGxhY2UoJy1zaGFycCcsICfima8nKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgcmV0dXJuIGtleU5hbWVCYXNlTmFtZTtcclxuICB9LFxyXG5cclxuICAvKiAnYy1zaGFycDEnIC0+ICcxJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9PY3RhdmVOdW1iZXIocGlhbm9LZXlEb21JRCkge1xyXG4gICAgcmV0dXJuIHBpYW5vS2V5RG9tSUQuc2xpY2UoLTEpO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJ2JsYWNrJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9Db2xvcihwaWFub0tleURvbUlEKSB7XHJcbiAgICByZXR1cm4gKHBpYW5vS2V5RG9tSUQuaW5kZXhPZignc2hhcnAnKSAhPT0gLTEpID8gJ2JsYWNrJyA6ICd3aGl0ZSc7XHJcbiAgfSxcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVTYW5pdGl6ZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEtleU5hbWUgPSByZXF1aXJlKCcuL2tleS1uYW1lJyk7XHJcbmNvbnN0IE5hbWVTYW5pdGl6ZXIgPSByZXF1aXJlKCcuL25hbWUtc2FuaXRpemVyJyk7XHJcblxyXG5jb25zdCBoaWdobGlnaHRpbmdDbGFzc05hbWVzID0gcmVxdWlyZSgnLi9kYXRhL2hpZ2hsaWdodGluZy1jbGFzcy1uYW1lcycpO1xyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lQ29sb3IoZG9tSUQpIHtcclxuICByZXR1cm4gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvQ29sb3IoZG9tSUQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVOYW1lcyhkb21JRCkge1xyXG4gIGNvbnN0IGtleU5hbWVCYXNlTmFtZSA9IE5hbWVTYW5pdGl6ZXIuY29udmVydFBpYW5vS2V5RG9tSURUb0tleU5hbWVCYXNlTmFtZShkb21JRCk7XHJcbiAgY29uc3Qga2V5TmFtZSA9IG5ldyBLZXlOYW1lKGtleU5hbWVCYXNlTmFtZSk7XHJcbiAgcmV0dXJuIGtleU5hbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZU9jdGF2ZShkb21JRCkge1xyXG4gIHJldHVybiBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9PY3RhdmVOdW1iZXIoZG9tSUQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRNb3VzZUxpc3RlbmVyKHBpYW5vS2V5KSB7XHJcbiAgcGlhbm9LZXkuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB7XHJcbiAgICBpZiAocGlhbm9LZXkuaXNIaWdobGlnaHRlZCgpKSByZXR1cm47XHJcbiAgICBwaWFub0tleS5lbmFibGVIaWdobGlnaHRpbmcodHJ1ZSk7XHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoKSB7XHJcbiAgICAgIHBpYW5vS2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgICAgc2V0VGltZW91dChkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKSwgMCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVG91Y2hMaXN0ZW5lcihwaWFub0tleSkge1xyXG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICgpID0+IHtcclxuICAgIGlmIChwaWFub0tleS5pc0hpZ2hsaWdodGVkKCkpIHJldHVybjtcclxuICAgIHBpYW5vS2V5LmVuYWJsZUhpZ2hsaWdodGluZyh0cnVlKTtcclxuICAgIGZ1bmN0aW9uIG9uVG91Y2hFbmQoKSB7XHJcbiAgICAgIHBpYW5vS2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgICAgc2V0VGltZW91dChkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQpLCAwKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMocGlhbm9LZXkpIHtcclxuICBhZGRNb3VzZUxpc3RlbmVyKHBpYW5vS2V5KTtcclxuICBhZGRUb3VjaExpc3RlbmVyKHBpYW5vS2V5KTtcclxufVxyXG5cclxuXHJcbmNsYXNzIFBpYW5vS2V5IHtcclxuICBjb25zdHJ1Y3Rvcihkb21JRCwga2V5SW5kZXgpIHtcclxuICAgIHRoaXMuaW5kZXggPSBrZXlJbmRleDtcclxuICAgIHRoaXMubmFtZXMgPSBkZXRlcm1pbmVOYW1lcyhkb21JRCk7XHJcbiAgICB0aGlzLmNvbG9yID0gZGV0ZXJtaW5lQ29sb3IoZG9tSUQpO1xyXG4gICAgdGhpcy5vY3RhdmUgPSBkZXRlcm1pbmVPY3RhdmUoZG9tSUQpO1xyXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSUQpO1xyXG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19rZXktbmFtZScpO1xyXG4gICAgdGhpcy5kb21GaW5nZXJpbmdUZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmRfX2ZpbmdlcmluZycpO1xyXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcclxuICB9XHJcblxyXG4gIGlzSGlnaGxpZ2h0ZWQoKSB7XHJcbiAgICBsZXQgaXNIaWdobGlnaHRlZCA9IGZhbHNlO1xyXG4gICAgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcy5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcclxuICAgICAgaWYgKHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xyXG4gICAgICAgIGlzSGlnaGxpZ2h0ZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBpc0hpZ2hsaWdodGVkO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlnaGxpZ2h0aW5nKGlzUm9vdEtleSA9IGZhbHNlKSB7XHJcbiAgICBsZXQgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gJyc7XHJcbiAgICBpZiAoaXNSb290S2V5KSB7XHJcbiAgICAgIGhpZ2hsaWdodENsYXNzTmFtZSA9IHRoaXMuY29sb3IgPT09ICd3aGl0ZScgPyAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUtLXJvb3QnIDogJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrLS1yb290JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGhpZ2hsaWdodENsYXNzTmFtZSA9IHRoaXMuY29sb3IgPT09ICd3aGl0ZScgPyAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUnIDogJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJztcclxuICAgIH1cclxuICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGhpZ2hsaWdodENsYXNzTmFtZSk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlnaGxpZ2h0aW5nKCkge1xyXG4gICAgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcy5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcclxuICAgICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0Q3VzdG9tRGlzcGxheU5hbWUobmFtZSkge1xyXG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQgPSBuYW1lO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheU5hbWVPZlR5cGUodHlwZSkge1xyXG4gICAgY29uc3QgYWxpYXMgPSB0aGlzLm5hbWVzLmdldEFsaWFzT2ZUeXBlKHR5cGUpO1xyXG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQgPSBhbGlhcztcclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnROYW1lKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50O1xyXG4gIH1cclxuXHJcbiAgZ2V0S2V5SW5kZXgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbmRleDtcclxuICB9XHJcblxyXG4gIGdldERvbU5vZGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kb21Ob2RlO1xyXG4gIH1cclxuXHJcbiAgcmVzZXREaXNwbGF5TmFtZSgpIHtcclxuICAgIC8vIFRPRE86IEdldCBkZWZhdWx0IHR5cGUgZnJvbSBzZXR0aW5ncyBvYmplY3RcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQaWFub0tleTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgTmFtZVNhbml0aXplciA9IHJlcXVpcmUoJy4vbmFtZS1zYW5pdGl6ZXInKTtcclxuY29uc3QgU2NhbGVEaXNwbGF5ID0gcmVxdWlyZSgnLi9zY2FsZS1kaXNwbGF5Jyk7XHJcblxyXG5sZXQgc2NhbGVTdGF0ZSA9ICcnO1xyXG5cclxuZnVuY3Rpb24gZ2V0U3RhdGVOYW1lRnJvbUJ1dHRvbklEKGJ1dHRvbkVsZW0pIHtcclxuICBjb25zdCBidXR0b25JRCA9IGJ1dHRvbkVsZW0uaWQ7XHJcbiAgY29uc3Qgc3RhdGVOYW1lID0gTmFtZVNhbml0aXplci5jb252ZXJ0QnV0dG9uSURUb1N0YXRlTmFtZShidXR0b25JRCk7XHJcbiAgcmV0dXJuIHN0YXRlTmFtZTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkSGlnaGxpZ2h0T25CdXR0b24oYnRuKSB7XHJcbiAgYnRuLmNsYXNzTGlzdC5hZGQoJ2J0bi0tc2VsZWN0ZWQnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXRIaWdobGlnaHRPbkFsbEJ1dHRvbnMoc2NhbGVDb250cm9sbGVyKSB7XHJcbiAgc2NhbGVDb250cm9sbGVyLmJ1dHRvbnMuZm9yRWFjaCgoYnRuKSA9PiB7XHJcbiAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnYnRuLS1zZWxlY3RlZCcpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIHNjYWxlQ29udHJvbGxlci5idXR0b25zLmZvckVhY2goKGJ0bikgPT4ge1xyXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBzY2FsZVN0YXRlID0gZ2V0U3RhdGVOYW1lRnJvbUJ1dHRvbklEKGJ0bik7XHJcbiAgICAgIHJlc2V0SGlnaGxpZ2h0T25BbGxCdXR0b25zKHNjYWxlQ29udHJvbGxlcik7XHJcbiAgICAgIGFkZEhpZ2hsaWdodE9uQnV0dG9uKGJ0bik7XHJcbiAgICAgIFNjYWxlRGlzcGxheS5zZXRUZXh0KHNjYWxlU3RhdGUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHNjYWxlQ29udHJvbGxlci5jYXRlZ29yaWVzLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XHJcbiAgICBjb25zdCBjYXRlZ29yeVRpdGxlID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLnNjYWxlLWxpc3RfX2NhdGVnb3J5LXRpdGxlJyk7XHJcbiAgICBjb25zdCBkcm9wZG93bkxpc3QgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuc2NhbGUtbGlzdF9fY2F0ZWdvcnktbGlzdCcpO1xyXG4gICAgY29uc3QgZHJvcGRvd25BcnJvdyA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1hcnJvdycpO1xyXG4gICAgY2F0ZWdvcnlUaXRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgY2F0ZWdvcnlUaXRsZS5jbGFzc0xpc3QudG9nZ2xlKCdzY2FsZS1saXN0X19jYXRlZ29yeS10aXRsZS0tYWN0aXZlJyk7XHJcbiAgICAgIGRyb3Bkb3duTGlzdC5jbGFzc0xpc3QudG9nZ2xlKCdzY2FsZS1saXN0X19jYXRlZ29yeS1saXN0LS1oaWRkZW4nKTtcclxuICAgICAgZHJvcGRvd25BcnJvdy5jbGFzc0xpc3QudG9nZ2xlKCdkcm9wZG93bi1hcnJvdy0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5mb09mU2NhbGVTdGF0ZSgpIHtcclxuICBjb25zdCBbY2hvcmRPclNjYWxlLCAuLi5zY2FsZVR5cGVUb2tlbnNdID0gc2NhbGVTdGF0ZS5zcGxpdCgnLScpO1xyXG4gIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlVHlwZVRva2Vucy5qb2luKCcgJyk7XHJcbiAgcmV0dXJuIHsgY2hvcmRPclNjYWxlLCBzY2FsZVR5cGUgfTtcclxufVxyXG5cclxuXHJcbmNsYXNzIHNjYWxlQ29udHJvbGxlciB7XHJcbiAgc3RhdGljIGluaXQoKSB7XHJcbiAgICB0aGlzLmJ1dHRvbnMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnRuJyldO1xyXG4gICAgdGhpcy5jYXRlZ29yaWVzID0gWy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5JyldO1xyXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRDaG9yZE9yU2NhbGUoKSB7XHJcbiAgICBjb25zdCB7IGNob3JkT3JTY2FsZSB9ID0gZ2V0SW5mb09mU2NhbGVTdGF0ZSgpO1xyXG4gICAgcmV0dXJuIGNob3JkT3JTY2FsZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRTY2FsZVR5cGUoKSB7XHJcbiAgICBjb25zdCB7IHNjYWxlVHlwZSB9ID0gZ2V0SW5mb09mU2NhbGVTdGF0ZSgpO1xyXG4gICAgcmV0dXJuIHNjYWxlVHlwZTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNjYWxlQ29udHJvbGxlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcblxyXG5jb25zdCBzY2FsZURhdGEgPSByZXF1aXJlKCcuL2RhdGEvc2NhbGUtZGF0YScpO1xyXG5cclxuZnVuY3Rpb24gZ2V0U2NhbGVQYXR0ZXJuKHNjYWxlVHlwZSkge1xyXG4gIGNvbnN0IHBhdHRlcm4gPSBzY2FsZURhdGEucGF0dGVybnMuc2NhbGVzW3NjYWxlVHlwZV07XHJcbiAgaWYgKHBhdHRlcm4gPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xyXG4gIHJldHVybiBwYXR0ZXJuO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDaG9yZFBhdHRlcm4oc2NhbGVUeXBlKSB7XHJcbiAgY29uc3QgcGF0dGVybiA9IHNjYWxlRGF0YS5wYXR0ZXJucy5jaG9yZHNbc2NhbGVUeXBlXTtcclxuICBpZiAocGF0dGVybiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBhdHRlcm4oKSB7XHJcbiAgY29uc3QgY2hvcmRPclNjYWxlID0gU2NhbGVDb250cm9sbGVyLmdldENob3JkT3JTY2FsZSgpO1xyXG4gIGNvbnN0IHNjYWxlVHlwZSA9IFNjYWxlQ29udHJvbGxlci5nZXRTY2FsZVR5cGUoKTtcclxuICBsZXQgcGF0dGVybiA9IFtdO1xyXG4gIGlmIChjaG9yZE9yU2NhbGUgPT09ICdzY2FsZScpIHtcclxuICAgIHBhdHRlcm4gPSBnZXRTY2FsZVBhdHRlcm4oc2NhbGVUeXBlKTtcclxuICB9IGVsc2UgaWYgKGNob3JkT3JTY2FsZSA9PT0gJ2Nob3JkJykge1xyXG4gICAgcGF0dGVybiA9IGdldENob3JkUGF0dGVybihzY2FsZVR5cGUpO1xyXG4gIH1cclxuICByZXR1cm4gcGF0dGVybjtcclxufVxyXG5cclxuXHJcbmNsYXNzIHNjYWxlRGF0YWJhc2Uge1xyXG4gIHN0YXRpYyBnZXRQYXR0ZXJuT2ZTZWxlY3RlZFNjYWxlKCkge1xyXG4gICAgY29uc3Qgc2NhbGVQYXR0ZXJuID0gZ2V0UGF0dGVybigpO1xyXG4gICAgcmV0dXJuIHNjYWxlUGF0dGVybjtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2NhbGVEYXRhYmFzZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY2xhc3MgU2NhbGVEaXNwbGF5IHtcclxuICBzdGF0aWMgaW5pdCgpIHtcclxuICAgIHRoaXMuZG9tRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1kaXNwbGF5X190ZXh0LXBhbmVsJyk7XHJcbiAgICB0aGlzLmRvbUVsZW0udGV4dENvbnRlbnQgPSAnJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZXRUZXh0KHRleHQpIHtcclxuICAgIHRoaXMuZG9tRWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjYWxlRGlzcGxheTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY2xhc3MgVGltZXJNYW5hZ2VyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudGltZXJzID0gW107XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPOiBUYWtlIG9mZnNldCB0aW1lIGZyb20gc2V0dGluZ3NcclxuICBhZGRUaW1lcihjYWxsYmFjaywgb2Zmc2V0SW5kZXgpIHtcclxuICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dChjYWxsYmFjaywgMjAwICogb2Zmc2V0SW5kZXgpO1xyXG4gICAgdGhpcy50aW1lcnMucHVzaCh0aW1lcik7XHJcbiAgfVxyXG5cclxuICBjbGVhckFsbFRpbWVycygpIHtcclxuICAgIHRoaXMudGltZXJzLmZvckVhY2goKHRpbWVyKSA9PiB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICB9KTtcclxuICAgIHRoaXMudGltZXJzID0gW107XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyTWFuYWdlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGlzIG51bWJlciBpcyBpbmNsdWRlZFxuICogQHJldHVybnMge251bWJlcltdfVxuICovXG5mdW5jdGlvbiByYW5nZShzdGFydCwgZW5kKSB7XG4gIHJldHVybiBbLi4uQXJyYXkoZW5kIC0gc3RhcnQgKyAxKS5maWxsKCkubWFwKChfLCBpKSA9PiBpICsgMSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgcmFuZ2UgfTtcbiJdfQ==
