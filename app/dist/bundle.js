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

const offsetToDegreeSets = {
  scale: {
    standard: ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
    movableDoSharp: ['Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'So', 'Si', 'La', 'Li', 'Ti'],
    movableDoFlat: ['Do', 'Ra', 'Re', 'Me', 'Mi', 'Fa', 'Se', 'So', 'Le', 'La', 'Te', 'Ti'],
  },
  chord: {
    standard: ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7', '1', 'b9', '9', 's9', '3', 'b11', '11'],
  },
};

module.exports = offsetToDegreeSets;

},{}],5:[function(require,module,exports){
'use strict';

const pianoKeyBaseIDs = [
  'c',
  'c-sharp',
  'd',
  'd-sharp',
  'e',
  'f',
  'f-sharp',
  'g',
  'g-sharp',
  'a',
  'a-sharp',
  'b',
];

module.exports = pianoKeyBaseIDs;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

const DegreeTile = require('./degree-tile');

const pianoKeyBaseIDs = require('./data/piano-key-base-ids');
const { range } = require('./util');

function generateDegreeDisplayTileDomIDs() {
  const tileNames = [];
  const NUM_OF_OCTAVES = 3;
  range(1, NUM_OF_OCTAVES).forEach((octave) => {
    pianoKeyBaseIDs.forEach((baseID) => {
      const tileName = `degree-${baseID}${octave}`;
      tileNames.push(tileName);
    });
  });
  return tileNames;
}

function getDegreeTilesUsingDomIDs(tileNameIDs = []) {
  const degreeTileNodes = [];
  tileNameIDs.forEach((id, tileIndex) => {
    const degreeTile = new DegreeTile(id, tileIndex);
    degreeTileNodes.push(degreeTile);
  });
  return degreeTileNodes;
}

function getDegreeTiles() {
  const tileNameIDs = generateDegreeDisplayTileDomIDs();
  const degreeTiles = getDegreeTilesUsingDomIDs(tileNameIDs);
  return degreeTiles;
}


class DegreeDisplay {
  constructor() {
    this.degreeTiles = getDegreeTiles();
  }

  enableHiddenForAllTiles() {
    this.degreeTiles.forEach((tile) => {
      tile.enableHidden();
    });
  }
}

module.exports = DegreeDisplay;

},{"./data/piano-key-base-ids":5,"./degree-tile":8,"./util":18}],8:[function(require,module,exports){
'use strict';

const ScaleController = require('./scale-controller');

const offsetToDegreeSets = require('./data/offset-to-degree-sets');

class DegreeTile {
  constructor(domID, index) {
    this.domNode = document.getElementById(domID);
    this.domTextNode = this.domNode.querySelector('.degree-display__degree-text');
    this.index = index;
  }

  enableHidden() {
    this.domNode.classList.add('hidden');
  }

  disableHidden() {
    this.domNode.classList.remove('hidden');
  }

  setDegreeNumber(offsetFromRootNote) {
    const chordOrScale = ScaleController.getChordOrScale();
    const degreeType = 'standard'; // Settings.getDegreeType();
    let degree = '';
    if (chordOrScale === 'scale') {
      degree = offsetToDegreeSets.scale[degreeType][offsetFromRootNote];
    } else if (chordOrScale === 'chord') {
      degree = offsetToDegreeSets.chord[degreeType][offsetFromRootNote];
    }
    this.domTextNode.textContent = degree;
  }
}

module.exports = DegreeTile;

},{"./data/offset-to-degree-sets":4,"./scale-controller":14}],9:[function(require,module,exports){
'use strict';

const Keyboard = require('./keyboard');
const DegreeDisplay = require('./degree-display');
const ScaleController = require('./scale-controller');
const ScaleDisplay = require('./scale-display');

ScaleController.init();
ScaleDisplay.init();

const mainKeyboard = new Keyboard();
mainKeyboard.setDisplayNameForAllKeysOfType('standard');

const degreeDisplay = new DegreeDisplay();
degreeDisplay.enableHiddenForAllTiles();

},{"./degree-display":7,"./keyboard":11,"./scale-controller":14,"./scale-display":16}],10:[function(require,module,exports){
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

},{"./data/key-name-sets":2,"./data/key-name-to-id-enum":3}],11:[function(require,module,exports){
'use strict';

const PianoKey = require('./piano-key');
const ScaleDatabase = require('./scale-database');
const TimerManager = require('./timer-manager');
const DegreeDisplay = require('./degree-display');

const { range } = require('./util');
const pianoKeyBaseIDs = require('./data/piano-key-base-ids');

function generateKeyNameDomIDs() {
  const keyNamesWithOctaves = [];
  const NUM_OF_OCTAVES = 3;
  range(1, NUM_OF_OCTAVES).forEach((octave) => {
    pianoKeyBaseIDs.forEach((baseID) => {
      const nameWithOctave = baseID + octave;
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
    keyboard.enableHighlightingForScaleStartingFromIndex(index);
  });
}

function enableHighlightingForRootKey() {
  const rootKey = this.keys[this.index];
  const isRootKey = true;
  rootKey.enableHighlighting(isRootKey);
}

function HighlightingPattern(scalePattern) {
  return {
    toKeys(keys) {
      this.keys = keys;
      return this;
    },
    fromIndex(index) {
      this.index = index;
      return this;
    },
    withTimer(timerManager) {
      this.timerManager = timerManager;
      return this;
    },
    enable() {
      enableHighlightingForRootKey.bind(this)();
      scalePattern.forEach((increment, idx) => {
        this.index += increment;
        const nextKey = this.keys[this.index];
        if (nextKey === undefined) return;
        if (this.timerManager === undefined) {
          nextKey.enableHighlighting();
        } else {
          this.timerManager.addTimer(nextKey.enableHighlighting.bind(nextKey), idx + 1);
        }
      });
    },
  };
}


class Keyboard {
  constructor() {
    this.domNode = document.querySelector('.keyboard');
    this.keys = getPianoKeys();
    this.degreeDisplay = new DegreeDisplay();
    this.timerManager = new TimerManager();
    registerEventListeners(this);
  }

  disableHighlightingForAllKeys() {
    this.keys.forEach((key) => {
      key.disableHighlighting();
    });
  }

  enableHighlightingForScaleStartingFromIndex(index) {
    const scalePattern = ScaleDatabase.getPatternOfSelectedScale();
    if (scalePattern.length === 0) return;
    this.timerManager.clearAllTimers();
    this.disableHighlightingForAllKeys();
    HighlightingPattern(scalePattern)
      .toKeys(this.keys)
      .fromIndex(index)
      .withTimer(this.timerManager)
      .enable();
  }

  setDisplayNameForAllKeysOfType(type) {
    this.keys.forEach((key) => {
      key.setDisplayNameOfType(type);
    });
  }
}

module.exports = Keyboard;

},{"./data/piano-key-base-ids":5,"./degree-display":7,"./piano-key":13,"./scale-database":15,"./timer-manager":17,"./util":18}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./data/highlighting-class-names":1,"./key-name":10,"./name-sanitizer":12}],14:[function(require,module,exports){
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

function getInfoOfScaleState() {
  const [chordOrScale, ...scaleTypeTokens] = scaleState.split('-');
  const scaleType = scaleTypeTokens.join(' ');
  return { chordOrScale, scaleType };
}

function addButtonListeners(scaleController) {
  scaleController.buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      scaleState = getStateNameFromButtonID(btn);
      resetHighlightOnAllButtons(scaleController);
      addHighlightOnButton(btn);
      ScaleDisplay.setText(scaleState);
    });
  });
}

