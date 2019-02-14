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
const ScaleDatabase = require('./scale-database');
const TimerManager = require('./timer-manager');

const pianoKeyBaseIDs = require('./data/piano-key-base-ids');
const { range, usePattern } = require('./util');

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
    this.timerManager = new TimerManager();
  }

  enableHiddenForAllTiles() {
    this.degreeTiles.forEach((tile) => {
      tile.enableHidden();
    });
  }

  setDisplayedTilesForScaleStartingFromIndex(index) {
    const scalePattern = ScaleDatabase.getPatternOfSelectedScale();
    if (scalePattern.length === 0) return;
    this.enableHiddenForAllTiles();
    this.resetTextOnAllTiles();
    this.timerManager.clearAllTimers();
    usePattern(scalePattern)
      .forItems(this.degreeTiles)
      .fromIndex(index)
      .withTimer(this.timerManager)
      .runForFirstItem((tile) => {
        const rootOffset = 0;
        tile.setDegreeNumber(rootOffset);
        tile.disableHidden();
      })
      .run((tile, offset) => {
        tile.setDegreeNumber(offset);
        tile.disableHidden();
      });
  }

  resetTextOnAllTiles() {
    this.degreeTiles.forEach((tile) => {
      tile.setDegreeText('');
    });
  }
}

module.exports = DegreeDisplay;

},{"./data/piano-key-base-ids":5,"./degree-tile":8,"./scale-database":15,"./timer-manager":17,"./util":18}],8:[function(require,module,exports){
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
    const degreeType = 'movableDoFlat'; // Settings.getDegreeType();
    let degree = '';
    if (chordOrScale === 'scale') {
      const scaleSet = offsetToDegreeSets.scale[degreeType];
      if (scaleSet === undefined) return;
      degree = scaleSet[offsetFromRootNote];
    } else if (chordOrScale === 'chord') {
      const chordSet = offsetToDegreeSets.chord[degreeType];
      if (chordSet === undefined) return;
      degree = chordSet[offsetFromRootNote];
    }
    this.setDegreeText(degree);
  }

  setDegreeText(text) {
    this.domTextNode.textContent = text;
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
mainKeyboard.setDisplayNameForAllKeysOfType('fixedDoFlat');

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

const { range, usePattern } = require('./util');
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
    keyboard.degreeDisplay.setDisplayedTilesForScaleStartingFromIndex(index);
  });
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
    usePattern(scalePattern)
      .forItems(this.keys)
      .fromIndex(index)
      .withTimer(this.timerManager)
      .runForFirstItem((rootKey) => {
        const isRootKey = true;
        rootKey.enableHighlighting(isRootKey);
      })
      .run((key) => {
        key.enableHighlighting();
      });
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

/**
 * Runs a callback for each item of items, iterating using increments from the patternArray
 * @param {Array} patternArray
 * @param {Array} items
 * @param {number} index Applies callback starting from index + the first increment of the pattern
 * @param {TimerManager} timerManager Optional manager for timeouts between each callback
 * @param {Function} firstItemCallback
 * @param {Function} callbackForEachItem
 */
