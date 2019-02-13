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

},{"./piano-key":9,"./scale-controller":10,"./scale-database":11,"./scale-display":12,"./util":13}],8:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzLmpzIiwiYXBwL3NyYy9kYXRhL2tleS1uYW1lLXNldHMuanMiLCJhcHAvc3JjL2RhdGEva2V5LW5hbWUtdG8taWQtZW51bS5qcyIsImFwcC9zcmMvZGF0YS9zY2FsZS1kYXRhLmpzIiwiYXBwL3NyYy9pbmRleC5qcyIsImFwcC9zcmMva2V5LW5hbWUuanMiLCJhcHAvc3JjL2tleWJvYXJkLmpzIiwiYXBwL3NyYy9uYW1lLXNhbml0aXplci5qcyIsImFwcC9zcmMvcGlhbm8ta2V5LmpzIiwiYXBwL3NyYy9zY2FsZS1jb250cm9sbGVyLmpzIiwiYXBwL3NyYy9zY2FsZS1kYXRhYmFzZS5qcyIsImFwcC9zcmMvc2NhbGUtZGlzcGxheS5qcyIsImFwcC9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMgPSBbXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JyxcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2stLXJvb3QnLFxyXG4gICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScsXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJyxcclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qga2V5TmFtZVNldHMgPSB7XHJcbiAgc3RhbmRhcmQ6IFsnQycsICdD4pmvJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdC4pmtJywgJ0InXSxcclxuICBzaGFycDogWydDJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG4gIGZsYXQ6IFsnQycsICdE4pmtJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnR+KZrScsICdHJywgJ0Hima0nLCAnQScsICdC4pmtJywgJ0InXSxcclxuICBmaXhlZERvU2hhcnA6IFsnRG8nLCAnRGknLCAnUmUnLCAnUmknLCAnTWknLCAnRmEnLCAnRmknLCAnU28nLCAnU2knLCAnTGEnLCAnTGknLCAnVGknXSxcclxuICBmaXhlZERvRmxhdDogWydEbycsICdSYScsICdSZScsICdNZScsICdNaScsICdGYScsICdTZScsICdTbycsICdMZScsICdMYScsICdUZScsICdUaSddLFxyXG4gIHNwZWNpYWxGU2hhcnBNOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG4gIHNwZWNpYWxDU2hhcnBNOiBbJ0IjJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRSMnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga2V5TmFtZVNldHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGtleU5hbWVUb0lERW51bSA9IE9iamVjdC5mcmVlemUoe1xyXG4gICdDJzogMCxcclxuICAnQ+KZryc6IDEsXHJcbiAgJ0QnOiAyLFxyXG4gICdE4pmvJzogMyxcclxuICAnRSc6IDQsXHJcbiAgJ0YnOiA1LFxyXG4gICdG4pmvJzogNixcclxuICAnRyc6IDcsXHJcbiAgJ0fima8nOiA4LFxyXG4gICdBJzogOSxcclxuICAnQeKZryc6IDEwLFxyXG4gICdCJzogMTEsXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlOYW1lVG9JREVudW07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGRhdGEgPSB7XHJcbiAgcGF0dGVybnM6IHtcclxuICAgIHNjYWxlczoge1xyXG4gICAgICAnbWFqb3InOiBbMiwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICdtaW5vcic6IFsyLCAxLCAyLCAyLCAxLCAyXSxcclxuICAgICAgJ2hhcm1vbmljIG1pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAnbWVsb2RpYyBtaW5vcic6IFsyLCAxLCAyLCAyLCAyLCAyXSxcclxuXHJcbiAgICB9LFxyXG4gICAgY2hvcmRzOiB7XHJcbiAgICAgICdtYWpvcic6IFs0LCAzXSxcclxuICAgICAgJ21pbm9yJzogWzMsIDRdLFxyXG4gICAgICAnZGltaW5pc2hlZCc6IFszLCAzXSxcclxuICAgICAgJ2F1Z21lbnRlZCc6IFs0LCA0XSxcclxuICAgICAgJ3N1c3BlbmRlZDInOiBbMiwgNV0sXHJcbiAgICAgICdzdXNwZW5kZWQ0JzogWzUsIDJdLFxyXG4gICAgfSxcclxuICB9LFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkYXRhO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBLZXlib2FyZCA9IHJlcXVpcmUoJy4va2V5Ym9hcmQnKTtcclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcbmNvbnN0IFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xyXG5cclxuU2NhbGVDb250cm9sbGVyLmluaXQoKTtcclxuU2NhbGVEaXNwbGF5LmluaXQoKTtcclxuXHJcbmNvbnN0IHRlc3QgPSBuZXcgS2V5Ym9hcmQoKTtcclxudGVzdC5zZXREaXNwbGF5TmFtZUZvckFsbEtleXNPZlR5cGUoJ3N0YW5kYXJkJyk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGtleU5hbWVTZXRzID0gcmVxdWlyZSgnLi9kYXRhL2tleS1uYW1lLXNldHMnKTtcclxuY29uc3Qga2V5TmFtZVRvSURFbnVtID0gcmVxdWlyZSgnLi9kYXRhL2tleS1uYW1lLXRvLWlkLWVudW0nKTtcclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZUtleUlEKGJhc2VOYW1lKSB7XHJcbiAgY29uc3QgaWQgPSBrZXlOYW1lVG9JREVudW1bYmFzZU5hbWVdO1xyXG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gLTE7XHJcbiAgcmV0dXJuIGlkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRLZXlOYW1lU2V0KHR5cGUpIHtcclxuICBjb25zdCBrZXlOYW1lU2V0ID0ga2V5TmFtZVNldHNbdHlwZV07XHJcbiAgaWYgKGtleU5hbWVTZXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gIHJldHVybiBrZXlOYW1lU2V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbGlhc09mU3BlY2lmaWNUeXBlKGtleU5hbWVTZXQsIGtleUlEKSB7XHJcbiAgY29uc3QgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGtleU5hbWVTZXRba2V5SURdO1xyXG4gIGlmIChhbGlhc09mU3BlY2lmaWNUeXBlID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcclxufVxyXG5cclxuXHJcbmNsYXNzIEtleU5hbWUge1xyXG4gIGNvbnN0cnVjdG9yKGJhc2VOYW1lKSB7XHJcbiAgICB0aGlzLmlkID0gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxpYXNPZlR5cGUodHlwZSkge1xyXG4gICAgY29uc3Qga2V5TmFtZVNldCA9IGdldEtleU5hbWVTZXQodHlwZSk7XHJcbiAgICBjb25zdCBhbGlhc09mU3BlY2lmaWNUeXBlID0gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCB0aGlzLmlkKTtcclxuICAgIHJldHVybiBhbGlhc09mU3BlY2lmaWNUeXBlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlOYW1lO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBQaWFub0tleSA9IHJlcXVpcmUoJy4vcGlhbm8ta2V5Jyk7XHJcbmNvbnN0IFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuY29uc3QgU2NhbGVEYXRhYmFzZSA9IHJlcXVpcmUoJy4vc2NhbGUtZGF0YWJhc2UnKTtcclxuY29uc3QgeyByYW5nZSB9ID0gcmVxdWlyZSgnLi91dGlsJyk7XHJcblxyXG5jb25zdCBwaWFub0tleU5hbWVzID0gWydjJywgJ2Mtc2hhcnAnLCAnZCcsICdkLXNoYXJwJywgJ2UnLFxyXG4gICdmJywgJ2Ytc2hhcnAnLCAnZycsICdnLXNoYXJwJywgJ2EnLCAnYS1zaGFycCcsICdiJ107XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZUtleU5hbWVEb21JRHMoKSB7XHJcbiAgY29uc3Qga2V5TmFtZXNXaXRoT2N0YXZlcyA9IFtdO1xyXG4gIGNvbnN0IE5VTV9PRl9PQ1RBVkVTID0gMztcclxuICByYW5nZSgxLCBOVU1fT0ZfT0NUQVZFUykuZm9yRWFjaCgob2N0YXZlKSA9PiB7XHJcbiAgICBwaWFub0tleU5hbWVzLmZvckVhY2goKG5hbWUpID0+IHtcclxuICAgICAgY29uc3QgbmFtZVdpdGhPY3RhdmUgPSBuYW1lICsgb2N0YXZlO1xyXG4gICAgICBrZXlOYW1lc1dpdGhPY3RhdmVzLnB1c2gobmFtZVdpdGhPY3RhdmUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGtleU5hbWVzV2l0aE9jdGF2ZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBpYW5vS2V5c1VzaW5nRG9tSURzKGtleU5hbWVJRHMgPSBbXSkge1xyXG4gIGNvbnN0IHBpYW5vS2V5Tm9kZXMgPSBbXTtcclxuICBrZXlOYW1lSURzLmZvckVhY2goKGlkLCBrZXlJbmRleCkgPT4ge1xyXG4gICAgY29uc3QgcGlhbm9LZXkgPSBuZXcgUGlhbm9LZXkoaWQsIGtleUluZGV4KTtcclxuICAgIHBpYW5vS2V5Tm9kZXMucHVzaChwaWFub0tleSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHBpYW5vS2V5Tm9kZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBpYW5vS2V5cygpIHtcclxuICBjb25zdCBrZXlOYW1lSURzID0gZ2VuZXJhdGVLZXlOYW1lRG9tSURzKCk7XHJcbiAgY29uc3QgcGlhbm9LZXlzID0gZ2V0UGlhbm9LZXlzVXNpbmdEb21JRHMoa2V5TmFtZUlEcyk7XHJcbiAgcmV0dXJuIHBpYW5vS2V5cztcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhrZXlib2FyZCkge1xyXG4gIGtleWJvYXJkLmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGV2ZW50U291cmNlID0ga2V5Ym9hcmQua2V5cy5maW5kKGl0ZW0gPT4gaXRlbS5nZXREb21Ob2RlKCkgPT09IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcua2V5Ym9hcmRfX2tleScpKTtcclxuICAgIGlmIChldmVudFNvdXJjZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICBjb25zdCBpbmRleCA9IGV2ZW50U291cmNlLmdldEtleUluZGV4KCk7XHJcbiAgICBrZXlib2FyZC5kaXNwbGF5U2NhbGVTdGFydGluZ0Zyb21JbmRleChpbmRleCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBLZXlib2FyZCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmRvbU5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmQnKTtcclxuICAgIHRoaXMua2V5cyA9IGdldFBpYW5vS2V5cygpO1xyXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcclxuICB9XHJcblxyXG4gIGRpc2FibGVIaWdobGlnaHRpbmdGb3JBbGxLZXlzKCkge1xyXG4gICAgdGhpcy5rZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICBrZXkuZGlzYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBlbmFibGVIaWdobGlnaHRpbmdGb3JSb290S2V5KGluZGV4T2ZSb290KSB7XHJcbiAgICBjb25zdCByb290S2V5ID0gdGhpcy5rZXlzW2luZGV4T2ZSb290XTtcclxuICAgIGNvbnN0IGlzUm9vdEtleSA9IHRydWU7XHJcbiAgICByb290S2V5LmVuYWJsZUhpZ2hsaWdodGluZyhpc1Jvb3RLZXkpO1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheVNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpIHtcclxuICAgIGNvbnN0IHNjYWxlUGF0dGVybiA9IFNjYWxlRGF0YWJhc2UuZ2V0UGF0dGVybk9mU2VsZWN0ZWRTY2FsZSgpO1xyXG4gICAgaWYgKHNjYWxlUGF0dGVybi5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgIHRoaXMuZGlzYWJsZUhpZ2hsaWdodGluZ0ZvckFsbEtleXMoKTtcclxuICAgIHRoaXMuZW5hYmxlSGlnaGxpZ2h0aW5nRm9yUm9vdEtleShpbmRleCk7XHJcbiAgICBsZXQgaXRlciA9IGluZGV4O1xyXG4gICAgc2NhbGVQYXR0ZXJuLmZvckVhY2goKGluY3JlbWVudCkgPT4ge1xyXG4gICAgICBpdGVyICs9IGluY3JlbWVudDtcclxuICAgICAgY29uc3QgbmV4dEtleSA9IHRoaXMua2V5c1tpdGVyXTtcclxuICAgICAgaWYgKG5leHRLZXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICBuZXh0S2V5LmVuYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXREaXNwbGF5TmFtZUZvckFsbEtleXNPZlR5cGUodHlwZSkge1xyXG4gICAgdGhpcy5rZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICBrZXkuc2V0RGlzcGxheU5hbWVPZlR5cGUodHlwZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IE5hbWVTYW5pdGl6ZXIgPSB7XHJcblxyXG4gIC8qICdidG4tc2NhbGUtbWFqb3InIC0+ICdzY2FsZS1tYWpvcicgKi9cclxuICBjb252ZXJ0QnV0dG9uSURUb1N0YXRlTmFtZShidXR0b25JRCkge1xyXG4gICAgaWYgKGJ1dHRvbklEID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICAgIGNvbnN0IHN0YXRlTmFtZSA9IGJ1dHRvbklELnN1YnN0cmluZyg0KTtcclxuICAgIHJldHVybiBzdGF0ZU5hbWU7XHJcbiAgfSxcclxuXHJcbiAgLyogJ2Mtc2hhcnAxJyAtPiAnY+KZrycgKi9cclxuICBjb252ZXJ0UGlhbm9LZXlEb21JRFRvS2V5TmFtZUJhc2VOYW1lKHBpYW5vS2V5RG9tSUQpIHtcclxuICAgIGlmIChwaWFub0tleURvbUlEID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICAgIGNvbnN0IHRyaW1tZWROYW1lID0gcGlhbm9LZXlEb21JRC5zbGljZSgwLCAtMSk7XHJcbiAgICBjb25zdCBrZXlOYW1lQmFzZU5hbWUgPSB0cmltbWVkTmFtZS5yZXBsYWNlKCctc2hhcnAnLCAn4pmvJykudG9VcHBlckNhc2UoKTtcclxuICAgIHJldHVybiBrZXlOYW1lQmFzZU5hbWU7XHJcbiAgfSxcclxuXHJcbiAgLyogJ2Mtc2hhcnAxJyAtPiAnMScgKi9cclxuICBjb252ZXJ0UGlhbm9LZXlEb21JRFRvT2N0YXZlTnVtYmVyKHBpYW5vS2V5RG9tSUQpIHtcclxuICAgIHJldHVybiBwaWFub0tleURvbUlELnNsaWNlKC0xKTtcclxuICB9LFxyXG5cclxuICAvKiAnYy1zaGFycDEnIC0+ICdibGFjaycgKi9cclxuICBjb252ZXJ0UGlhbm9LZXlEb21JRFRvQ29sb3IocGlhbm9LZXlEb21JRCkge1xyXG4gICAgcmV0dXJuIChwaWFub0tleURvbUlELmluZGV4T2YoJ3NoYXJwJykgIT09IC0xKSA/ICdibGFjaycgOiAnd2hpdGUnO1xyXG4gIH0sXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYW1lU2FuaXRpemVyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBLZXlOYW1lID0gcmVxdWlyZSgnLi9rZXktbmFtZScpO1xyXG5jb25zdCBOYW1lU2FuaXRpemVyID0gcmVxdWlyZSgnLi9uYW1lLXNhbml0aXplcicpO1xyXG5cclxuY29uc3QgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcyA9IHJlcXVpcmUoJy4vZGF0YS9oaWdobGlnaHRpbmctY2xhc3MtbmFtZXMnKTtcclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZUNvbG9yKGRvbUlEKSB7XHJcbiAgcmV0dXJuIE5hbWVTYW5pdGl6ZXIuY29udmVydFBpYW5vS2V5RG9tSURUb0NvbG9yKGRvbUlEKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpIHtcclxuICBjb25zdCBrZXlOYW1lQmFzZU5hbWUgPSBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9LZXlOYW1lQmFzZU5hbWUoZG9tSUQpO1xyXG4gIGNvbnN0IGtleU5hbWUgPSBuZXcgS2V5TmFtZShrZXlOYW1lQmFzZU5hbWUpO1xyXG4gIHJldHVybiBrZXlOYW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVPY3RhdmUoZG9tSUQpIHtcclxuICByZXR1cm4gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvT2N0YXZlTnVtYmVyKGRvbUlEKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkTW91c2VMaXN0ZW5lcihwaWFub0tleSkge1xyXG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xyXG4gICAgaWYgKHBpYW5vS2V5LmlzSGlnaGxpZ2h0ZWQoKSkgcmV0dXJuO1xyXG4gICAgcGlhbm9LZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKHRydWUpO1xyXG4gICAgZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xyXG4gICAgICBwaWFub0tleS5kaXNhYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCksIDApO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvdWNoTGlzdGVuZXIocGlhbm9LZXkpIHtcclxuICBwaWFub0tleS5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoKSA9PiB7XHJcbiAgICBpZiAocGlhbm9LZXkuaXNIaWdobGlnaHRlZCgpKSByZXR1cm47XHJcbiAgICBwaWFub0tleS5lbmFibGVIaWdobGlnaHRpbmcodHJ1ZSk7XHJcbiAgICBmdW5jdGlvbiBvblRvdWNoRW5kKCkge1xyXG4gICAgICBwaWFub0tleS5kaXNhYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKSwgMCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHBpYW5vS2V5KSB7XHJcbiAgYWRkTW91c2VMaXN0ZW5lcihwaWFub0tleSk7XHJcbiAgYWRkVG91Y2hMaXN0ZW5lcihwaWFub0tleSk7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBQaWFub0tleSB7XHJcbiAgY29uc3RydWN0b3IoZG9tSUQsIGtleUluZGV4KSB7XHJcbiAgICB0aGlzLmluZGV4ID0ga2V5SW5kZXg7XHJcbiAgICB0aGlzLm5hbWVzID0gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpO1xyXG4gICAgdGhpcy5jb2xvciA9IGRldGVybWluZUNvbG9yKGRvbUlEKTtcclxuICAgIHRoaXMub2N0YXZlID0gZGV0ZXJtaW5lT2N0YXZlKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fa2V5LW5hbWUnKTtcclxuICAgIHRoaXMuZG9tRmluZ2VyaW5nVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19maW5nZXJpbmcnKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBpc0hpZ2hsaWdodGVkKCkge1xyXG4gICAgbGV0IGlzSGlnaGxpZ2h0ZWQgPSBmYWxzZTtcclxuICAgIGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcclxuICAgICAgICBpc0hpZ2hsaWdodGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gaXNIaWdobGlnaHRlZDtcclxuICB9XHJcblxyXG4gIGVuYWJsZUhpZ2hsaWdodGluZyhpc1Jvb3RLZXkgPSBmYWxzZSkge1xyXG4gICAgbGV0IGhpZ2hsaWdodENsYXNzTmFtZSA9ICcnO1xyXG4gICAgaWYgKGlzUm9vdEtleSkge1xyXG4gICAgICBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjay0tcm9vdCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjayc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmFkZChoaWdobGlnaHRDbGFzc05hbWUpO1xyXG4gIH1cclxuXHJcbiAgZGlzYWJsZUhpZ2hsaWdodGluZygpIHtcclxuICAgIGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XHJcbiAgICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldEN1c3RvbURpc3BsYXlOYW1lKG5hbWUpIHtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gbmFtZTtcclxuICB9XHJcblxyXG4gIHNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpIHtcclxuICAgIGNvbnN0IGFsaWFzID0gdGhpcy5uYW1lcy5nZXRBbGlhc09mVHlwZSh0eXBlKTtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gYWxpYXM7XHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50TmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudDtcclxuICB9XHJcblxyXG4gIGdldEtleUluZGV4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5kZXg7XHJcbiAgfVxyXG5cclxuICBnZXREb21Ob2RlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZG9tTm9kZTtcclxuICB9XHJcblxyXG4gIHJlc2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAvLyBUT0RPOiBHZXQgZGVmYXVsdCB0eXBlIGZyb20gc2V0dGluZ3Mgb2JqZWN0XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGlhbm9LZXk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IE5hbWVTYW5pdGl6ZXIgPSByZXF1aXJlKCcuL25hbWUtc2FuaXRpemVyJyk7XHJcbmNvbnN0IFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xyXG5cclxubGV0IHNjYWxlU3RhdGUgPSAnJztcclxuXHJcbmZ1bmN0aW9uIGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidXR0b25FbGVtKSB7XHJcbiAgY29uc3QgYnV0dG9uSUQgPSBidXR0b25FbGVtLmlkO1xyXG4gIGNvbnN0IHN0YXRlTmFtZSA9IE5hbWVTYW5pdGl6ZXIuY29udmVydEJ1dHRvbklEVG9TdGF0ZU5hbWUoYnV0dG9uSUQpO1xyXG4gIHJldHVybiBzdGF0ZU5hbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEhpZ2hsaWdodE9uQnV0dG9uKGJ0bikge1xyXG4gIGJ0bi5jbGFzc0xpc3QuYWRkKCdidG4tLXNlbGVjdGVkJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0SGlnaGxpZ2h0T25BbGxCdXR0b25zKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIHNjYWxlQ29udHJvbGxlci5idXR0b25zLmZvckVhY2goKGJ0bikgPT4ge1xyXG4gICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi0tc2VsZWN0ZWQnKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBzY2FsZUNvbnRyb2xsZXIuYnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgc2NhbGVTdGF0ZSA9IGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidG4pO1xyXG4gICAgICByZXNldEhpZ2hsaWdodE9uQWxsQnV0dG9ucyhzY2FsZUNvbnRyb2xsZXIpO1xyXG4gICAgICBhZGRIaWdobGlnaHRPbkJ1dHRvbihidG4pO1xyXG4gICAgICBTY2FsZURpc3BsYXkuc2V0VGV4dChzY2FsZVN0YXRlKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBzY2FsZUNvbnRyb2xsZXIuY2F0ZWdvcmllcy5mb3JFYWNoKChjYXRlZ29yeSkgPT4ge1xyXG4gICAgY29uc3QgY2F0ZWdvcnlUaXRsZSA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1saXN0X19jYXRlZ29yeS10aXRsZScpO1xyXG4gICAgY29uc3QgZHJvcGRvd25MaXN0ID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLnNjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QnKTtcclxuICAgIGNvbnN0IGRyb3Bkb3duQXJyb3cgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tYXJyb3cnKTtcclxuICAgIGNhdGVnb3J5VGl0bGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIGNhdGVnb3J5VGl0bGUuY2xhc3NMaXN0LnRvZ2dsZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnktdGl0bGUtLWFjdGl2ZScpO1xyXG4gICAgICBkcm9wZG93bkxpc3QuY2xhc3NMaXN0LnRvZ2dsZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnktbGlzdC0taGlkZGVuJyk7XHJcbiAgICAgIGRyb3Bkb3duQXJyb3cuY2xhc3NMaXN0LnRvZ2dsZSgnZHJvcGRvd24tYXJyb3ctLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBzY2FsZUNvbnRyb2xsZXIge1xyXG4gIHN0YXRpYyBpbml0KCkge1xyXG4gICAgdGhpcy5idXR0b25zID0gWy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J0bicpXTtcclxuICAgIHRoaXMuY2F0ZWdvcmllcyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzY2FsZS1saXN0X19jYXRlZ29yeScpXTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0U2NhbGVTdGF0ZSgpIHtcclxuICAgIHJldHVybiBzY2FsZVN0YXRlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2NhbGVDb250cm9sbGVyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuXHJcbmNvbnN0IHNjYWxlRGF0YSA9IHJlcXVpcmUoJy4vZGF0YS9zY2FsZS1kYXRhJyk7XHJcblxyXG5mdW5jdGlvbiBnZXRJbmZvT2ZTY2FsZVN0YXRlKHNjYWxlU3RhdGUgPSAnJykge1xyXG4gIGNvbnN0IFtjaG9yZE9yU2NhbGUsIC4uLnNjYWxlVHlwZVRva2Vuc10gPSBzY2FsZVN0YXRlLnNwbGl0KCctJyk7XHJcbiAgY29uc3Qgc2NhbGVUeXBlID0gc2NhbGVUeXBlVG9rZW5zLmpvaW4oJyAnKTtcclxuICByZXR1cm4gW2Nob3JkT3JTY2FsZSwgc2NhbGVUeXBlXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2NhbGVQYXR0ZXJuKHNjYWxlVHlwZSkge1xyXG4gIGNvbnN0IHBhdHRlcm4gPSBzY2FsZURhdGEucGF0dGVybnMuc2NhbGVzW3NjYWxlVHlwZV07XHJcbiAgaWYgKHBhdHRlcm4gPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xyXG4gIHJldHVybiBwYXR0ZXJuO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDaG9yZFBhdHRlcm4oc2NhbGVUeXBlKSB7XHJcbiAgY29uc3QgcGF0dGVybiA9IHNjYWxlRGF0YS5wYXR0ZXJucy5jaG9yZHNbc2NhbGVUeXBlXTtcclxuICBpZiAocGF0dGVybiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBhdHRlcm4oc2NhbGVJbmZvKSB7XHJcbiAgY29uc3QgW2Nob3JkT3JTY2FsZSwgc2NhbGVUeXBlXSA9IHNjYWxlSW5mbztcclxuICBsZXQgcGF0dGVybiA9IFtdO1xyXG4gIGlmIChjaG9yZE9yU2NhbGUgPT09ICdzY2FsZScpIHtcclxuICAgIHBhdHRlcm4gPSBnZXRTY2FsZVBhdHRlcm4oc2NhbGVUeXBlKTtcclxuICB9IGVsc2UgaWYgKGNob3JkT3JTY2FsZSA9PT0gJ2Nob3JkJykge1xyXG4gICAgcGF0dGVybiA9IGdldENob3JkUGF0dGVybihzY2FsZVR5cGUpO1xyXG4gIH1cclxuICByZXR1cm4gcGF0dGVybjtcclxufVxyXG5cclxuXHJcbmNsYXNzIHNjYWxlRGF0YWJhc2Uge1xyXG4gIHN0YXRpYyBnZXRQYXR0ZXJuT2Yoc2NhbGVTdGF0ZSA9ICcnKSB7XHJcbiAgICBjb25zdCBzY2FsZUluZm8gPSBnZXRJbmZvT2ZTY2FsZVN0YXRlKHNjYWxlU3RhdGUpO1xyXG4gICAgY29uc3QgcGF0dGVybiA9IGdldFBhdHRlcm4oc2NhbGVJbmZvKTtcclxuICAgIHJldHVybiBwYXR0ZXJuO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKSB7XHJcbiAgICBjb25zdCBzY2FsZVN0YXRlID0gU2NhbGVDb250cm9sbGVyLmdldFNjYWxlU3RhdGUoKTtcclxuICAgIGNvbnN0IHNjYWxlUGF0dGVybiA9IHRoaXMuZ2V0UGF0dGVybk9mKHNjYWxlU3RhdGUpO1xyXG4gICAgcmV0dXJuIHNjYWxlUGF0dGVybjtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2NhbGVEYXRhYmFzZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY2xhc3MgU2NhbGVEaXNwbGF5IHtcclxuICBzdGF0aWMgaW5pdCgpIHtcclxuICAgIHRoaXMuZG9tRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1kaXNwbGF5X190ZXh0LXBhbmVsJyk7XHJcbiAgICB0aGlzLmRvbUVsZW0udGV4dENvbnRlbnQgPSAnJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZXRUZXh0KHRleHQpIHtcclxuICAgIHRoaXMuZG9tRWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjYWxlRGlzcGxheTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGlzIG51bWJlciBpcyBpbmNsdWRlZFxuICogQHJldHVybnMge251bWJlcltdfVxuICovXG5mdW5jdGlvbiByYW5nZShzdGFydCwgZW5kKSB7XG4gIHJldHVybiBbLi4uQXJyYXkoZW5kIC0gc3RhcnQgKyAxKS5maWxsKCkubWFwKChfLCBpKSA9PiBpICsgMSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgcmFuZ2UgfTtcbiJdfQ==