function addDropdownTitleListeners(scaleController) {
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

function registerEventListeners(scaleController) {
  addButtonListeners(scaleController);
  addDropdownTitleListeners(scaleController);
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

},{"./name-sanitizer":12,"./scale-display":16}],15:[function(require,module,exports){
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

},{"./data/scale-data":6,"./scale-controller":14}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzLmpzIiwiYXBwL3NyYy9kYXRhL2tleS1uYW1lLXNldHMuanMiLCJhcHAvc3JjL2RhdGEva2V5LW5hbWUtdG8taWQtZW51bS5qcyIsImFwcC9zcmMvZGF0YS9vZmZzZXQtdG8tZGVncmVlLXNldHMuanMiLCJhcHAvc3JjL2RhdGEvcGlhbm8ta2V5LWJhc2UtaWRzLmpzIiwiYXBwL3NyYy9kYXRhL3NjYWxlLWRhdGEuanMiLCJhcHAvc3JjL2RlZ3JlZS1kaXNwbGF5LmpzIiwiYXBwL3NyYy9kZWdyZWUtdGlsZS5qcyIsImFwcC9zcmMvaW5kZXguanMiLCJhcHAvc3JjL2tleS1uYW1lLmpzIiwiYXBwL3NyYy9rZXlib2FyZC5qcyIsImFwcC9zcmMvbmFtZS1zYW5pdGl6ZXIuanMiLCJhcHAvc3JjL3BpYW5vLWtleS5qcyIsImFwcC9zcmMvc2NhbGUtY29udHJvbGxlci5qcyIsImFwcC9zcmMvc2NhbGUtZGF0YWJhc2UuanMiLCJhcHAvc3JjL3NjYWxlLWRpc3BsYXkuanMiLCJhcHAvc3JjL3RpbWVyLW1hbmFnZXIuanMiLCJhcHAvc3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcyA9IFtcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUtLXJvb3QnLFxyXG4gICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjay0tcm9vdCcsXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyxcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2snLFxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBoaWdobGlnaHRpbmdDbGFzc05hbWVzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBrZXlOYW1lU2V0cyA9IHtcclxuICBzdGFuZGFyZDogWydDJywgJ0Pima8nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Lima0nLCAnQiddLFxyXG4gIHNoYXJwOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXHJcbiAgZmxhdDogWydDJywgJ0Tima0nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdH4pmtJywgJ0cnLCAnQeKZrScsICdBJywgJ0Lima0nLCAnQiddLFxyXG4gIGZpeGVkRG9TaGFycDogWydEbycsICdEaScsICdSZScsICdSaScsICdNaScsICdGYScsICdGaScsICdTbycsICdTaScsICdMYScsICdMaScsICdUaSddLFxyXG4gIGZpeGVkRG9GbGF0OiBbJ0RvJywgJ1JhJywgJ1JlJywgJ01lJywgJ01pJywgJ0ZhJywgJ1NlJywgJ1NvJywgJ0xlJywgJ0xhJywgJ1RlJywgJ1RpJ10sXHJcbiAgc3BlY2lhbEZTaGFycE06IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXHJcbiAgc3BlY2lhbENTaGFycE06IFsnQiMnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlOYW1lU2V0cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qga2V5TmFtZVRvSURFbnVtID0gT2JqZWN0LmZyZWV6ZSh7XHJcbiAgJ0MnOiAwLFxyXG4gICdD4pmvJzogMSxcclxuICAnRCc6IDIsXHJcbiAgJ0Tima8nOiAzLFxyXG4gICdFJzogNCxcclxuICAnRic6IDUsXHJcbiAgJ0bima8nOiA2LFxyXG4gICdHJzogNyxcclxuICAnR+KZryc6IDgsXHJcbiAgJ0EnOiA5LFxyXG4gICdB4pmvJzogMTAsXHJcbiAgJ0InOiAxMSxcclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGtleU5hbWVUb0lERW51bTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qgb2Zmc2V0VG9EZWdyZWVTZXRzID0ge1xyXG4gIHNjYWxlOiB7XHJcbiAgICBzdGFuZGFyZDogWycxJywgJ2IyJywgJzInLCAnYjMnLCAnMycsICc0JywgJ2I1JywgJzUnLCAnYjYnLCAnNicsICdiNycsICc3J10sXHJcbiAgICBtb3ZhYmxlRG9TaGFycDogWydEbycsICdEaScsICdSZScsICdSaScsICdNaScsICdGYScsICdGaScsICdTbycsICdTaScsICdMYScsICdMaScsICdUaSddLFxyXG4gICAgbW92YWJsZURvRmxhdDogWydEbycsICdSYScsICdSZScsICdNZScsICdNaScsICdGYScsICdTZScsICdTbycsICdMZScsICdMYScsICdUZScsICdUaSddLFxyXG4gIH0sXHJcbiAgY2hvcmQ6IHtcclxuICAgIHN0YW5kYXJkOiBbJzEnLCAnYjInLCAnMicsICdiMycsICczJywgJzQnLCAnYjUnLCAnNScsICdiNicsICc2JywgJ2I3JywgJzcnLCAnMScsICdiOScsICc5JywgJ3M5JywgJzMnLCAnYjExJywgJzExJ10sXHJcbiAgfSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gb2Zmc2V0VG9EZWdyZWVTZXRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBwaWFub0tleUJhc2VJRHMgPSBbXHJcbiAgJ2MnLFxyXG4gICdjLXNoYXJwJyxcclxuICAnZCcsXHJcbiAgJ2Qtc2hhcnAnLFxyXG4gICdlJyxcclxuICAnZicsXHJcbiAgJ2Ytc2hhcnAnLFxyXG4gICdnJyxcclxuICAnZy1zaGFycCcsXHJcbiAgJ2EnLFxyXG4gICdhLXNoYXJwJyxcclxuICAnYicsXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBpYW5vS2V5QmFzZUlEcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgZGF0YSA9IHtcclxuICBwYXR0ZXJuczoge1xyXG4gICAgc2NhbGVzOiB7XHJcbiAgICAgICdtYWpvcic6IFsyLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgJ21pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAnaGFybW9uaWMgbWlub3InOiBbMiwgMSwgMiwgMiwgMSwgM10sXHJcbiAgICAgICdtZWxvZGljIG1pbm9yJzogWzIsIDEsIDIsIDIsIDIsIDJdLFxyXG5cclxuICAgIH0sXHJcbiAgICBjaG9yZHM6IHtcclxuICAgICAgJ21ham9yJzogWzQsIDNdLFxyXG4gICAgICAnbWlub3InOiBbMywgNF0sXHJcbiAgICAgICdkaW1pbmlzaGVkJzogWzMsIDNdLFxyXG4gICAgICAnYXVnbWVudGVkJzogWzQsIDRdLFxyXG4gICAgICAnc3VzcGVuZGVkMic6IFsyLCA1XSxcclxuICAgICAgJ3N1c3BlbmRlZDQnOiBbNSwgMl0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGE7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IERlZ3JlZVRpbGUgPSByZXF1aXJlKCcuL2RlZ3JlZS10aWxlJyk7XHJcblxyXG5jb25zdCBwaWFub0tleUJhc2VJRHMgPSByZXF1aXJlKCcuL2RhdGEvcGlhbm8ta2V5LWJhc2UtaWRzJyk7XHJcbmNvbnN0IHsgcmFuZ2UgfSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVEZWdyZWVEaXNwbGF5VGlsZURvbUlEcygpIHtcclxuICBjb25zdCB0aWxlTmFtZXMgPSBbXTtcclxuICBjb25zdCBOVU1fT0ZfT0NUQVZFUyA9IDM7XHJcbiAgcmFuZ2UoMSwgTlVNX09GX09DVEFWRVMpLmZvckVhY2goKG9jdGF2ZSkgPT4ge1xyXG4gICAgcGlhbm9LZXlCYXNlSURzLmZvckVhY2goKGJhc2VJRCkgPT4ge1xyXG4gICAgICBjb25zdCB0aWxlTmFtZSA9IGBkZWdyZWUtJHtiYXNlSUR9JHtvY3RhdmV9YDtcclxuICAgICAgdGlsZU5hbWVzLnB1c2godGlsZU5hbWUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHRpbGVOYW1lcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGVncmVlVGlsZXNVc2luZ0RvbUlEcyh0aWxlTmFtZUlEcyA9IFtdKSB7XHJcbiAgY29uc3QgZGVncmVlVGlsZU5vZGVzID0gW107XHJcbiAgdGlsZU5hbWVJRHMuZm9yRWFjaCgoaWQsIHRpbGVJbmRleCkgPT4ge1xyXG4gICAgY29uc3QgZGVncmVlVGlsZSA9IG5ldyBEZWdyZWVUaWxlKGlkLCB0aWxlSW5kZXgpO1xyXG4gICAgZGVncmVlVGlsZU5vZGVzLnB1c2goZGVncmVlVGlsZSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGRlZ3JlZVRpbGVOb2RlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGVncmVlVGlsZXMoKSB7XHJcbiAgY29uc3QgdGlsZU5hbWVJRHMgPSBnZW5lcmF0ZURlZ3JlZURpc3BsYXlUaWxlRG9tSURzKCk7XHJcbiAgY29uc3QgZGVncmVlVGlsZXMgPSBnZXREZWdyZWVUaWxlc1VzaW5nRG9tSURzKHRpbGVOYW1lSURzKTtcclxuICByZXR1cm4gZGVncmVlVGlsZXM7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBEZWdyZWVEaXNwbGF5IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZGVncmVlVGlsZXMgPSBnZXREZWdyZWVUaWxlcygpO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlkZGVuRm9yQWxsVGlsZXMoKSB7XHJcbiAgICB0aGlzLmRlZ3JlZVRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcclxuICAgICAgdGlsZS5lbmFibGVIaWRkZW4oKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZWdyZWVEaXNwbGF5O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuXHJcbmNvbnN0IG9mZnNldFRvRGVncmVlU2V0cyA9IHJlcXVpcmUoJy4vZGF0YS9vZmZzZXQtdG8tZGVncmVlLXNldHMnKTtcclxuXHJcbmNsYXNzIERlZ3JlZVRpbGUge1xyXG4gIGNvbnN0cnVjdG9yKGRvbUlELCBpbmRleCkge1xyXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSUQpO1xyXG4gICAgdGhpcy5kb21UZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcuZGVncmVlLWRpc3BsYXlfX2RlZ3JlZS10ZXh0Jyk7XHJcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgfVxyXG5cclxuICBlbmFibGVIaWRkZW4oKSB7XHJcbiAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlkZGVuKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG4gIH1cclxuXHJcbiAgc2V0RGVncmVlTnVtYmVyKG9mZnNldEZyb21Sb290Tm90ZSkge1xyXG4gICAgY29uc3QgY2hvcmRPclNjYWxlID0gU2NhbGVDb250cm9sbGVyLmdldENob3JkT3JTY2FsZSgpO1xyXG4gICAgY29uc3QgZGVncmVlVHlwZSA9ICdzdGFuZGFyZCc7IC8vIFNldHRpbmdzLmdldERlZ3JlZVR5cGUoKTtcclxuICAgIGxldCBkZWdyZWUgPSAnJztcclxuICAgIGlmIChjaG9yZE9yU2NhbGUgPT09ICdzY2FsZScpIHtcclxuICAgICAgZGVncmVlID0gb2Zmc2V0VG9EZWdyZWVTZXRzLnNjYWxlW2RlZ3JlZVR5cGVdW29mZnNldEZyb21Sb290Tm90ZV07XHJcbiAgICB9IGVsc2UgaWYgKGNob3JkT3JTY2FsZSA9PT0gJ2Nob3JkJykge1xyXG4gICAgICBkZWdyZWUgPSBvZmZzZXRUb0RlZ3JlZVNldHMuY2hvcmRbZGVncmVlVHlwZV1bb2Zmc2V0RnJvbVJvb3ROb3RlXTtcclxuICAgIH1cclxuICAgIHRoaXMuZG9tVGV4dE5vZGUudGV4dENvbnRlbnQgPSBkZWdyZWU7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlZ3JlZVRpbGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEtleWJvYXJkID0gcmVxdWlyZSgnLi9rZXlib2FyZCcpO1xyXG5jb25zdCBEZWdyZWVEaXNwbGF5ID0gcmVxdWlyZSgnLi9kZWdyZWUtZGlzcGxheScpO1xyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuY29uc3QgU2NhbGVEaXNwbGF5ID0gcmVxdWlyZSgnLi9zY2FsZS1kaXNwbGF5Jyk7XHJcblxyXG5TY2FsZUNvbnRyb2xsZXIuaW5pdCgpO1xyXG5TY2FsZURpc3BsYXkuaW5pdCgpO1xyXG5cclxuY29uc3QgbWFpbktleWJvYXJkID0gbmV3IEtleWJvYXJkKCk7XHJcbm1haW5LZXlib2FyZC5zZXREaXNwbGF5TmFtZUZvckFsbEtleXNPZlR5cGUoJ3N0YW5kYXJkJyk7XHJcblxyXG5jb25zdCBkZWdyZWVEaXNwbGF5ID0gbmV3IERlZ3JlZURpc3BsYXkoKTtcclxuZGVncmVlRGlzcGxheS5lbmFibGVIaWRkZW5Gb3JBbGxUaWxlcygpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBrZXlOYW1lU2V0cyA9IHJlcXVpcmUoJy4vZGF0YS9rZXktbmFtZS1zZXRzJyk7XHJcbmNvbnN0IGtleU5hbWVUb0lERW51bSA9IHJlcXVpcmUoJy4vZGF0YS9rZXktbmFtZS10by1pZC1lbnVtJyk7XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVLZXlJRChiYXNlTmFtZSkge1xyXG4gIGNvbnN0IGlkID0ga2V5TmFtZVRvSURFbnVtW2Jhc2VOYW1lXTtcclxuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIC0xO1xyXG4gIHJldHVybiBpZDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0S2V5TmFtZVNldCh0eXBlKSB7XHJcbiAgY29uc3Qga2V5TmFtZVNldCA9IGtleU5hbWVTZXRzW3R5cGVdO1xyXG4gIGlmIChrZXlOYW1lU2V0ID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICByZXR1cm4ga2V5TmFtZVNldDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCBrZXlJRCkge1xyXG4gIGNvbnN0IGFsaWFzT2ZTcGVjaWZpY1R5cGUgPSBrZXlOYW1lU2V0W2tleUlEXTtcclxuICBpZiAoYWxpYXNPZlNwZWNpZmljVHlwZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgcmV0dXJuIGFsaWFzT2ZTcGVjaWZpY1R5cGU7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBLZXlOYW1lIHtcclxuICBjb25zdHJ1Y3RvcihiYXNlTmFtZSkge1xyXG4gICAgdGhpcy5pZCA9IGRldGVybWluZUtleUlEKGJhc2VOYW1lKTtcclxuICB9XHJcblxyXG4gIGdldEFsaWFzT2ZUeXBlKHR5cGUpIHtcclxuICAgIGNvbnN0IGtleU5hbWVTZXQgPSBnZXRLZXlOYW1lU2V0KHR5cGUpO1xyXG4gICAgY29uc3QgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwgdGhpcy5pZCk7XHJcbiAgICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5TmFtZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgUGlhbm9LZXkgPSByZXF1aXJlKCcuL3BpYW5vLWtleScpO1xyXG5jb25zdCBTY2FsZURhdGFiYXNlID0gcmVxdWlyZSgnLi9zY2FsZS1kYXRhYmFzZScpO1xyXG5jb25zdCBUaW1lck1hbmFnZXIgPSByZXF1aXJlKCcuL3RpbWVyLW1hbmFnZXInKTtcclxuY29uc3QgRGVncmVlRGlzcGxheSA9IHJlcXVpcmUoJy4vZGVncmVlLWRpc3BsYXknKTtcclxuXHJcbmNvbnN0IHsgcmFuZ2UgfSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xyXG5jb25zdCBwaWFub0tleUJhc2VJRHMgPSByZXF1aXJlKCcuL2RhdGEvcGlhbm8ta2V5LWJhc2UtaWRzJyk7XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZUtleU5hbWVEb21JRHMoKSB7XHJcbiAgY29uc3Qga2V5TmFtZXNXaXRoT2N0YXZlcyA9IFtdO1xyXG4gIGNvbnN0IE5VTV9PRl9PQ1RBVkVTID0gMztcclxuICByYW5nZSgxLCBOVU1fT0ZfT0NUQVZFUykuZm9yRWFjaCgob2N0YXZlKSA9PiB7XHJcbiAgICBwaWFub0tleUJhc2VJRHMuZm9yRWFjaCgoYmFzZUlEKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5hbWVXaXRoT2N0YXZlID0gYmFzZUlEICsgb2N0YXZlO1xyXG4gICAgICBrZXlOYW1lc1dpdGhPY3RhdmVzLnB1c2gobmFtZVdpdGhPY3RhdmUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGtleU5hbWVzV2l0aE9jdGF2ZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBpYW5vS2V5c1VzaW5nRG9tSURzKGtleU5hbWVJRHMgPSBbXSkge1xyXG4gIGNvbnN0IHBpYW5vS2V5Tm9kZXMgPSBbXTtcclxuICBrZXlOYW1lSURzLmZvckVhY2goKGlkLCBrZXlJbmRleCkgPT4ge1xyXG4gICAgY29uc3QgcGlhbm9LZXkgPSBuZXcgUGlhbm9LZXkoaWQsIGtleUluZGV4KTtcclxuICAgIHBpYW5vS2V5Tm9kZXMucHVzaChwaWFub0tleSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHBpYW5vS2V5Tm9kZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBpYW5vS2V5cygpIHtcclxuICBjb25zdCBrZXlOYW1lSURzID0gZ2VuZXJhdGVLZXlOYW1lRG9tSURzKCk7XHJcbiAgY29uc3QgcGlhbm9LZXlzID0gZ2V0UGlhbm9LZXlzVXNpbmdEb21JRHMoa2V5TmFtZUlEcyk7XHJcbiAgcmV0dXJuIHBpYW5vS2V5cztcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhrZXlib2FyZCkge1xyXG4gIGtleWJvYXJkLmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGV2ZW50U291cmNlID0ga2V5Ym9hcmQua2V5cy5maW5kKGl0ZW0gPT4gaXRlbS5nZXREb21Ob2RlKCkgPT09IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcua2V5Ym9hcmRfX2tleScpKTtcclxuICAgIGlmIChldmVudFNvdXJjZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICBjb25zdCBpbmRleCA9IGV2ZW50U291cmNlLmdldEtleUluZGV4KCk7XHJcbiAgICBrZXlib2FyZC5lbmFibGVIaWdobGlnaHRpbmdGb3JTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZW5hYmxlSGlnaGxpZ2h0aW5nRm9yUm9vdEtleSgpIHtcclxuICBjb25zdCByb290S2V5ID0gdGhpcy5rZXlzW3RoaXMuaW5kZXhdO1xyXG4gIGNvbnN0IGlzUm9vdEtleSA9IHRydWU7XHJcbiAgcm9vdEtleS5lbmFibGVIaWdobGlnaHRpbmcoaXNSb290S2V5KTtcclxufVxyXG5cclxuZnVuY3Rpb24gSGlnaGxpZ2h0aW5nUGF0dGVybihzY2FsZVBhdHRlcm4pIHtcclxuICByZXR1cm4ge1xyXG4gICAgdG9LZXlzKGtleXMpIHtcclxuICAgICAgdGhpcy5rZXlzID0ga2V5cztcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgZnJvbUluZGV4KGluZGV4KSB7XHJcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgd2l0aFRpbWVyKHRpbWVyTWFuYWdlcikge1xyXG4gICAgICB0aGlzLnRpbWVyTWFuYWdlciA9IHRpbWVyTWFuYWdlcjtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgZW5hYmxlKCkge1xyXG4gICAgICBlbmFibGVIaWdobGlnaHRpbmdGb3JSb290S2V5LmJpbmQodGhpcykoKTtcclxuICAgICAgc2NhbGVQYXR0ZXJuLmZvckVhY2goKGluY3JlbWVudCwgaWR4KSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbmRleCArPSBpbmNyZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgbmV4dEtleSA9IHRoaXMua2V5c1t0aGlzLmluZGV4XTtcclxuICAgICAgICBpZiAobmV4dEtleSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMudGltZXJNYW5hZ2VyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIG5leHRLZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudGltZXJNYW5hZ2VyLmFkZFRpbWVyKG5leHRLZXkuZW5hYmxlSGlnaGxpZ2h0aW5nLmJpbmQobmV4dEtleSksIGlkeCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcblxyXG5jbGFzcyBLZXlib2FyZCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmRvbU5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmQnKTtcclxuICAgIHRoaXMua2V5cyA9IGdldFBpYW5vS2V5cygpO1xyXG4gICAgdGhpcy5kZWdyZWVEaXNwbGF5ID0gbmV3IERlZ3JlZURpc3BsYXkoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyID0gbmV3IFRpbWVyTWFuYWdlcigpO1xyXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcclxuICB9XHJcblxyXG4gIGRpc2FibGVIaWdobGlnaHRpbmdGb3JBbGxLZXlzKCkge1xyXG4gICAgdGhpcy5rZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICBrZXkuZGlzYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBlbmFibGVIaWdobGlnaHRpbmdGb3JTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KSB7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSBTY2FsZURhdGFiYXNlLmdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKTtcclxuICAgIGlmIChzY2FsZVBhdHRlcm4ubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLnRpbWVyTWFuYWdlci5jbGVhckFsbFRpbWVycygpO1xyXG4gICAgdGhpcy5kaXNhYmxlSGlnaGxpZ2h0aW5nRm9yQWxsS2V5cygpO1xyXG4gICAgSGlnaGxpZ2h0aW5nUGF0dGVybihzY2FsZVBhdHRlcm4pXHJcbiAgICAgIC50b0tleXModGhpcy5rZXlzKVxyXG4gICAgICAuZnJvbUluZGV4KGluZGV4KVxyXG4gICAgICAud2l0aFRpbWVyKHRoaXMudGltZXJNYW5hZ2VyKVxyXG4gICAgICAuZW5hYmxlKCk7XHJcbiAgfVxyXG5cclxuICBzZXREaXNwbGF5TmFtZUZvckFsbEtleXNPZlR5cGUodHlwZSkge1xyXG4gICAgdGhpcy5rZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICBrZXkuc2V0RGlzcGxheU5hbWVPZlR5cGUodHlwZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IE5hbWVTYW5pdGl6ZXIgPSB7XHJcblxyXG4gIC8qICdidG4tc2NhbGUtbWFqb3InIC0+ICdzY2FsZS1tYWpvcicgKi9cclxuICBjb252ZXJ0QnV0dG9uSURUb1N0YXRlTmFtZShidXR0b25JRCkge1xyXG4gICAgaWYgKGJ1dHRvbklEID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICAgIGNvbnN0IHN0YXRlTmFtZSA9IGJ1dHRvbklELnN1YnN0cmluZyg0KTtcclxuICAgIHJldHVybiBzdGF0ZU5hbWU7XHJcbiAgfSxcclxuXHJcbiAgLyogJ2Mtc2hhcnAxJyAtPiAnY+KZrycgKi9cclxuICBjb252ZXJ0UGlhbm9LZXlEb21JRFRvS2V5TmFtZUJhc2VOYW1lKHBpYW5vS2V5RG9tSUQpIHtcclxuICAgIGlmIChwaWFub0tleURvbUlEID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICAgIGNvbnN0IHRyaW1tZWROYW1lID0gcGlhbm9LZXlEb21JRC5zbGljZSgwLCAtMSk7XHJcbiAgICBjb25zdCBrZXlOYW1lQmFzZU5hbWUgPSB0cmltbWVkTmFtZS5yZXBsYWNlKCctc2hhcnAnLCAn4pmvJykudG9VcHBlckNhc2UoKTtcclxuICAgIHJldHVybiBrZXlOYW1lQmFzZU5hbWU7XHJcbiAgfSxcclxuXHJcbiAgLyogJ2Mtc2hhcnAxJyAtPiAnMScgKi9cclxuICBjb252ZXJ0UGlhbm9LZXlEb21JRFRvT2N0YXZlTnVtYmVyKHBpYW5vS2V5RG9tSUQpIHtcclxuICAgIHJldHVybiBwaWFub0tleURvbUlELnNsaWNlKC0xKTtcclxuICB9LFxyXG5cclxuICAvKiAnYy1zaGFycDEnIC0+ICdibGFjaycgKi9cclxuICBjb252ZXJ0UGlhbm9LZXlEb21JRFRvQ29sb3IocGlhbm9LZXlEb21JRCkge1xyXG4gICAgcmV0dXJuIChwaWFub0tleURvbUlELmluZGV4T2YoJ3NoYXJwJykgIT09IC0xKSA/ICdibGFjaycgOiAnd2hpdGUnO1xyXG4gIH0sXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYW1lU2FuaXRpemVyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBLZXlOYW1lID0gcmVxdWlyZSgnLi9rZXktbmFtZScpO1xyXG5jb25zdCBOYW1lU2FuaXRpemVyID0gcmVxdWlyZSgnLi9uYW1lLXNhbml0aXplcicpO1xyXG5cclxuY29uc3QgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcyA9IHJlcXVpcmUoJy4vZGF0YS9oaWdobGlnaHRpbmctY2xhc3MtbmFtZXMnKTtcclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZUNvbG9yKGRvbUlEKSB7XHJcbiAgcmV0dXJuIE5hbWVTYW5pdGl6ZXIuY29udmVydFBpYW5vS2V5RG9tSURUb0NvbG9yKGRvbUlEKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpIHtcclxuICBjb25zdCBrZXlOYW1lQmFzZU5hbWUgPSBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9LZXlOYW1lQmFzZU5hbWUoZG9tSUQpO1xyXG4gIGNvbnN0IGtleU5hbWUgPSBuZXcgS2V5TmFtZShrZXlOYW1lQmFzZU5hbWUpO1xyXG4gIHJldHVybiBrZXlOYW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVPY3RhdmUoZG9tSUQpIHtcclxuICByZXR1cm4gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvT2N0YXZlTnVtYmVyKGRvbUlEKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkTW91c2VMaXN0ZW5lcihwaWFub0tleSkge1xyXG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xyXG4gICAgaWYgKHBpYW5vS2V5LmlzSGlnaGxpZ2h0ZWQoKSkgcmV0dXJuO1xyXG4gICAgcGlhbm9LZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKHRydWUpO1xyXG4gICAgZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xyXG4gICAgICBwaWFub0tleS5kaXNhYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCksIDApO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvdWNoTGlzdGVuZXIocGlhbm9LZXkpIHtcclxuICBwaWFub0tleS5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoKSA9PiB7XHJcbiAgICBpZiAocGlhbm9LZXkuaXNIaWdobGlnaHRlZCgpKSByZXR1cm47XHJcbiAgICBwaWFub0tleS5lbmFibGVIaWdobGlnaHRpbmcodHJ1ZSk7XHJcbiAgICBmdW5jdGlvbiBvblRvdWNoRW5kKCkge1xyXG4gICAgICBwaWFub0tleS5kaXNhYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKSwgMCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHBpYW5vS2V5KSB7XHJcbiAgYWRkTW91c2VMaXN0ZW5lcihwaWFub0tleSk7XHJcbiAgYWRkVG91Y2hMaXN0ZW5lcihwaWFub0tleSk7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBQaWFub0tleSB7XHJcbiAgY29uc3RydWN0b3IoZG9tSUQsIGtleUluZGV4KSB7XHJcbiAgICB0aGlzLmluZGV4ID0ga2V5SW5kZXg7XHJcbiAgICB0aGlzLm5hbWVzID0gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpO1xyXG4gICAgdGhpcy5jb2xvciA9IGRldGVybWluZUNvbG9yKGRvbUlEKTtcclxuICAgIHRoaXMub2N0YXZlID0gZGV0ZXJtaW5lT2N0YXZlKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fa2V5LW5hbWUnKTtcclxuICAgIHRoaXMuZG9tRmluZ2VyaW5nVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19maW5nZXJpbmcnKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBpc0hpZ2hsaWdodGVkKCkge1xyXG4gICAgbGV0IGlzSGlnaGxpZ2h0ZWQgPSBmYWxzZTtcclxuICAgIGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcclxuICAgICAgICBpc0hpZ2hsaWdodGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gaXNIaWdobGlnaHRlZDtcclxuICB9XHJcblxyXG4gIGVuYWJsZUhpZ2hsaWdodGluZyhpc1Jvb3RLZXkgPSBmYWxzZSkge1xyXG4gICAgbGV0IGhpZ2hsaWdodENsYXNzTmFtZSA9ICcnO1xyXG4gICAgaWYgKGlzUm9vdEtleSkge1xyXG4gICAgICBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjay0tcm9vdCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjayc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmFkZChoaWdobGlnaHRDbGFzc05hbWUpO1xyXG4gIH1cclxuXHJcbiAgZGlzYWJsZUhpZ2hsaWdodGluZygpIHtcclxuICAgIGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XHJcbiAgICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldEN1c3RvbURpc3BsYXlOYW1lKG5hbWUpIHtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gbmFtZTtcclxuICB9XHJcblxyXG4gIHNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpIHtcclxuICAgIGNvbnN0IGFsaWFzID0gdGhpcy5uYW1lcy5nZXRBbGlhc09mVHlwZSh0eXBlKTtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gYWxpYXM7XHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50TmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudDtcclxuICB9XHJcblxyXG4gIGdldEtleUluZGV4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5kZXg7XHJcbiAgfVxyXG5cclxuICBnZXREb21Ob2RlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZG9tTm9kZTtcclxuICB9XHJcblxyXG4gIHJlc2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAvLyBUT0RPOiBHZXQgZGVmYXVsdCB0eXBlIGZyb20gc2V0dGluZ3Mgb2JqZWN0XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGlhbm9LZXk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IE5hbWVTYW5pdGl6ZXIgPSByZXF1aXJlKCcuL25hbWUtc2FuaXRpemVyJyk7XHJcbmNvbnN0IFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xyXG5cclxubGV0IHNjYWxlU3RhdGUgPSAnJztcclxuXHJcbmZ1bmN0aW9uIGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidXR0b25FbGVtKSB7XHJcbiAgY29uc3QgYnV0dG9uSUQgPSBidXR0b25FbGVtLmlkO1xyXG4gIGNvbnN0IHN0YXRlTmFtZSA9IE5hbWVTYW5pdGl6ZXIuY29udmVydEJ1dHRvbklEVG9TdGF0ZU5hbWUoYnV0dG9uSUQpO1xyXG4gIHJldHVybiBzdGF0ZU5hbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEhpZ2hsaWdodE9uQnV0dG9uKGJ0bikge1xyXG4gIGJ0bi5jbGFzc0xpc3QuYWRkKCdidG4tLXNlbGVjdGVkJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0SGlnaGxpZ2h0T25BbGxCdXR0b25zKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIHNjYWxlQ29udHJvbGxlci5idXR0b25zLmZvckVhY2goKGJ0bikgPT4ge1xyXG4gICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi0tc2VsZWN0ZWQnKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5mb09mU2NhbGVTdGF0ZSgpIHtcclxuICBjb25zdCBbY2hvcmRPclNjYWxlLCAuLi5zY2FsZVR5cGVUb2tlbnNdID0gc2NhbGVTdGF0ZS5zcGxpdCgnLScpO1xyXG4gIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlVHlwZVRva2Vucy5qb2luKCcgJyk7XHJcbiAgcmV0dXJuIHsgY2hvcmRPclNjYWxlLCBzY2FsZVR5cGUgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkQnV0dG9uTGlzdGVuZXJzKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIHNjYWxlQ29udHJvbGxlci5idXR0b25zLmZvckVhY2goKGJ0bikgPT4ge1xyXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBzY2FsZVN0YXRlID0gZ2V0U3RhdGVOYW1lRnJvbUJ1dHRvbklEKGJ0bik7XHJcbiAgICAgIHJlc2V0SGlnaGxpZ2h0T25BbGxCdXR0b25zKHNjYWxlQ29udHJvbGxlcik7XHJcbiAgICAgIGFkZEhpZ2hsaWdodE9uQnV0dG9uKGJ0bik7XHJcbiAgICAgIFNjYWxlRGlzcGxheS5zZXRUZXh0KHNjYWxlU3RhdGUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZERyb3Bkb3duVGl0bGVMaXN0ZW5lcnMoc2NhbGVDb250cm9sbGVyKSB7XHJcbiAgc2NhbGVDb250cm9sbGVyLmNhdGVnb3JpZXMuZm9yRWFjaCgoY2F0ZWdvcnkpID0+IHtcclxuICAgIGNvbnN0IGNhdGVnb3J5VGl0bGUgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuc2NhbGUtbGlzdF9fY2F0ZWdvcnktdGl0bGUnKTtcclxuICAgIGNvbnN0IGRyb3Bkb3duTGlzdCA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1saXN0X19jYXRlZ29yeS1saXN0Jyk7XHJcbiAgICBjb25zdCBkcm9wZG93bkFycm93ID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLWFycm93Jyk7XHJcbiAgICBjYXRlZ29yeVRpdGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBjYXRlZ29yeVRpdGxlLmNsYXNzTGlzdC50b2dnbGUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5LXRpdGxlLS1hY3RpdmUnKTtcclxuICAgICAgZHJvcGRvd25MaXN0LmNsYXNzTGlzdC50b2dnbGUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QtLWhpZGRlbicpO1xyXG4gICAgICBkcm9wZG93bkFycm93LmNsYXNzTGlzdC50b2dnbGUoJ2Ryb3Bkb3duLWFycm93LS1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIGFkZEJ1dHRvbkxpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpO1xyXG4gIGFkZERyb3Bkb3duVGl0bGVMaXN0ZW5lcnMoc2NhbGVDb250cm9sbGVyKTtcclxufVxyXG5cclxuXHJcbmNsYXNzIHNjYWxlQ29udHJvbGxlciB7XHJcbiAgc3RhdGljIGluaXQoKSB7XHJcbiAgICB0aGlzLmJ1dHRvbnMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnRuJyldO1xyXG4gICAgdGhpcy5jYXRlZ29yaWVzID0gWy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5JyldO1xyXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRDaG9yZE9yU2NhbGUoKSB7XHJcbiAgICBjb25zdCB7IGNob3JkT3JTY2FsZSB9ID0gZ2V0SW5mb09mU2NhbGVTdGF0ZSgpO1xyXG4gICAgcmV0dXJuIGNob3JkT3JTY2FsZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRTY2FsZVR5cGUoKSB7XHJcbiAgICBjb25zdCB7IHNjYWxlVHlwZSB9ID0gZ2V0SW5mb09mU2NhbGVTdGF0ZSgpO1xyXG4gICAgcmV0dXJuIHNjYWxlVHlwZTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNjYWxlQ29udHJvbGxlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcblxyXG5jb25zdCBzY2FsZURhdGEgPSByZXF1aXJlKCcuL2RhdGEvc2NhbGUtZGF0YScpO1xyXG5cclxuZnVuY3Rpb24gZ2V0U2NhbGVQYXR0ZXJuKHNjYWxlVHlwZSkge1xyXG4gIGNvbnN0IHBhdHRlcm4gPSBzY2FsZURhdGEucGF0dGVybnMuc2NhbGVzW3NjYWxlVHlwZV07XHJcbiAgaWYgKHBhdHRlcm4gPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xyXG4gIHJldHVybiBwYXR0ZXJuO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDaG9yZFBhdHRlcm4oc2NhbGVUeXBlKSB7XHJcbiAgY29uc3QgcGF0dGVybiA9IHNjYWxlRGF0YS5wYXR0ZXJucy5jaG9yZHNbc2NhbGVUeXBlXTtcclxuICBpZiAocGF0dGVybiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBhdHRlcm4oKSB7XHJcbiAgY29uc3QgY2hvcmRPclNjYWxlID0gU2NhbGVDb250cm9sbGVyLmdldENob3JkT3JTY2FsZSgpO1xyXG4gIGNvbnN0IHNjYWxlVHlwZSA9IFNjYWxlQ29udHJvbGxlci5nZXRTY2FsZVR5cGUoKTtcclxuICBsZXQgcGF0dGVybiA9IFtdO1xyXG4gIGlmIChjaG9yZE9yU2NhbGUgPT09ICdzY2FsZScpIHtcclxuICAgIHBhdHRlcm4gPSBnZXRTY2FsZVBhdHRlcm4oc2NhbGVUeXBlKTtcclxuICB9IGVsc2UgaWYgKGNob3JkT3JTY2FsZSA9PT0gJ2Nob3JkJykge1xyXG4gICAgcGF0dGVybiA9IGdldENob3JkUGF0dGVybihzY2FsZVR5cGUpO1xyXG4gIH1cclxuICByZXR1cm4gcGF0dGVybjtcclxufVxyXG5cclxuXHJcbmNsYXNzIHNjYWxlRGF0YWJhc2Uge1xyXG4gIHN0YXRpYyBnZXRQYXR0ZXJuT2ZTZWxlY3RlZFNjYWxlKCkge1xyXG4gICAgY29uc3Qgc2NhbGVQYXR0ZXJuID0gZ2V0UGF0dGVybigpO1xyXG4gICAgcmV0dXJuIHNjYWxlUGF0dGVybjtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2NhbGVEYXRhYmFzZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY2xhc3MgU2NhbGVEaXNwbGF5IHtcclxuICBzdGF0aWMgaW5pdCgpIHtcclxuICAgIHRoaXMuZG9tRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1kaXNwbGF5X190ZXh0LXBhbmVsJyk7XHJcbiAgICB0aGlzLmRvbUVsZW0udGV4dENvbnRlbnQgPSAnJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZXRUZXh0KHRleHQpIHtcclxuICAgIHRoaXMuZG9tRWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjYWxlRGlzcGxheTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY2xhc3MgVGltZXJNYW5hZ2VyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudGltZXJzID0gW107XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPOiBUYWtlIG9mZnNldCB0aW1lIGZyb20gc2V0dGluZ3NcclxuICBhZGRUaW1lcihjYWxsYmFjaywgb2Zmc2V0SW5kZXgpIHtcclxuICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dChjYWxsYmFjaywgMjAwICogb2Zmc2V0SW5kZXgpO1xyXG4gICAgdGhpcy50aW1lcnMucHVzaCh0aW1lcik7XHJcbiAgfVxyXG5cclxuICBjbGVhckFsbFRpbWVycygpIHtcclxuICAgIHRoaXMudGltZXJzLmZvckVhY2goKHRpbWVyKSA9PiB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICB9KTtcclxuICAgIHRoaXMudGltZXJzID0gW107XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyTWFuYWdlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGlzIG51bWJlciBpcyBpbmNsdWRlZFxuICogQHJldHVybnMge251bWJlcltdfVxuICovXG5mdW5jdGlvbiByYW5nZShzdGFydCwgZW5kKSB7XG4gIHJldHVybiBbLi4uQXJyYXkoZW5kIC0gc3RhcnQgKyAxKS5maWxsKCkubWFwKChfLCBpKSA9PiBpICsgMSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgcmFuZ2UgfTtcbiJdfQ==