function usePattern(patternArray) {
  return {
    forItems(items) {
      this.items = items;
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
    runForFirstItem(firstItemCallback) {
      this.firstItemCallback = firstItemCallback;
      return this;
    },
    run(callbackForEachItem) {
      if (this.firstItemCallback !== undefined) {
        const firstItem = this.items[this.index];
        this.firstItemCallback(firstItem);
      }

      let offset = 0;
      patternArray.forEach((increment, idx) => {
        this.index += increment;
        offset += increment;
        const closureOffset = offset;

        const nextItem = this.items[this.index];
        if (nextItem === undefined) return;

        if (this.timerManager === undefined) {
          callbackForEachItem(nextItem, offset);
        } else {
          this.timerManager.addTimer(() => {
            callbackForEachItem(nextItem, closureOffset);
          }, idx + 1);
        }
      });
    },
  };
}

module.exports = { range, usePattern };

},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzLmpzIiwiYXBwL3NyYy9kYXRhL2tleS1uYW1lLXNldHMuanMiLCJhcHAvc3JjL2RhdGEva2V5LW5hbWUtdG8taWQtZW51bS5qcyIsImFwcC9zcmMvZGF0YS9vZmZzZXQtdG8tZGVncmVlLXNldHMuanMiLCJhcHAvc3JjL2RhdGEvcGlhbm8ta2V5LWJhc2UtaWRzLmpzIiwiYXBwL3NyYy9kYXRhL3NjYWxlLWRhdGEuanMiLCJhcHAvc3JjL2RlZ3JlZS1kaXNwbGF5LmpzIiwiYXBwL3NyYy9kZWdyZWUtdGlsZS5qcyIsImFwcC9zcmMvaW5kZXguanMiLCJhcHAvc3JjL2tleS1uYW1lLmpzIiwiYXBwL3NyYy9rZXlib2FyZC5qcyIsImFwcC9zcmMvbmFtZS1zYW5pdGl6ZXIuanMiLCJhcHAvc3JjL3BpYW5vLWtleS5qcyIsImFwcC9zcmMvc2NhbGUtY29udHJvbGxlci5qcyIsImFwcC9zcmMvc2NhbGUtZGF0YWJhc2UuanMiLCJhcHAvc3JjL3NjYWxlLWRpc3BsYXkuanMiLCJhcHAvc3JjL3RpbWVyLW1hbmFnZXIuanMiLCJhcHAvc3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcyA9IFtcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUtLXJvb3QnLFxyXG4gICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjay0tcm9vdCcsXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyxcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2snLFxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBoaWdobGlnaHRpbmdDbGFzc05hbWVzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBrZXlOYW1lU2V0cyA9IHtcclxuICBzdGFuZGFyZDogWydDJywgJ0Pima8nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Lima0nLCAnQiddLFxyXG4gIHNoYXJwOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXHJcbiAgZmxhdDogWydDJywgJ0Tima0nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdH4pmtJywgJ0cnLCAnQeKZrScsICdBJywgJ0Lima0nLCAnQiddLFxyXG4gIGZpeGVkRG9TaGFycDogWydEbycsICdEaScsICdSZScsICdSaScsICdNaScsICdGYScsICdGaScsICdTbycsICdTaScsICdMYScsICdMaScsICdUaSddLFxyXG4gIGZpeGVkRG9GbGF0OiBbJ0RvJywgJ1JhJywgJ1JlJywgJ01lJywgJ01pJywgJ0ZhJywgJ1NlJywgJ1NvJywgJ0xlJywgJ0xhJywgJ1RlJywgJ1RpJ10sXHJcbiAgc3BlY2lhbEZTaGFycE06IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXHJcbiAgc3BlY2lhbENTaGFycE06IFsnQiMnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlOYW1lU2V0cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qga2V5TmFtZVRvSURFbnVtID0gT2JqZWN0LmZyZWV6ZSh7XHJcbiAgJ0MnOiAwLFxyXG4gICdD4pmvJzogMSxcclxuICAnRCc6IDIsXHJcbiAgJ0Tima8nOiAzLFxyXG4gICdFJzogNCxcclxuICAnRic6IDUsXHJcbiAgJ0bima8nOiA2LFxyXG4gICdHJzogNyxcclxuICAnR+KZryc6IDgsXHJcbiAgJ0EnOiA5LFxyXG4gICdB4pmvJzogMTAsXHJcbiAgJ0InOiAxMSxcclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGtleU5hbWVUb0lERW51bTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qgb2Zmc2V0VG9EZWdyZWVTZXRzID0ge1xyXG4gIHNjYWxlOiB7XHJcbiAgICBzdGFuZGFyZDogWycxJywgJ2IyJywgJzInLCAnYjMnLCAnMycsICc0JywgJ2I1JywgJzUnLCAnYjYnLCAnNicsICdiNycsICc3J10sXHJcbiAgICBtb3ZhYmxlRG9TaGFycDogWydEbycsICdEaScsICdSZScsICdSaScsICdNaScsICdGYScsICdGaScsICdTbycsICdTaScsICdMYScsICdMaScsICdUaSddLFxyXG4gICAgbW92YWJsZURvRmxhdDogWydEbycsICdSYScsICdSZScsICdNZScsICdNaScsICdGYScsICdTZScsICdTbycsICdMZScsICdMYScsICdUZScsICdUaSddLFxyXG4gIH0sXHJcbiAgY2hvcmQ6IHtcclxuICAgIHN0YW5kYXJkOiBbJzEnLCAnYjInLCAnMicsICdiMycsICczJywgJzQnLCAnYjUnLCAnNScsICdiNicsICc2JywgJ2I3JywgJzcnLCAnMScsICdiOScsICc5JywgJ3M5JywgJzMnLCAnYjExJywgJzExJ10sXHJcbiAgfSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gb2Zmc2V0VG9EZWdyZWVTZXRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBwaWFub0tleUJhc2VJRHMgPSBbXHJcbiAgJ2MnLFxyXG4gICdjLXNoYXJwJyxcclxuICAnZCcsXHJcbiAgJ2Qtc2hhcnAnLFxyXG4gICdlJyxcclxuICAnZicsXHJcbiAgJ2Ytc2hhcnAnLFxyXG4gICdnJyxcclxuICAnZy1zaGFycCcsXHJcbiAgJ2EnLFxyXG4gICdhLXNoYXJwJyxcclxuICAnYicsXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBpYW5vS2V5QmFzZUlEcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgZGF0YSA9IHtcclxuICBwYXR0ZXJuczoge1xyXG4gICAgc2NhbGVzOiB7XHJcbiAgICAgICdtYWpvcic6IFsyLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgJ21pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAnaGFybW9uaWMgbWlub3InOiBbMiwgMSwgMiwgMiwgMSwgM10sXHJcbiAgICAgICdtZWxvZGljIG1pbm9yJzogWzIsIDEsIDIsIDIsIDIsIDJdLFxyXG5cclxuICAgIH0sXHJcbiAgICBjaG9yZHM6IHtcclxuICAgICAgJ21ham9yJzogWzQsIDNdLFxyXG4gICAgICAnbWlub3InOiBbMywgNF0sXHJcbiAgICAgICdkaW1pbmlzaGVkJzogWzMsIDNdLFxyXG4gICAgICAnYXVnbWVudGVkJzogWzQsIDRdLFxyXG4gICAgICAnc3VzcGVuZGVkMic6IFsyLCA1XSxcclxuICAgICAgJ3N1c3BlbmRlZDQnOiBbNSwgMl0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGE7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IERlZ3JlZVRpbGUgPSByZXF1aXJlKCcuL2RlZ3JlZS10aWxlJyk7XHJcbmNvbnN0IFNjYWxlRGF0YWJhc2UgPSByZXF1aXJlKCcuL3NjYWxlLWRhdGFiYXNlJyk7XHJcbmNvbnN0IFRpbWVyTWFuYWdlciA9IHJlcXVpcmUoJy4vdGltZXItbWFuYWdlcicpO1xyXG5cclxuY29uc3QgcGlhbm9LZXlCYXNlSURzID0gcmVxdWlyZSgnLi9kYXRhL3BpYW5vLWtleS1iYXNlLWlkcycpO1xyXG5jb25zdCB7IHJhbmdlLCB1c2VQYXR0ZXJuIH0gPSByZXF1aXJlKCcuL3V0aWwnKTtcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlRGVncmVlRGlzcGxheVRpbGVEb21JRHMoKSB7XHJcbiAgY29uc3QgdGlsZU5hbWVzID0gW107XHJcbiAgY29uc3QgTlVNX09GX09DVEFWRVMgPSAzO1xyXG4gIHJhbmdlKDEsIE5VTV9PRl9PQ1RBVkVTKS5mb3JFYWNoKChvY3RhdmUpID0+IHtcclxuICAgIHBpYW5vS2V5QmFzZUlEcy5mb3JFYWNoKChiYXNlSUQpID0+IHtcclxuICAgICAgY29uc3QgdGlsZU5hbWUgPSBgZGVncmVlLSR7YmFzZUlEfSR7b2N0YXZlfWA7XHJcbiAgICAgIHRpbGVOYW1lcy5wdXNoKHRpbGVOYW1lKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiB0aWxlTmFtZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERlZ3JlZVRpbGVzVXNpbmdEb21JRHModGlsZU5hbWVJRHMgPSBbXSkge1xyXG4gIGNvbnN0IGRlZ3JlZVRpbGVOb2RlcyA9IFtdO1xyXG4gIHRpbGVOYW1lSURzLmZvckVhY2goKGlkLCB0aWxlSW5kZXgpID0+IHtcclxuICAgIGNvbnN0IGRlZ3JlZVRpbGUgPSBuZXcgRGVncmVlVGlsZShpZCwgdGlsZUluZGV4KTtcclxuICAgIGRlZ3JlZVRpbGVOb2Rlcy5wdXNoKGRlZ3JlZVRpbGUpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBkZWdyZWVUaWxlTm9kZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERlZ3JlZVRpbGVzKCkge1xyXG4gIGNvbnN0IHRpbGVOYW1lSURzID0gZ2VuZXJhdGVEZWdyZWVEaXNwbGF5VGlsZURvbUlEcygpO1xyXG4gIGNvbnN0IGRlZ3JlZVRpbGVzID0gZ2V0RGVncmVlVGlsZXNVc2luZ0RvbUlEcyh0aWxlTmFtZUlEcyk7XHJcbiAgcmV0dXJuIGRlZ3JlZVRpbGVzO1xyXG59XHJcblxyXG5cclxuY2xhc3MgRGVncmVlRGlzcGxheSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmRlZ3JlZVRpbGVzID0gZ2V0RGVncmVlVGlsZXMoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyID0gbmV3IFRpbWVyTWFuYWdlcigpO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlkZGVuRm9yQWxsVGlsZXMoKSB7XHJcbiAgICB0aGlzLmRlZ3JlZVRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcclxuICAgICAgdGlsZS5lbmFibGVIaWRkZW4oKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheWVkVGlsZXNGb3JTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KSB7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSBTY2FsZURhdGFiYXNlLmdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKTtcclxuICAgIGlmIChzY2FsZVBhdHRlcm4ubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLmVuYWJsZUhpZGRlbkZvckFsbFRpbGVzKCk7XHJcbiAgICB0aGlzLnJlc2V0VGV4dE9uQWxsVGlsZXMoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyLmNsZWFyQWxsVGltZXJzKCk7XHJcbiAgICB1c2VQYXR0ZXJuKHNjYWxlUGF0dGVybilcclxuICAgICAgLmZvckl0ZW1zKHRoaXMuZGVncmVlVGlsZXMpXHJcbiAgICAgIC5mcm9tSW5kZXgoaW5kZXgpXHJcbiAgICAgIC53aXRoVGltZXIodGhpcy50aW1lck1hbmFnZXIpXHJcbiAgICAgIC5ydW5Gb3JGaXJzdEl0ZW0oKHRpbGUpID0+IHtcclxuICAgICAgICBjb25zdCByb290T2Zmc2V0ID0gMDtcclxuICAgICAgICB0aWxlLnNldERlZ3JlZU51bWJlcihyb290T2Zmc2V0KTtcclxuICAgICAgICB0aWxlLmRpc2FibGVIaWRkZW4oKTtcclxuICAgICAgfSlcclxuICAgICAgLnJ1bigodGlsZSwgb2Zmc2V0KSA9PiB7XHJcbiAgICAgICAgdGlsZS5zZXREZWdyZWVOdW1iZXIob2Zmc2V0KTtcclxuICAgICAgICB0aWxlLmRpc2FibGVIaWRkZW4oKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXNldFRleHRPbkFsbFRpbGVzKCkge1xyXG4gICAgdGhpcy5kZWdyZWVUaWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XHJcbiAgICAgIHRpbGUuc2V0RGVncmVlVGV4dCgnJyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVncmVlRGlzcGxheTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcblxyXG5jb25zdCBvZmZzZXRUb0RlZ3JlZVNldHMgPSByZXF1aXJlKCcuL2RhdGEvb2Zmc2V0LXRvLWRlZ3JlZS1zZXRzJyk7XHJcblxyXG5jbGFzcyBEZWdyZWVUaWxlIHtcclxuICBjb25zdHJ1Y3Rvcihkb21JRCwgaW5kZXgpIHtcclxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmRlZ3JlZS1kaXNwbGF5X19kZWdyZWUtdGV4dCcpO1xyXG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlkZGVuKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gIH1cclxuXHJcbiAgZGlzYWJsZUhpZGRlbigpIHtcclxuICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICB9XHJcblxyXG4gIHNldERlZ3JlZU51bWJlcihvZmZzZXRGcm9tUm9vdE5vdGUpIHtcclxuICAgIGNvbnN0IGNob3JkT3JTY2FsZSA9IFNjYWxlQ29udHJvbGxlci5nZXRDaG9yZE9yU2NhbGUoKTtcclxuICAgIGNvbnN0IGRlZ3JlZVR5cGUgPSAnbW92YWJsZURvRmxhdCc7IC8vIFNldHRpbmdzLmdldERlZ3JlZVR5cGUoKTtcclxuICAgIGxldCBkZWdyZWUgPSAnJztcclxuICAgIGlmIChjaG9yZE9yU2NhbGUgPT09ICdzY2FsZScpIHtcclxuICAgICAgY29uc3Qgc2NhbGVTZXQgPSBvZmZzZXRUb0RlZ3JlZVNldHMuc2NhbGVbZGVncmVlVHlwZV07XHJcbiAgICAgIGlmIChzY2FsZVNldCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgIGRlZ3JlZSA9IHNjYWxlU2V0W29mZnNldEZyb21Sb290Tm90ZV07XHJcbiAgICB9IGVsc2UgaWYgKGNob3JkT3JTY2FsZSA9PT0gJ2Nob3JkJykge1xyXG4gICAgICBjb25zdCBjaG9yZFNldCA9IG9mZnNldFRvRGVncmVlU2V0cy5jaG9yZFtkZWdyZWVUeXBlXTtcclxuICAgICAgaWYgKGNob3JkU2V0ID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgICAgZGVncmVlID0gY2hvcmRTZXRbb2Zmc2V0RnJvbVJvb3ROb3RlXTtcclxuICAgIH1cclxuICAgIHRoaXMuc2V0RGVncmVlVGV4dChkZWdyZWUpO1xyXG4gIH1cclxuXHJcbiAgc2V0RGVncmVlVGV4dCh0ZXh0KSB7XHJcbiAgICB0aGlzLmRvbVRleHROb2RlLnRleHRDb250ZW50ID0gdGV4dDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVncmVlVGlsZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuL2tleWJvYXJkJyk7XHJcbmNvbnN0IERlZ3JlZURpc3BsYXkgPSByZXF1aXJlKCcuL2RlZ3JlZS1kaXNwbGF5Jyk7XHJcbmNvbnN0IFNjYWxlQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vc2NhbGUtY29udHJvbGxlcicpO1xyXG5jb25zdCBTY2FsZURpc3BsYXkgPSByZXF1aXJlKCcuL3NjYWxlLWRpc3BsYXknKTtcclxuXHJcblNjYWxlQ29udHJvbGxlci5pbml0KCk7XHJcblNjYWxlRGlzcGxheS5pbml0KCk7XHJcblxyXG5jb25zdCBtYWluS2V5Ym9hcmQgPSBuZXcgS2V5Ym9hcmQoKTtcclxubWFpbktleWJvYXJkLnNldERpc3BsYXlOYW1lRm9yQWxsS2V5c09mVHlwZSgnZml4ZWREb0ZsYXQnKTtcclxuXHJcbmNvbnN0IGRlZ3JlZURpc3BsYXkgPSBuZXcgRGVncmVlRGlzcGxheSgpO1xyXG5kZWdyZWVEaXNwbGF5LmVuYWJsZUhpZGRlbkZvckFsbFRpbGVzKCk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGtleU5hbWVTZXRzID0gcmVxdWlyZSgnLi9kYXRhL2tleS1uYW1lLXNldHMnKTtcclxuY29uc3Qga2V5TmFtZVRvSURFbnVtID0gcmVxdWlyZSgnLi9kYXRhL2tleS1uYW1lLXRvLWlkLWVudW0nKTtcclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZUtleUlEKGJhc2VOYW1lKSB7XHJcbiAgY29uc3QgaWQgPSBrZXlOYW1lVG9JREVudW1bYmFzZU5hbWVdO1xyXG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gLTE7XHJcbiAgcmV0dXJuIGlkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRLZXlOYW1lU2V0KHR5cGUpIHtcclxuICBjb25zdCBrZXlOYW1lU2V0ID0ga2V5TmFtZVNldHNbdHlwZV07XHJcbiAgaWYgKGtleU5hbWVTZXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gIHJldHVybiBrZXlOYW1lU2V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbGlhc09mU3BlY2lmaWNUeXBlKGtleU5hbWVTZXQsIGtleUlEKSB7XHJcbiAgY29uc3QgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGtleU5hbWVTZXRba2V5SURdO1xyXG4gIGlmIChhbGlhc09mU3BlY2lmaWNUeXBlID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcclxufVxyXG5cclxuXHJcbmNsYXNzIEtleU5hbWUge1xyXG4gIGNvbnN0cnVjdG9yKGJhc2VOYW1lKSB7XHJcbiAgICB0aGlzLmlkID0gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxpYXNPZlR5cGUodHlwZSkge1xyXG4gICAgY29uc3Qga2V5TmFtZVNldCA9IGdldEtleU5hbWVTZXQodHlwZSk7XHJcbiAgICBjb25zdCBhbGlhc09mU3BlY2lmaWNUeXBlID0gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCB0aGlzLmlkKTtcclxuICAgIHJldHVybiBhbGlhc09mU3BlY2lmaWNUeXBlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlOYW1lO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBQaWFub0tleSA9IHJlcXVpcmUoJy4vcGlhbm8ta2V5Jyk7XHJcbmNvbnN0IFNjYWxlRGF0YWJhc2UgPSByZXF1aXJlKCcuL3NjYWxlLWRhdGFiYXNlJyk7XHJcbmNvbnN0IFRpbWVyTWFuYWdlciA9IHJlcXVpcmUoJy4vdGltZXItbWFuYWdlcicpO1xyXG5jb25zdCBEZWdyZWVEaXNwbGF5ID0gcmVxdWlyZSgnLi9kZWdyZWUtZGlzcGxheScpO1xyXG5cclxuY29uc3QgeyByYW5nZSwgdXNlUGF0dGVybiB9ID0gcmVxdWlyZSgnLi91dGlsJyk7XHJcbmNvbnN0IHBpYW5vS2V5QmFzZUlEcyA9IHJlcXVpcmUoJy4vZGF0YS9waWFuby1rZXktYmFzZS1pZHMnKTtcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlS2V5TmFtZURvbUlEcygpIHtcclxuICBjb25zdCBrZXlOYW1lc1dpdGhPY3RhdmVzID0gW107XHJcbiAgY29uc3QgTlVNX09GX09DVEFWRVMgPSAzO1xyXG4gIHJhbmdlKDEsIE5VTV9PRl9PQ1RBVkVTKS5mb3JFYWNoKChvY3RhdmUpID0+IHtcclxuICAgIHBpYW5vS2V5QmFzZUlEcy5mb3JFYWNoKChiYXNlSUQpID0+IHtcclxuICAgICAgY29uc3QgbmFtZVdpdGhPY3RhdmUgPSBiYXNlSUQgKyBvY3RhdmU7XHJcbiAgICAgIGtleU5hbWVzV2l0aE9jdGF2ZXMucHVzaChuYW1lV2l0aE9jdGF2ZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4ga2V5TmFtZXNXaXRoT2N0YXZlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlzVXNpbmdEb21JRHMoa2V5TmFtZUlEcyA9IFtdKSB7XHJcbiAgY29uc3QgcGlhbm9LZXlOb2RlcyA9IFtdO1xyXG4gIGtleU5hbWVJRHMuZm9yRWFjaCgoaWQsIGtleUluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBwaWFub0tleSA9IG5ldyBQaWFub0tleShpZCwga2V5SW5kZXgpO1xyXG4gICAgcGlhbm9LZXlOb2Rlcy5wdXNoKHBpYW5vS2V5KTtcclxuICB9KTtcclxuICByZXR1cm4gcGlhbm9LZXlOb2RlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlzKCkge1xyXG4gIGNvbnN0IGtleU5hbWVJRHMgPSBnZW5lcmF0ZUtleU5hbWVEb21JRHMoKTtcclxuICBjb25zdCBwaWFub0tleXMgPSBnZXRQaWFub0tleXNVc2luZ0RvbUlEcyhrZXlOYW1lSURzKTtcclxuICByZXR1cm4gcGlhbm9LZXlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKGtleWJvYXJkKSB7XHJcbiAga2V5Ym9hcmQuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZXZlbnRTb3VyY2UgPSBrZXlib2FyZC5rZXlzLmZpbmQoaXRlbSA9PiBpdGVtLmdldERvbU5vZGUoKSA9PT0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5rZXlib2FyZF9fa2V5JykpO1xyXG4gICAgaWYgKGV2ZW50U291cmNlID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgIGNvbnN0IGluZGV4ID0gZXZlbnRTb3VyY2UuZ2V0S2V5SW5kZXgoKTtcclxuICAgIGtleWJvYXJkLmVuYWJsZUhpZ2hsaWdodGluZ0ZvclNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpO1xyXG4gICAga2V5Ym9hcmQuZGVncmVlRGlzcGxheS5zZXREaXNwbGF5ZWRUaWxlc0ZvclNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuY2xhc3MgS2V5Ym9hcmQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmtleWJvYXJkJyk7XHJcbiAgICB0aGlzLmtleXMgPSBnZXRQaWFub0tleXMoKTtcclxuICAgIHRoaXMuZGVncmVlRGlzcGxheSA9IG5ldyBEZWdyZWVEaXNwbGF5KCk7XHJcbiAgICB0aGlzLnRpbWVyTWFuYWdlciA9IG5ldyBUaW1lck1hbmFnZXIoKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlnaGxpZ2h0aW5nRm9yQWxsS2V5cygpIHtcclxuICAgIHRoaXMua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAga2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlnaGxpZ2h0aW5nRm9yU2NhbGVTdGFydGluZ0Zyb21JbmRleChpbmRleCkge1xyXG4gICAgY29uc3Qgc2NhbGVQYXR0ZXJuID0gU2NhbGVEYXRhYmFzZS5nZXRQYXR0ZXJuT2ZTZWxlY3RlZFNjYWxlKCk7XHJcbiAgICBpZiAoc2NhbGVQYXR0ZXJuLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgdGhpcy50aW1lck1hbmFnZXIuY2xlYXJBbGxUaW1lcnMoKTtcclxuICAgIHRoaXMuZGlzYWJsZUhpZ2hsaWdodGluZ0ZvckFsbEtleXMoKTtcclxuICAgIHVzZVBhdHRlcm4oc2NhbGVQYXR0ZXJuKVxyXG4gICAgICAuZm9ySXRlbXModGhpcy5rZXlzKVxyXG4gICAgICAuZnJvbUluZGV4KGluZGV4KVxyXG4gICAgICAud2l0aFRpbWVyKHRoaXMudGltZXJNYW5hZ2VyKVxyXG4gICAgICAucnVuRm9yRmlyc3RJdGVtKChyb290S2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNSb290S2V5ID0gdHJ1ZTtcclxuICAgICAgICByb290S2V5LmVuYWJsZUhpZ2hsaWdodGluZyhpc1Jvb3RLZXkpO1xyXG4gICAgICB9KVxyXG4gICAgICAucnVuKChrZXkpID0+IHtcclxuICAgICAgICBrZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheU5hbWVGb3JBbGxLZXlzT2ZUeXBlKHR5cGUpIHtcclxuICAgIHRoaXMua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAga2V5LnNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBOYW1lU2FuaXRpemVyID0ge1xyXG5cclxuICAvKiAnYnRuLXNjYWxlLW1ham9yJyAtPiAnc2NhbGUtbWFqb3InICovXHJcbiAgY29udmVydEJ1dHRvbklEVG9TdGF0ZU5hbWUoYnV0dG9uSUQpIHtcclxuICAgIGlmIChidXR0b25JRCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgICBjb25zdCBzdGF0ZU5hbWUgPSBidXR0b25JRC5zdWJzdHJpbmcoNCk7XHJcbiAgICByZXR1cm4gc3RhdGVOYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJ2Pima8nICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb0tleU5hbWVCYXNlTmFtZShwaWFub0tleURvbUlEKSB7XHJcbiAgICBpZiAocGlhbm9LZXlEb21JRCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgICBjb25zdCB0cmltbWVkTmFtZSA9IHBpYW5vS2V5RG9tSUQuc2xpY2UoMCwgLTEpO1xyXG4gICAgY29uc3Qga2V5TmFtZUJhc2VOYW1lID0gdHJpbW1lZE5hbWUucmVwbGFjZSgnLXNoYXJwJywgJ+KZrycpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICByZXR1cm4ga2V5TmFtZUJhc2VOYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJzEnICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb09jdGF2ZU51bWJlcihwaWFub0tleURvbUlEKSB7XHJcbiAgICByZXR1cm4gcGlhbm9LZXlEb21JRC5zbGljZSgtMSk7XHJcbiAgfSxcclxuXHJcbiAgLyogJ2Mtc2hhcnAxJyAtPiAnYmxhY2snICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb0NvbG9yKHBpYW5vS2V5RG9tSUQpIHtcclxuICAgIHJldHVybiAocGlhbm9LZXlEb21JRC5pbmRleE9mKCdzaGFycCcpICE9PSAtMSkgPyAnYmxhY2snIDogJ3doaXRlJztcclxuICB9LFxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmFtZVNhbml0aXplcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgS2V5TmFtZSA9IHJlcXVpcmUoJy4va2V5LW5hbWUnKTtcclxuY29uc3QgTmFtZVNhbml0aXplciA9IHJlcXVpcmUoJy4vbmFtZS1zYW5pdGl6ZXInKTtcclxuXHJcbmNvbnN0IGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMgPSByZXF1aXJlKCcuL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzJyk7XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVDb2xvcihkb21JRCkge1xyXG4gIHJldHVybiBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9Db2xvcihkb21JRCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZU5hbWVzKGRvbUlEKSB7XHJcbiAgY29uc3Qga2V5TmFtZUJhc2VOYW1lID0gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvS2V5TmFtZUJhc2VOYW1lKGRvbUlEKTtcclxuICBjb25zdCBrZXlOYW1lID0gbmV3IEtleU5hbWUoa2V5TmFtZUJhc2VOYW1lKTtcclxuICByZXR1cm4ga2V5TmFtZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lT2N0YXZlKGRvbUlEKSB7XHJcbiAgcmV0dXJuIE5hbWVTYW5pdGl6ZXIuY29udmVydFBpYW5vS2V5RG9tSURUb09jdGF2ZU51bWJlcihkb21JRCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZE1vdXNlTGlzdGVuZXIocGlhbm9LZXkpIHtcclxuICBwaWFub0tleS5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHtcclxuICAgIGlmIChwaWFub0tleS5pc0hpZ2hsaWdodGVkKCkpIHJldHVybjtcclxuICAgIHBpYW5vS2V5LmVuYWJsZUhpZ2hsaWdodGluZyh0cnVlKTtcclxuICAgIGZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcclxuICAgICAgcGlhbm9LZXkuZGlzYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgICBzZXRUaW1lb3V0KGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApLCAwKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUb3VjaExpc3RlbmVyKHBpYW5vS2V5KSB7XHJcbiAgcGlhbm9LZXkuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKCkgPT4ge1xyXG4gICAgaWYgKHBpYW5vS2V5LmlzSGlnaGxpZ2h0ZWQoKSkgcmV0dXJuO1xyXG4gICAgcGlhbm9LZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKHRydWUpO1xyXG4gICAgZnVuY3Rpb24gb25Ub3VjaEVuZCgpIHtcclxuICAgICAgcGlhbm9LZXkuZGlzYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgICBzZXRUaW1lb3V0KGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCksIDApO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhwaWFub0tleSkge1xyXG4gIGFkZE1vdXNlTGlzdGVuZXIocGlhbm9LZXkpO1xyXG4gIGFkZFRvdWNoTGlzdGVuZXIocGlhbm9LZXkpO1xyXG59XHJcblxyXG5cclxuY2xhc3MgUGlhbm9LZXkge1xyXG4gIGNvbnN0cnVjdG9yKGRvbUlELCBrZXlJbmRleCkge1xyXG4gICAgdGhpcy5pbmRleCA9IGtleUluZGV4O1xyXG4gICAgdGhpcy5uYW1lcyA9IGRldGVybWluZU5hbWVzKGRvbUlEKTtcclxuICAgIHRoaXMuY29sb3IgPSBkZXRlcm1pbmVDb2xvcihkb21JRCk7XHJcbiAgICB0aGlzLm9jdGF2ZSA9IGRldGVybWluZU9jdGF2ZShkb21JRCk7XHJcbiAgICB0aGlzLmRvbU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkb21JRCk7XHJcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmRfX2tleS1uYW1lJyk7XHJcbiAgICB0aGlzLmRvbUZpbmdlcmluZ1RleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fZmluZ2VyaW5nJyk7XHJcbiAgICByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaXNIaWdobGlnaHRlZCgpIHtcclxuICAgIGxldCBpc0hpZ2hsaWdodGVkID0gZmFsc2U7XHJcbiAgICBoaWdobGlnaHRpbmdDbGFzc05hbWVzLmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XHJcbiAgICAgICAgaXNIaWdobGlnaHRlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGlzSGlnaGxpZ2h0ZWQ7XHJcbiAgfVxyXG5cclxuICBlbmFibGVIaWdobGlnaHRpbmcoaXNSb290S2V5ID0gZmFsc2UpIHtcclxuICAgIGxldCBoaWdobGlnaHRDbGFzc05hbWUgPSAnJztcclxuICAgIGlmIChpc1Jvb3RLZXkpIHtcclxuICAgICAgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/ICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZS0tcm9vdCcgOiAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2stLXJvb3QnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/ICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScgOiAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2snO1xyXG4gICAgfVxyXG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoaGlnaGxpZ2h0Q2xhc3NOYW1lKTtcclxuICB9XHJcblxyXG4gIGRpc2FibGVIaWdobGlnaHRpbmcoKSB7XHJcbiAgICBoaWdobGlnaHRpbmdDbGFzc05hbWVzLmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xyXG4gICAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRDdXN0b21EaXNwbGF5TmFtZShuYW1lKSB7XHJcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IG5hbWU7XHJcbiAgfVxyXG5cclxuICBzZXREaXNwbGF5TmFtZU9mVHlwZSh0eXBlKSB7XHJcbiAgICBjb25zdCBhbGlhcyA9IHRoaXMubmFtZXMuZ2V0QWxpYXNPZlR5cGUodHlwZSk7XHJcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IGFsaWFzO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudE5hbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQ7XHJcbiAgfVxyXG5cclxuICBnZXRLZXlJbmRleCgpIHtcclxuICAgIHJldHVybiB0aGlzLmluZGV4O1xyXG4gIH1cclxuXHJcbiAgZ2V0RG9tTm9kZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRvbU5vZGU7XHJcbiAgfVxyXG5cclxuICByZXNldERpc3BsYXlOYW1lKCkge1xyXG4gICAgLy8gVE9ETzogR2V0IGRlZmF1bHQgdHlwZSBmcm9tIHNldHRpbmdzIG9iamVjdFxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBpYW5vS2V5O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBOYW1lU2FuaXRpemVyID0gcmVxdWlyZSgnLi9uYW1lLXNhbml0aXplcicpO1xyXG5jb25zdCBTY2FsZURpc3BsYXkgPSByZXF1aXJlKCcuL3NjYWxlLWRpc3BsYXknKTtcclxuXHJcbmxldCBzY2FsZVN0YXRlID0gJyc7XHJcblxyXG5mdW5jdGlvbiBnZXRTdGF0ZU5hbWVGcm9tQnV0dG9uSUQoYnV0dG9uRWxlbSkge1xyXG4gIGNvbnN0IGJ1dHRvbklEID0gYnV0dG9uRWxlbS5pZDtcclxuICBjb25zdCBzdGF0ZU5hbWUgPSBOYW1lU2FuaXRpemVyLmNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKTtcclxuICByZXR1cm4gc3RhdGVOYW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRIaWdobGlnaHRPbkJ1dHRvbihidG4pIHtcclxuICBidG4uY2xhc3NMaXN0LmFkZCgnYnRuLS1zZWxlY3RlZCcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldEhpZ2hsaWdodE9uQWxsQnV0dG9ucyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBzY2FsZUNvbnRyb2xsZXIuYnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcclxuICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdidG4tLXNlbGVjdGVkJyk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluZm9PZlNjYWxlU3RhdGUoKSB7XHJcbiAgY29uc3QgW2Nob3JkT3JTY2FsZSwgLi4uc2NhbGVUeXBlVG9rZW5zXSA9IHNjYWxlU3RhdGUuc3BsaXQoJy0nKTtcclxuICBjb25zdCBzY2FsZVR5cGUgPSBzY2FsZVR5cGVUb2tlbnMuam9pbignICcpO1xyXG4gIHJldHVybiB7IGNob3JkT3JTY2FsZSwgc2NhbGVUeXBlIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEJ1dHRvbkxpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBzY2FsZUNvbnRyb2xsZXIuYnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgc2NhbGVTdGF0ZSA9IGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidG4pO1xyXG4gICAgICByZXNldEhpZ2hsaWdodE9uQWxsQnV0dG9ucyhzY2FsZUNvbnRyb2xsZXIpO1xyXG4gICAgICBhZGRIaWdobGlnaHRPbkJ1dHRvbihidG4pO1xyXG4gICAgICBTY2FsZURpc3BsYXkuc2V0VGV4dChzY2FsZVN0YXRlKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGREcm9wZG93blRpdGxlTGlzdGVuZXJzKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIHNjYWxlQ29udHJvbGxlci5jYXRlZ29yaWVzLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XHJcbiAgICBjb25zdCBjYXRlZ29yeVRpdGxlID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLnNjYWxlLWxpc3RfX2NhdGVnb3J5LXRpdGxlJyk7XHJcbiAgICBjb25zdCBkcm9wZG93bkxpc3QgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuc2NhbGUtbGlzdF9fY2F0ZWdvcnktbGlzdCcpO1xyXG4gICAgY29uc3QgZHJvcGRvd25BcnJvdyA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1hcnJvdycpO1xyXG4gICAgY2F0ZWdvcnlUaXRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgY2F0ZWdvcnlUaXRsZS5jbGFzc0xpc3QudG9nZ2xlKCdzY2FsZS1saXN0X19jYXRlZ29yeS10aXRsZS0tYWN0aXZlJyk7XHJcbiAgICAgIGRyb3Bkb3duTGlzdC5jbGFzc0xpc3QudG9nZ2xlKCdzY2FsZS1saXN0X19jYXRlZ29yeS1saXN0LS1oaWRkZW4nKTtcclxuICAgICAgZHJvcGRvd25BcnJvdy5jbGFzc0xpc3QudG9nZ2xlKCdkcm9wZG93bi1hcnJvdy0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBhZGRCdXR0b25MaXN0ZW5lcnMoc2NhbGVDb250cm9sbGVyKTtcclxuICBhZGREcm9wZG93blRpdGxlTGlzdGVuZXJzKHNjYWxlQ29udHJvbGxlcik7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBzY2FsZUNvbnRyb2xsZXIge1xyXG4gIHN0YXRpYyBpbml0KCkge1xyXG4gICAgdGhpcy5idXR0b25zID0gWy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J0bicpXTtcclxuICAgIHRoaXMuY2F0ZWdvcmllcyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzY2FsZS1saXN0X19jYXRlZ29yeScpXTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0Q2hvcmRPclNjYWxlKCkge1xyXG4gICAgY29uc3QgeyBjaG9yZE9yU2NhbGUgfSA9IGdldEluZm9PZlNjYWxlU3RhdGUoKTtcclxuICAgIHJldHVybiBjaG9yZE9yU2NhbGU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0U2NhbGVUeXBlKCkge1xyXG4gICAgY29uc3QgeyBzY2FsZVR5cGUgfSA9IGdldEluZm9PZlNjYWxlU3RhdGUoKTtcclxuICAgIHJldHVybiBzY2FsZVR5cGU7XHJcbiAgfVxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzY2FsZUNvbnRyb2xsZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFNjYWxlQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vc2NhbGUtY29udHJvbGxlcicpO1xyXG5cclxuY29uc3Qgc2NhbGVEYXRhID0gcmVxdWlyZSgnLi9kYXRhL3NjYWxlLWRhdGEnKTtcclxuXHJcbmZ1bmN0aW9uIGdldFNjYWxlUGF0dGVybihzY2FsZVR5cGUpIHtcclxuICBjb25zdCBwYXR0ZXJuID0gc2NhbGVEYXRhLnBhdHRlcm5zLnNjYWxlc1tzY2FsZVR5cGVdO1xyXG4gIGlmIChwYXR0ZXJuID09PSB1bmRlZmluZWQpIHJldHVybiBbXTtcclxuICByZXR1cm4gcGF0dGVybjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2hvcmRQYXR0ZXJuKHNjYWxlVHlwZSkge1xyXG4gIGNvbnN0IHBhdHRlcm4gPSBzY2FsZURhdGEucGF0dGVybnMuY2hvcmRzW3NjYWxlVHlwZV07XHJcbiAgaWYgKHBhdHRlcm4gPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xyXG4gIHJldHVybiBwYXR0ZXJuO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQYXR0ZXJuKCkge1xyXG4gIGNvbnN0IGNob3JkT3JTY2FsZSA9IFNjYWxlQ29udHJvbGxlci5nZXRDaG9yZE9yU2NhbGUoKTtcclxuICBjb25zdCBzY2FsZVR5cGUgPSBTY2FsZUNvbnRyb2xsZXIuZ2V0U2NhbGVUeXBlKCk7XHJcbiAgbGV0IHBhdHRlcm4gPSBbXTtcclxuICBpZiAoY2hvcmRPclNjYWxlID09PSAnc2NhbGUnKSB7XHJcbiAgICBwYXR0ZXJuID0gZ2V0U2NhbGVQYXR0ZXJuKHNjYWxlVHlwZSk7XHJcbiAgfSBlbHNlIGlmIChjaG9yZE9yU2NhbGUgPT09ICdjaG9yZCcpIHtcclxuICAgIHBhdHRlcm4gPSBnZXRDaG9yZFBhdHRlcm4oc2NhbGVUeXBlKTtcclxuICB9XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcblxyXG5jbGFzcyBzY2FsZURhdGFiYXNlIHtcclxuICBzdGF0aWMgZ2V0UGF0dGVybk9mU2VsZWN0ZWRTY2FsZSgpIHtcclxuICAgIGNvbnN0IHNjYWxlUGF0dGVybiA9IGdldFBhdHRlcm4oKTtcclxuICAgIHJldHVybiBzY2FsZVBhdHRlcm47XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNjYWxlRGF0YWJhc2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNsYXNzIFNjYWxlRGlzcGxheSB7XHJcbiAgc3RhdGljIGluaXQoKSB7XHJcbiAgICB0aGlzLmRvbUVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2NhbGUtZGlzcGxheV9fdGV4dC1wYW5lbCcpO1xyXG4gICAgdGhpcy5kb21FbGVtLnRleHRDb250ZW50ID0gJyc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2V0VGV4dCh0ZXh0KSB7XHJcbiAgICB0aGlzLmRvbUVsZW0udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2FsZURpc3BsYXk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNsYXNzIFRpbWVyTWFuYWdlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnRpbWVycyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogVGFrZSBvZmZzZXQgdGltZSBmcm9tIHNldHRpbmdzXHJcbiAgYWRkVGltZXIoY2FsbGJhY2ssIG9mZnNldEluZGV4KSB7XHJcbiAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIDIwMCAqIG9mZnNldEluZGV4KTtcclxuICAgIHRoaXMudGltZXJzLnB1c2godGltZXIpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJBbGxUaW1lcnMoKSB7XHJcbiAgICB0aGlzLnRpbWVycy5mb3JFYWNoKCh0aW1lcikgPT4ge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRpbWVycyA9IFtdO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lck1hbmFnZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhpcyBudW1iZXIgaXMgaW5jbHVkZWRcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCkge1xuICByZXR1cm4gWy4uLkFycmF5KGVuZCAtIHN0YXJ0ICsgMSkuZmlsbCgpLm1hcCgoXywgaSkgPT4gaSArIDEpXTtcbn1cblxuLyoqXG4gKiBSdW5zIGEgY2FsbGJhY2sgZm9yIGVhY2ggaXRlbSBvZiBpdGVtcywgaXRlcmF0aW5nIHVzaW5nIGluY3JlbWVudHMgZnJvbSB0aGUgcGF0dGVybkFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBwYXR0ZXJuQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGl0ZW1zXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggQXBwbGllcyBjYWxsYmFjayBzdGFydGluZyBmcm9tIGluZGV4ICsgdGhlIGZpcnN0IGluY3JlbWVudCBvZiB0aGUgcGF0dGVyblxuICogQHBhcmFtIHtUaW1lck1hbmFnZXJ9IHRpbWVyTWFuYWdlciBPcHRpb25hbCBtYW5hZ2VyIGZvciB0aW1lb3V0cyBiZXR3ZWVuIGVhY2ggY2FsbGJhY2tcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZpcnN0SXRlbUNhbGxiYWNrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja0ZvckVhY2hJdGVtXG4gKi9cbmZ1bmN0aW9uIHVzZVBhdHRlcm4ocGF0dGVybkFycmF5KSB7XG4gIHJldHVybiB7XG4gICAgZm9ySXRlbXMoaXRlbXMpIHtcbiAgICAgIHRoaXMuaXRlbXMgPSBpdGVtcztcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZnJvbUluZGV4KGluZGV4KSB7XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHdpdGhUaW1lcih0aW1lck1hbmFnZXIpIHtcbiAgICAgIHRoaXMudGltZXJNYW5hZ2VyID0gdGltZXJNYW5hZ2VyO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBydW5Gb3JGaXJzdEl0ZW0oZmlyc3RJdGVtQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMuZmlyc3RJdGVtQ2FsbGJhY2sgPSBmaXJzdEl0ZW1DYWxsYmFjaztcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcnVuKGNhbGxiYWNrRm9yRWFjaEl0ZW0pIHtcbiAgICAgIGlmICh0aGlzLmZpcnN0SXRlbUNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgZmlyc3RJdGVtID0gdGhpcy5pdGVtc1t0aGlzLmluZGV4XTtcbiAgICAgICAgdGhpcy5maXJzdEl0ZW1DYWxsYmFjayhmaXJzdEl0ZW0pO1xuICAgICAgfVxuXG4gICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgIHBhdHRlcm5BcnJheS5mb3JFYWNoKChpbmNyZW1lbnQsIGlkeCkgPT4ge1xuICAgICAgICB0aGlzLmluZGV4ICs9IGluY3JlbWVudDtcbiAgICAgICAgb2Zmc2V0ICs9IGluY3JlbWVudDtcbiAgICAgICAgY29uc3QgY2xvc3VyZU9mZnNldCA9IG9mZnNldDtcblxuICAgICAgICBjb25zdCBuZXh0SXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5pbmRleF07XG4gICAgICAgIGlmIChuZXh0SXRlbSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMudGltZXJNYW5hZ2VyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjYWxsYmFja0ZvckVhY2hJdGVtKG5leHRJdGVtLCBvZmZzZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGltZXJNYW5hZ2VyLmFkZFRpbWVyKCgpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrRm9yRWFjaEl0ZW0obmV4dEl0ZW0sIGNsb3N1cmVPZmZzZXQpO1xuICAgICAgICAgIH0sIGlkeCArIDEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgcmFuZ2UsIHVzZVBhdHRlcm4gfTtcbiJdfQ==
