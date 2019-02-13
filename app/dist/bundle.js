(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const Keyboard = require('./keyboard');
const ScaleController = require('./scale-controller');
const ScaleDisplay = require('./scale-display');

ScaleController.init();
ScaleDisplay.init();

const test = new Keyboard();
test.setDisplayNameForAllKeysOfType('standard');

},{"./keyboard":3,"./scale-controller":6,"./scale-display":8}],2:[function(require,module,exports){
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

const nameToIDEnum = Object.freeze({
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

function determineKeyID(baseName) {
  const id = nameToIDEnum[baseName];
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

},{}],3:[function(require,module,exports){
'use strict';

const PianoKey = require('./piano-key');
const ScaleDisplay = require('./scale-display');
const ScaleController = require('./scale-controller');
const ScaleDatabase = require('./scale-database');
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
    this.disableHighlightingForAllKeys();
    this.enableHighlightingForRootKey(index);
    let iter = index;
    scalePattern.forEach((increment) => {
      iter += increment;
      const nextKey = this.keys[iter];
      if (nextKey === undefined) return;
      nextKey.enableHighlighting();
    });
  }

  setDisplayNameForAllKeysOfType(type) {
    this.keys.forEach((key) => {
      key.setDisplayNameOfType(type);
    });
  }
}

module.exports = Keyboard;

},{"./piano-key":5,"./scale-controller":6,"./scale-database":7,"./scale-display":8,"./util":9}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

const KeyName = require('./key-name');
const NameSanitizer = require('./name-sanitizer');

const highlightingClassNames = [
  'piano-key-highlight--white--root',
  'piano-key-highlight--black--root',
  'piano-key-highlight--white',
  'piano-key-highlight--black',
];

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

},{"./key-name":2,"./name-sanitizer":4}],6:[function(require,module,exports){
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

},{"./name-sanitizer":4,"./scale-display":8}],7:[function(require,module,exports){
'use strict';

const ScaleController = require('./scale-controller');

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

function getInfoOfScaleState(scaleState = '') {
  const [chordOrScale, ...scaleTypeTokens] = scaleState.split('-');
  const scaleType = scaleTypeTokens.join(' ');
  return [chordOrScale, scaleType];
}

function getScalePattern(scaleType) {
  const pattern = data.patterns.scales[scaleType];
  if (pattern === undefined) return [];
  return pattern;
}

function getChordPattern(scaleType) {
  const pattern = data.patterns.chords[scaleType];
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

},{"./scale-controller":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2luZGV4LmpzIiwiYXBwL3NyYy9rZXktbmFtZS5qcyIsImFwcC9zcmMva2V5Ym9hcmQuanMiLCJhcHAvc3JjL25hbWUtc2FuaXRpemVyLmpzIiwiYXBwL3NyYy9waWFuby1rZXkuanMiLCJhcHAvc3JjL3NjYWxlLWNvbnRyb2xsZXIuanMiLCJhcHAvc3JjL3NjYWxlLWRhdGFiYXNlLmpzIiwiYXBwL3NyYy9zY2FsZS1kaXNwbGF5LmpzIiwiYXBwL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuL2tleWJvYXJkJyk7XHJcbmNvbnN0IFNjYWxlQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vc2NhbGUtY29udHJvbGxlcicpO1xyXG5jb25zdCBTY2FsZURpc3BsYXkgPSByZXF1aXJlKCcuL3NjYWxlLWRpc3BsYXknKTtcclxuXHJcblNjYWxlQ29udHJvbGxlci5pbml0KCk7XHJcblNjYWxlRGlzcGxheS5pbml0KCk7XHJcblxyXG5jb25zdCB0ZXN0ID0gbmV3IEtleWJvYXJkKCk7XHJcbnRlc3Quc2V0RGlzcGxheU5hbWVGb3JBbGxLZXlzT2ZUeXBlKCdzdGFuZGFyZCcpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBrZXlOYW1lU2V0cyA9IHtcclxuICBzdGFuZGFyZDogWydDJywgJ0Pima8nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Lima0nLCAnQiddLFxyXG4gIHNoYXJwOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXHJcbiAgZmxhdDogWydDJywgJ0Tima0nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdH4pmtJywgJ0cnLCAnQeKZrScsICdBJywgJ0Lima0nLCAnQiddLFxyXG4gIGZpeGVkRG9TaGFycDogWydEbycsICdEaScsICdSZScsICdSaScsICdNaScsICdGYScsICdGaScsICdTbycsICdTaScsICdMYScsICdMaScsICdUaSddLFxyXG4gIGZpeGVkRG9GbGF0OiBbJ0RvJywgJ1JhJywgJ1JlJywgJ01lJywgJ01pJywgJ0ZhJywgJ1NlJywgJ1NvJywgJ0xlJywgJ0xhJywgJ1RlJywgJ1RpJ10sXHJcbiAgc3BlY2lhbEZTaGFycE06IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXHJcbiAgc3BlY2lhbENTaGFycE06IFsnQiMnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG59O1xyXG5cclxuY29uc3QgbmFtZVRvSURFbnVtID0gT2JqZWN0LmZyZWV6ZSh7XHJcbiAgJ0MnOiAwLFxyXG4gICdD4pmvJzogMSxcclxuICAnRCc6IDIsXHJcbiAgJ0Tima8nOiAzLFxyXG4gICdFJzogNCxcclxuICAnRic6IDUsXHJcbiAgJ0bima8nOiA2LFxyXG4gICdHJzogNyxcclxuICAnR+KZryc6IDgsXHJcbiAgJ0EnOiA5LFxyXG4gICdB4pmvJzogMTAsXHJcbiAgJ0InOiAxMSxcclxufSk7XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVLZXlJRChiYXNlTmFtZSkge1xyXG4gIGNvbnN0IGlkID0gbmFtZVRvSURFbnVtW2Jhc2VOYW1lXTtcclxuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIC0xO1xyXG4gIHJldHVybiBpZDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0S2V5TmFtZVNldCh0eXBlKSB7XHJcbiAgY29uc3Qga2V5TmFtZVNldCA9IGtleU5hbWVTZXRzW3R5cGVdO1xyXG4gIGlmIChrZXlOYW1lU2V0ID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICByZXR1cm4ga2V5TmFtZVNldDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCBrZXlJRCkge1xyXG4gIGNvbnN0IGFsaWFzT2ZTcGVjaWZpY1R5cGUgPSBrZXlOYW1lU2V0W2tleUlEXTtcclxuICBpZiAoYWxpYXNPZlNwZWNpZmljVHlwZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgcmV0dXJuIGFsaWFzT2ZTcGVjaWZpY1R5cGU7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBLZXlOYW1lIHtcclxuICBjb25zdHJ1Y3RvcihiYXNlTmFtZSkge1xyXG4gICAgdGhpcy5pZCA9IGRldGVybWluZUtleUlEKGJhc2VOYW1lKTtcclxuICB9XHJcblxyXG4gIGdldEFsaWFzT2ZUeXBlKHR5cGUpIHtcclxuICAgIGNvbnN0IGtleU5hbWVTZXQgPSBnZXRLZXlOYW1lU2V0KHR5cGUpO1xyXG4gICAgY29uc3QgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwgdGhpcy5pZCk7XHJcbiAgICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5TmFtZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgUGlhbm9LZXkgPSByZXF1aXJlKCcuL3BpYW5vLWtleScpO1xyXG5jb25zdCBTY2FsZURpc3BsYXkgPSByZXF1aXJlKCcuL3NjYWxlLWRpc3BsYXknKTtcclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcbmNvbnN0IFNjYWxlRGF0YWJhc2UgPSByZXF1aXJlKCcuL3NjYWxlLWRhdGFiYXNlJyk7XHJcbmNvbnN0IHsgcmFuZ2UgfSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xyXG5cclxuY29uc3QgcGlhbm9LZXlOYW1lcyA9IFsnYycsICdjLXNoYXJwJywgJ2QnLCAnZC1zaGFycCcsICdlJyxcclxuICAnZicsICdmLXNoYXJwJywgJ2cnLCAnZy1zaGFycCcsICdhJywgJ2Etc2hhcnAnLCAnYiddO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVLZXlOYW1lRG9tSURzKCkge1xyXG4gIGNvbnN0IGtleU5hbWVzV2l0aE9jdGF2ZXMgPSBbXTtcclxuICBjb25zdCBOVU1fT0ZfT0NUQVZFUyA9IDM7XHJcbiAgcmFuZ2UoMSwgTlVNX09GX09DVEFWRVMpLmZvckVhY2goKG9jdGF2ZSkgPT4ge1xyXG4gICAgcGlhbm9LZXlOYW1lcy5mb3JFYWNoKChuYW1lKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5hbWVXaXRoT2N0YXZlID0gbmFtZSArIG9jdGF2ZTtcclxuICAgICAga2V5TmFtZXNXaXRoT2N0YXZlcy5wdXNoKG5hbWVXaXRoT2N0YXZlKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBrZXlOYW1lc1dpdGhPY3RhdmVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQaWFub0tleXNVc2luZ0RvbUlEcyhrZXlOYW1lSURzID0gW10pIHtcclxuICBjb25zdCBwaWFub0tleU5vZGVzID0gW107XHJcbiAga2V5TmFtZUlEcy5mb3JFYWNoKChpZCwga2V5SW5kZXgpID0+IHtcclxuICAgIGNvbnN0IHBpYW5vS2V5ID0gbmV3IFBpYW5vS2V5KGlkLCBrZXlJbmRleCk7XHJcbiAgICBwaWFub0tleU5vZGVzLnB1c2gocGlhbm9LZXkpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBwaWFub0tleU5vZGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQaWFub0tleXMoKSB7XHJcbiAgY29uc3Qga2V5TmFtZUlEcyA9IGdlbmVyYXRlS2V5TmFtZURvbUlEcygpO1xyXG4gIGNvbnN0IHBpYW5vS2V5cyA9IGdldFBpYW5vS2V5c1VzaW5nRG9tSURzKGtleU5hbWVJRHMpO1xyXG4gIHJldHVybiBwaWFub0tleXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMoa2V5Ym9hcmQpIHtcclxuICBrZXlib2FyZC5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBldmVudFNvdXJjZSA9IGtleWJvYXJkLmtleXMuZmluZChpdGVtID0+IGl0ZW0uZ2V0RG9tTm9kZSgpID09PSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmtleWJvYXJkX19rZXknKSk7XHJcbiAgICBpZiAoZXZlbnRTb3VyY2UgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgY29uc3QgaW5kZXggPSBldmVudFNvdXJjZS5nZXRLZXlJbmRleCgpO1xyXG4gICAga2V5Ym9hcmQuZGlzcGxheVNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuY2xhc3MgS2V5Ym9hcmQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmtleWJvYXJkJyk7XHJcbiAgICB0aGlzLmtleXMgPSBnZXRQaWFub0tleXMoKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlnaGxpZ2h0aW5nRm9yQWxsS2V5cygpIHtcclxuICAgIHRoaXMua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAga2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlnaGxpZ2h0aW5nRm9yUm9vdEtleShpbmRleE9mUm9vdCkge1xyXG4gICAgY29uc3Qgcm9vdEtleSA9IHRoaXMua2V5c1tpbmRleE9mUm9vdF07XHJcbiAgICBjb25zdCBpc1Jvb3RLZXkgPSB0cnVlO1xyXG4gICAgcm9vdEtleS5lbmFibGVIaWdobGlnaHRpbmcoaXNSb290S2V5KTtcclxuICB9XHJcblxyXG4gIGRpc3BsYXlTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KSB7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSBTY2FsZURhdGFiYXNlLmdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKTtcclxuICAgIGlmIChzY2FsZVBhdHRlcm4ubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLmRpc2FibGVIaWdobGlnaHRpbmdGb3JBbGxLZXlzKCk7XHJcbiAgICB0aGlzLmVuYWJsZUhpZ2hsaWdodGluZ0ZvclJvb3RLZXkoaW5kZXgpO1xyXG4gICAgbGV0IGl0ZXIgPSBpbmRleDtcclxuICAgIHNjYWxlUGF0dGVybi5mb3JFYWNoKChpbmNyZW1lbnQpID0+IHtcclxuICAgICAgaXRlciArPSBpbmNyZW1lbnQ7XHJcbiAgICAgIGNvbnN0IG5leHRLZXkgPSB0aGlzLmtleXNbaXRlcl07XHJcbiAgICAgIGlmIChuZXh0S2V5ID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgICAgbmV4dEtleS5lbmFibGVIaWdobGlnaHRpbmcoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheU5hbWVGb3JBbGxLZXlzT2ZUeXBlKHR5cGUpIHtcclxuICAgIHRoaXMua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAga2V5LnNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBOYW1lU2FuaXRpemVyID0ge1xyXG5cclxuICAvKiAnYnRuLXNjYWxlLW1ham9yJyAtPiAnc2NhbGUtbWFqb3InICovXHJcbiAgY29udmVydEJ1dHRvbklEVG9TdGF0ZU5hbWUoYnV0dG9uSUQpIHtcclxuICAgIGlmIChidXR0b25JRCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgICBjb25zdCBzdGF0ZU5hbWUgPSBidXR0b25JRC5zdWJzdHJpbmcoNCk7XHJcbiAgICByZXR1cm4gc3RhdGVOYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJ2Pima8nICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb0tleU5hbWVCYXNlTmFtZShwaWFub0tleURvbUlEKSB7XHJcbiAgICBpZiAocGlhbm9LZXlEb21JRCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgICBjb25zdCB0cmltbWVkTmFtZSA9IHBpYW5vS2V5RG9tSUQuc2xpY2UoMCwgLTEpO1xyXG4gICAgY29uc3Qga2V5TmFtZUJhc2VOYW1lID0gdHJpbW1lZE5hbWUucmVwbGFjZSgnLXNoYXJwJywgJ+KZrycpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICByZXR1cm4ga2V5TmFtZUJhc2VOYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJzEnICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb09jdGF2ZU51bWJlcihwaWFub0tleURvbUlEKSB7XHJcbiAgICByZXR1cm4gcGlhbm9LZXlEb21JRC5zbGljZSgtMSk7XHJcbiAgfSxcclxuXHJcbiAgLyogJ2Mtc2hhcnAxJyAtPiAnYmxhY2snICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb0NvbG9yKHBpYW5vS2V5RG9tSUQpIHtcclxuICAgIHJldHVybiAocGlhbm9LZXlEb21JRC5pbmRleE9mKCdzaGFycCcpICE9PSAtMSkgPyAnYmxhY2snIDogJ3doaXRlJztcclxuICB9LFxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmFtZVNhbml0aXplcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgS2V5TmFtZSA9IHJlcXVpcmUoJy4va2V5LW5hbWUnKTtcclxuY29uc3QgTmFtZVNhbml0aXplciA9IHJlcXVpcmUoJy4vbmFtZS1zYW5pdGl6ZXInKTtcclxuXHJcbmNvbnN0IGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMgPSBbXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JyxcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2stLXJvb3QnLFxyXG4gICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScsXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJyxcclxuXTtcclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZUNvbG9yKGRvbUlEKSB7XHJcbiAgcmV0dXJuIE5hbWVTYW5pdGl6ZXIuY29udmVydFBpYW5vS2V5RG9tSURUb0NvbG9yKGRvbUlEKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpIHtcclxuICBjb25zdCBrZXlOYW1lQmFzZU5hbWUgPSBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9LZXlOYW1lQmFzZU5hbWUoZG9tSUQpO1xyXG4gIGNvbnN0IGtleU5hbWUgPSBuZXcgS2V5TmFtZShrZXlOYW1lQmFzZU5hbWUpO1xyXG4gIHJldHVybiBrZXlOYW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVPY3RhdmUoZG9tSUQpIHtcclxuICByZXR1cm4gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvT2N0YXZlTnVtYmVyKGRvbUlEKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkTW91c2VMaXN0ZW5lcihwaWFub0tleSkge1xyXG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xyXG4gICAgaWYgKHBpYW5vS2V5LmlzSGlnaGxpZ2h0ZWQoKSkgcmV0dXJuO1xyXG4gICAgcGlhbm9LZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKHRydWUpO1xyXG4gICAgZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xyXG4gICAgICBwaWFub0tleS5kaXNhYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCksIDApO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvdWNoTGlzdGVuZXIocGlhbm9LZXkpIHtcclxuICBwaWFub0tleS5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoKSA9PiB7XHJcbiAgICBpZiAocGlhbm9LZXkuaXNIaWdobGlnaHRlZCgpKSByZXR1cm47XHJcbiAgICBwaWFub0tleS5lbmFibGVIaWdobGlnaHRpbmcodHJ1ZSk7XHJcbiAgICBmdW5jdGlvbiBvblRvdWNoRW5kKCkge1xyXG4gICAgICBwaWFub0tleS5kaXNhYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKSwgMCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHBpYW5vS2V5KSB7XHJcbiAgYWRkTW91c2VMaXN0ZW5lcihwaWFub0tleSk7XHJcbiAgYWRkVG91Y2hMaXN0ZW5lcihwaWFub0tleSk7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBQaWFub0tleSB7XHJcbiAgY29uc3RydWN0b3IoZG9tSUQsIGtleUluZGV4KSB7XHJcbiAgICB0aGlzLmluZGV4ID0ga2V5SW5kZXg7XHJcbiAgICB0aGlzLm5hbWVzID0gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpO1xyXG4gICAgdGhpcy5jb2xvciA9IGRldGVybWluZUNvbG9yKGRvbUlEKTtcclxuICAgIHRoaXMub2N0YXZlID0gZGV0ZXJtaW5lT2N0YXZlKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fa2V5LW5hbWUnKTtcclxuICAgIHRoaXMuZG9tRmluZ2VyaW5nVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19maW5nZXJpbmcnKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBpc0hpZ2hsaWdodGVkKCkge1xyXG4gICAgbGV0IGlzSGlnaGxpZ2h0ZWQgPSBmYWxzZTtcclxuICAgIGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcclxuICAgICAgICBpc0hpZ2hsaWdodGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gaXNIaWdobGlnaHRlZDtcclxuICB9XHJcblxyXG4gIGVuYWJsZUhpZ2hsaWdodGluZyhpc1Jvb3RLZXkgPSBmYWxzZSkge1xyXG4gICAgbGV0IGhpZ2hsaWdodENsYXNzTmFtZSA9ICcnO1xyXG4gICAgaWYgKGlzUm9vdEtleSkge1xyXG4gICAgICBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjay0tcm9vdCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjayc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmFkZChoaWdobGlnaHRDbGFzc05hbWUpO1xyXG4gIH1cclxuXHJcbiAgZGlzYWJsZUhpZ2hsaWdodGluZygpIHtcclxuICAgIGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XHJcbiAgICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldEN1c3RvbURpc3BsYXlOYW1lKG5hbWUpIHtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gbmFtZTtcclxuICB9XHJcblxyXG4gIHNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpIHtcclxuICAgIGNvbnN0IGFsaWFzID0gdGhpcy5uYW1lcy5nZXRBbGlhc09mVHlwZSh0eXBlKTtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gYWxpYXM7XHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50TmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudDtcclxuICB9XHJcblxyXG4gIGdldEtleUluZGV4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5kZXg7XHJcbiAgfVxyXG5cclxuICBnZXREb21Ob2RlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZG9tTm9kZTtcclxuICB9XHJcblxyXG4gIHJlc2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAvLyBUT0RPOiBHZXQgZGVmYXVsdCB0eXBlIGZyb20gc2V0dGluZ3Mgb2JqZWN0XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGlhbm9LZXk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IE5hbWVTYW5pdGl6ZXIgPSByZXF1aXJlKCcuL25hbWUtc2FuaXRpemVyJyk7XHJcbmNvbnN0IFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xyXG5cclxubGV0IHNjYWxlU3RhdGUgPSAnJztcclxuXHJcbmZ1bmN0aW9uIGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidXR0b25FbGVtKSB7XHJcbiAgY29uc3QgYnV0dG9uSUQgPSBidXR0b25FbGVtLmlkO1xyXG4gIGNvbnN0IHN0YXRlTmFtZSA9IE5hbWVTYW5pdGl6ZXIuY29udmVydEJ1dHRvbklEVG9TdGF0ZU5hbWUoYnV0dG9uSUQpO1xyXG4gIHJldHVybiBzdGF0ZU5hbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEhpZ2hsaWdodE9uQnV0dG9uKGJ0bikge1xyXG4gIGJ0bi5jbGFzc0xpc3QuYWRkKCdidG4tLXNlbGVjdGVkJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0SGlnaGxpZ2h0T25BbGxCdXR0b25zKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIHNjYWxlQ29udHJvbGxlci5idXR0b25zLmZvckVhY2goKGJ0bikgPT4ge1xyXG4gICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi0tc2VsZWN0ZWQnKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBzY2FsZUNvbnRyb2xsZXIuYnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgc2NhbGVTdGF0ZSA9IGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidG4pO1xyXG4gICAgICByZXNldEhpZ2hsaWdodE9uQWxsQnV0dG9ucyhzY2FsZUNvbnRyb2xsZXIpO1xyXG4gICAgICBhZGRIaWdobGlnaHRPbkJ1dHRvbihidG4pO1xyXG4gICAgICBTY2FsZURpc3BsYXkuc2V0VGV4dChzY2FsZVN0YXRlKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBzY2FsZUNvbnRyb2xsZXIuY2F0ZWdvcmllcy5mb3JFYWNoKChjYXRlZ29yeSkgPT4ge1xyXG4gICAgY29uc3QgY2F0ZWdvcnlUaXRsZSA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1saXN0X19jYXRlZ29yeS10aXRsZScpO1xyXG4gICAgY29uc3QgZHJvcGRvd25MaXN0ID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLnNjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QnKTtcclxuICAgIGNvbnN0IGRyb3Bkb3duQXJyb3cgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tYXJyb3cnKTtcclxuICAgIGNhdGVnb3J5VGl0bGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIGNhdGVnb3J5VGl0bGUuY2xhc3NMaXN0LnRvZ2dsZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnktdGl0bGUtLWFjdGl2ZScpO1xyXG4gICAgICBkcm9wZG93bkxpc3QuY2xhc3NMaXN0LnRvZ2dsZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnktbGlzdC0taGlkZGVuJyk7XHJcbiAgICAgIGRyb3Bkb3duQXJyb3cuY2xhc3NMaXN0LnRvZ2dsZSgnZHJvcGRvd24tYXJyb3ctLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBzY2FsZUNvbnRyb2xsZXIge1xyXG4gIHN0YXRpYyBpbml0KCkge1xyXG4gICAgdGhpcy5idXR0b25zID0gWy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J0bicpXTtcclxuICAgIHRoaXMuY2F0ZWdvcmllcyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzY2FsZS1saXN0X19jYXRlZ29yeScpXTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0U2NhbGVTdGF0ZSgpIHtcclxuICAgIHJldHVybiBzY2FsZVN0YXRlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2NhbGVDb250cm9sbGVyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuXHJcbmNvbnN0IGRhdGEgPSB7XHJcbiAgcGF0dGVybnM6IHtcclxuICAgIHNjYWxlczoge1xyXG4gICAgICAnbWFqb3InOiBbMiwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICdtaW5vcic6IFsyLCAxLCAyLCAyLCAxLCAyXSxcclxuICAgICAgJ2hhcm1vbmljIG1pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAnbWVsb2RpYyBtaW5vcic6IFsyLCAxLCAyLCAyLCAyLCAyXSxcclxuXHJcbiAgICB9LFxyXG4gICAgY2hvcmRzOiB7XHJcbiAgICAgICdtYWpvcic6IFs0LCAzXSxcclxuICAgICAgJ21pbm9yJzogWzMsIDRdLFxyXG4gICAgICAnZGltaW5pc2hlZCc6IFszLCAzXSxcclxuICAgICAgJ2F1Z21lbnRlZCc6IFs0LCA0XSxcclxuICAgICAgJ3N1c3BlbmRlZDInOiBbMiwgNV0sXHJcbiAgICAgICdzdXNwZW5kZWQ0JzogWzUsIDJdLFxyXG4gICAgfSxcclxuICB9LFxyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2V0SW5mb09mU2NhbGVTdGF0ZShzY2FsZVN0YXRlID0gJycpIHtcclxuICBjb25zdCBbY2hvcmRPclNjYWxlLCAuLi5zY2FsZVR5cGVUb2tlbnNdID0gc2NhbGVTdGF0ZS5zcGxpdCgnLScpO1xyXG4gIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlVHlwZVRva2Vucy5qb2luKCcgJyk7XHJcbiAgcmV0dXJuIFtjaG9yZE9yU2NhbGUsIHNjYWxlVHlwZV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNjYWxlUGF0dGVybihzY2FsZVR5cGUpIHtcclxuICBjb25zdCBwYXR0ZXJuID0gZGF0YS5wYXR0ZXJucy5zY2FsZXNbc2NhbGVUeXBlXTtcclxuICBpZiAocGF0dGVybiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENob3JkUGF0dGVybihzY2FsZVR5cGUpIHtcclxuICBjb25zdCBwYXR0ZXJuID0gZGF0YS5wYXR0ZXJucy5jaG9yZHNbc2NhbGVUeXBlXTtcclxuICBpZiAocGF0dGVybiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBhdHRlcm4oc2NhbGVJbmZvKSB7XHJcbiAgY29uc3QgW2Nob3JkT3JTY2FsZSwgc2NhbGVUeXBlXSA9IHNjYWxlSW5mbztcclxuICBsZXQgcGF0dGVybiA9IFtdO1xyXG4gIGlmIChjaG9yZE9yU2NhbGUgPT09ICdzY2FsZScpIHtcclxuICAgIHBhdHRlcm4gPSBnZXRTY2FsZVBhdHRlcm4oc2NhbGVUeXBlKTtcclxuICB9IGVsc2UgaWYgKGNob3JkT3JTY2FsZSA9PT0gJ2Nob3JkJykge1xyXG4gICAgcGF0dGVybiA9IGdldENob3JkUGF0dGVybihzY2FsZVR5cGUpO1xyXG4gIH1cclxuICByZXR1cm4gcGF0dGVybjtcclxufVxyXG5cclxuY2xhc3Mgc2NhbGVEYXRhYmFzZSB7XHJcbiAgc3RhdGljIGdldFBhdHRlcm5PZihzY2FsZVN0YXRlID0gJycpIHtcclxuICAgIGNvbnN0IHNjYWxlSW5mbyA9IGdldEluZm9PZlNjYWxlU3RhdGUoc2NhbGVTdGF0ZSk7XHJcbiAgICBjb25zdCBwYXR0ZXJuID0gZ2V0UGF0dGVybihzY2FsZUluZm8pO1xyXG4gICAgcmV0dXJuIHBhdHRlcm47XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0UGF0dGVybk9mU2VsZWN0ZWRTY2FsZSgpIHtcclxuICAgIGNvbnN0IHNjYWxlU3RhdGUgPSBTY2FsZUNvbnRyb2xsZXIuZ2V0U2NhbGVTdGF0ZSgpO1xyXG4gICAgY29uc3Qgc2NhbGVQYXR0ZXJuID0gdGhpcy5nZXRQYXR0ZXJuT2Yoc2NhbGVTdGF0ZSk7XHJcbiAgICByZXR1cm4gc2NhbGVQYXR0ZXJuO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzY2FsZURhdGFiYXNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jbGFzcyBTY2FsZURpc3BsYXkge1xyXG4gIHN0YXRpYyBpbml0KCkge1xyXG4gICAgdGhpcy5kb21FbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjYWxlLWRpc3BsYXlfX3RleHQtcGFuZWwnKTtcclxuICAgIHRoaXMuZG9tRWxlbS50ZXh0Q29udGVudCA9ICcnO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNldFRleHQodGV4dCkge1xyXG4gICAgdGhpcy5kb21FbGVtLnRleHRDb250ZW50ID0gdGV4dDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NhbGVEaXNwbGF5O1xyXG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0XG4gKiBAcGFyYW0ge251bWJlcn0gZW5kIFRoaXMgbnVtYmVyIGlzIGluY2x1ZGVkXG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIFsuLi5BcnJheShlbmQgLSBzdGFydCArIDEpLmZpbGwoKS5tYXAoKF8sIGkpID0+IGkgKyAxKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyByYW5nZSB9O1xuIl19
