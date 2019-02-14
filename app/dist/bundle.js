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
    const degreeType = 'standard'; // Settings.getDegreeType();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzLmpzIiwiYXBwL3NyYy9kYXRhL2tleS1uYW1lLXNldHMuanMiLCJhcHAvc3JjL2RhdGEva2V5LW5hbWUtdG8taWQtZW51bS5qcyIsImFwcC9zcmMvZGF0YS9vZmZzZXQtdG8tZGVncmVlLXNldHMuanMiLCJhcHAvc3JjL2RhdGEvcGlhbm8ta2V5LWJhc2UtaWRzLmpzIiwiYXBwL3NyYy9kYXRhL3NjYWxlLWRhdGEuanMiLCJhcHAvc3JjL2RlZ3JlZS1kaXNwbGF5LmpzIiwiYXBwL3NyYy9kZWdyZWUtdGlsZS5qcyIsImFwcC9zcmMvaW5kZXguanMiLCJhcHAvc3JjL2tleS1uYW1lLmpzIiwiYXBwL3NyYy9rZXlib2FyZC5qcyIsImFwcC9zcmMvbmFtZS1zYW5pdGl6ZXIuanMiLCJhcHAvc3JjL3BpYW5vLWtleS5qcyIsImFwcC9zcmMvc2NhbGUtY29udHJvbGxlci5qcyIsImFwcC9zcmMvc2NhbGUtZGF0YWJhc2UuanMiLCJhcHAvc3JjL3NjYWxlLWRpc3BsYXkuanMiLCJhcHAvc3JjL3RpbWVyLW1hbmFnZXIuanMiLCJhcHAvc3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcyA9IFtcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUtLXJvb3QnLFxyXG4gICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjay0tcm9vdCcsXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyxcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2snLFxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBoaWdobGlnaHRpbmdDbGFzc05hbWVzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBrZXlOYW1lU2V0cyA9IHtcclxuICBzdGFuZGFyZDogWydDJywgJ0Pima8nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Lima0nLCAnQiddLFxyXG4gIHNoYXJwOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXHJcbiAgZmxhdDogWydDJywgJ0Tima0nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdH4pmtJywgJ0cnLCAnQeKZrScsICdBJywgJ0Lima0nLCAnQiddLFxyXG4gIGZpeGVkRG9TaGFycDogWydEbycsICdEaScsICdSZScsICdSaScsICdNaScsICdGYScsICdGaScsICdTbycsICdTaScsICdMYScsICdMaScsICdUaSddLFxyXG4gIGZpeGVkRG9GbGF0OiBbJ0RvJywgJ1JhJywgJ1JlJywgJ01lJywgJ01pJywgJ0ZhJywgJ1NlJywgJ1NvJywgJ0xlJywgJ0xhJywgJ1RlJywgJ1RpJ10sXHJcbiAgc3BlY2lhbEZTaGFycE06IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXHJcbiAgc3BlY2lhbENTaGFycE06IFsnQiMnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlOYW1lU2V0cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qga2V5TmFtZVRvSURFbnVtID0gT2JqZWN0LmZyZWV6ZSh7XHJcbiAgJ0MnOiAwLFxyXG4gICdD4pmvJzogMSxcclxuICAnRCc6IDIsXHJcbiAgJ0Tima8nOiAzLFxyXG4gICdFJzogNCxcclxuICAnRic6IDUsXHJcbiAgJ0bima8nOiA2LFxyXG4gICdHJzogNyxcclxuICAnR+KZryc6IDgsXHJcbiAgJ0EnOiA5LFxyXG4gICdB4pmvJzogMTAsXHJcbiAgJ0InOiAxMSxcclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGtleU5hbWVUb0lERW51bTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qgb2Zmc2V0VG9EZWdyZWVTZXRzID0ge1xyXG4gIHNjYWxlOiB7XHJcbiAgICBzdGFuZGFyZDogWycxJywgJ2IyJywgJzInLCAnYjMnLCAnMycsICc0JywgJ2I1JywgJzUnLCAnYjYnLCAnNicsICdiNycsICc3J10sXHJcbiAgICBtb3ZhYmxlRG9TaGFycDogWydEbycsICdEaScsICdSZScsICdSaScsICdNaScsICdGYScsICdGaScsICdTbycsICdTaScsICdMYScsICdMaScsICdUaSddLFxyXG4gICAgbW92YWJsZURvRmxhdDogWydEbycsICdSYScsICdSZScsICdNZScsICdNaScsICdGYScsICdTZScsICdTbycsICdMZScsICdMYScsICdUZScsICdUaSddLFxyXG4gIH0sXHJcbiAgY2hvcmQ6IHtcclxuICAgIHN0YW5kYXJkOiBbJzEnLCAnYjInLCAnMicsICdiMycsICczJywgJzQnLCAnYjUnLCAnNScsICdiNicsICc2JywgJ2I3JywgJzcnLCAnMScsICdiOScsICc5JywgJ3M5JywgJzMnLCAnYjExJywgJzExJ10sXHJcbiAgfSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gb2Zmc2V0VG9EZWdyZWVTZXRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBwaWFub0tleUJhc2VJRHMgPSBbXHJcbiAgJ2MnLFxyXG4gICdjLXNoYXJwJyxcclxuICAnZCcsXHJcbiAgJ2Qtc2hhcnAnLFxyXG4gICdlJyxcclxuICAnZicsXHJcbiAgJ2Ytc2hhcnAnLFxyXG4gICdnJyxcclxuICAnZy1zaGFycCcsXHJcbiAgJ2EnLFxyXG4gICdhLXNoYXJwJyxcclxuICAnYicsXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBpYW5vS2V5QmFzZUlEcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgZGF0YSA9IHtcclxuICBwYXR0ZXJuczoge1xyXG4gICAgc2NhbGVzOiB7XHJcbiAgICAgICdtYWpvcic6IFsyLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgJ21pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAnaGFybW9uaWMgbWlub3InOiBbMiwgMSwgMiwgMiwgMSwgM10sXHJcbiAgICAgICdtZWxvZGljIG1pbm9yJzogWzIsIDEsIDIsIDIsIDIsIDJdLFxyXG5cclxuICAgIH0sXHJcbiAgICBjaG9yZHM6IHtcclxuICAgICAgJ21ham9yJzogWzQsIDNdLFxyXG4gICAgICAnbWlub3InOiBbMywgNF0sXHJcbiAgICAgICdkaW1pbmlzaGVkJzogWzMsIDNdLFxyXG4gICAgICAnYXVnbWVudGVkJzogWzQsIDRdLFxyXG4gICAgICAnc3VzcGVuZGVkMic6IFsyLCA1XSxcclxuICAgICAgJ3N1c3BlbmRlZDQnOiBbNSwgMl0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGE7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IERlZ3JlZVRpbGUgPSByZXF1aXJlKCcuL2RlZ3JlZS10aWxlJyk7XHJcbmNvbnN0IFNjYWxlRGF0YWJhc2UgPSByZXF1aXJlKCcuL3NjYWxlLWRhdGFiYXNlJyk7XHJcbmNvbnN0IFRpbWVyTWFuYWdlciA9IHJlcXVpcmUoJy4vdGltZXItbWFuYWdlcicpO1xyXG5cclxuY29uc3QgcGlhbm9LZXlCYXNlSURzID0gcmVxdWlyZSgnLi9kYXRhL3BpYW5vLWtleS1iYXNlLWlkcycpO1xyXG5jb25zdCB7IHJhbmdlLCB1c2VQYXR0ZXJuIH0gPSByZXF1aXJlKCcuL3V0aWwnKTtcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlRGVncmVlRGlzcGxheVRpbGVEb21JRHMoKSB7XHJcbiAgY29uc3QgdGlsZU5hbWVzID0gW107XHJcbiAgY29uc3QgTlVNX09GX09DVEFWRVMgPSAzO1xyXG4gIHJhbmdlKDEsIE5VTV9PRl9PQ1RBVkVTKS5mb3JFYWNoKChvY3RhdmUpID0+IHtcclxuICAgIHBpYW5vS2V5QmFzZUlEcy5mb3JFYWNoKChiYXNlSUQpID0+IHtcclxuICAgICAgY29uc3QgdGlsZU5hbWUgPSBgZGVncmVlLSR7YmFzZUlEfSR7b2N0YXZlfWA7XHJcbiAgICAgIHRpbGVOYW1lcy5wdXNoKHRpbGVOYW1lKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiB0aWxlTmFtZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERlZ3JlZVRpbGVzVXNpbmdEb21JRHModGlsZU5hbWVJRHMgPSBbXSkge1xyXG4gIGNvbnN0IGRlZ3JlZVRpbGVOb2RlcyA9IFtdO1xyXG4gIHRpbGVOYW1lSURzLmZvckVhY2goKGlkLCB0aWxlSW5kZXgpID0+IHtcclxuICAgIGNvbnN0IGRlZ3JlZVRpbGUgPSBuZXcgRGVncmVlVGlsZShpZCwgdGlsZUluZGV4KTtcclxuICAgIGRlZ3JlZVRpbGVOb2Rlcy5wdXNoKGRlZ3JlZVRpbGUpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBkZWdyZWVUaWxlTm9kZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERlZ3JlZVRpbGVzKCkge1xyXG4gIGNvbnN0IHRpbGVOYW1lSURzID0gZ2VuZXJhdGVEZWdyZWVEaXNwbGF5VGlsZURvbUlEcygpO1xyXG4gIGNvbnN0IGRlZ3JlZVRpbGVzID0gZ2V0RGVncmVlVGlsZXNVc2luZ0RvbUlEcyh0aWxlTmFtZUlEcyk7XHJcbiAgcmV0dXJuIGRlZ3JlZVRpbGVzO1xyXG59XHJcblxyXG5cclxuY2xhc3MgRGVncmVlRGlzcGxheSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmRlZ3JlZVRpbGVzID0gZ2V0RGVncmVlVGlsZXMoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyID0gbmV3IFRpbWVyTWFuYWdlcigpO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlkZGVuRm9yQWxsVGlsZXMoKSB7XHJcbiAgICB0aGlzLmRlZ3JlZVRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcclxuICAgICAgdGlsZS5lbmFibGVIaWRkZW4oKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheWVkVGlsZXNGb3JTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KSB7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSBTY2FsZURhdGFiYXNlLmdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKTtcclxuICAgIGlmIChzY2FsZVBhdHRlcm4ubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLmVuYWJsZUhpZGRlbkZvckFsbFRpbGVzKCk7XHJcbiAgICB0aGlzLnJlc2V0VGV4dE9uQWxsVGlsZXMoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyLmNsZWFyQWxsVGltZXJzKCk7XHJcbiAgICB1c2VQYXR0ZXJuKHNjYWxlUGF0dGVybilcclxuICAgICAgLmZvckl0ZW1zKHRoaXMuZGVncmVlVGlsZXMpXHJcbiAgICAgIC5mcm9tSW5kZXgoaW5kZXgpXHJcbiAgICAgIC53aXRoVGltZXIodGhpcy50aW1lck1hbmFnZXIpXHJcbiAgICAgIC5ydW5Gb3JGaXJzdEl0ZW0oKHRpbGUpID0+IHtcclxuICAgICAgICBjb25zdCByb290T2Zmc2V0ID0gMDtcclxuICAgICAgICB0aWxlLnNldERlZ3JlZU51bWJlcihyb290T2Zmc2V0KTtcclxuICAgICAgICB0aWxlLmRpc2FibGVIaWRkZW4oKTtcclxuICAgICAgfSlcclxuICAgICAgLnJ1bigodGlsZSwgb2Zmc2V0KSA9PiB7XHJcbiAgICAgICAgdGlsZS5zZXREZWdyZWVOdW1iZXIob2Zmc2V0KTtcclxuICAgICAgICB0aWxlLmRpc2FibGVIaWRkZW4oKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXNldFRleHRPbkFsbFRpbGVzKCkge1xyXG4gICAgdGhpcy5kZWdyZWVUaWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XHJcbiAgICAgIHRpbGUuc2V0RGVncmVlVGV4dCgnJyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVncmVlRGlzcGxheTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcblxyXG5jb25zdCBvZmZzZXRUb0RlZ3JlZVNldHMgPSByZXF1aXJlKCcuL2RhdGEvb2Zmc2V0LXRvLWRlZ3JlZS1zZXRzJyk7XHJcblxyXG5jbGFzcyBEZWdyZWVUaWxlIHtcclxuICBjb25zdHJ1Y3Rvcihkb21JRCwgaW5kZXgpIHtcclxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmRlZ3JlZS1kaXNwbGF5X19kZWdyZWUtdGV4dCcpO1xyXG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlkZGVuKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gIH1cclxuXHJcbiAgZGlzYWJsZUhpZGRlbigpIHtcclxuICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICB9XHJcblxyXG4gIHNldERlZ3JlZU51bWJlcihvZmZzZXRGcm9tUm9vdE5vdGUpIHtcclxuICAgIGNvbnN0IGNob3JkT3JTY2FsZSA9IFNjYWxlQ29udHJvbGxlci5nZXRDaG9yZE9yU2NhbGUoKTtcclxuICAgIGNvbnN0IGRlZ3JlZVR5cGUgPSAnc3RhbmRhcmQnOyAvLyBTZXR0aW5ncy5nZXREZWdyZWVUeXBlKCk7XHJcbiAgICBsZXQgZGVncmVlID0gJyc7XHJcbiAgICBpZiAoY2hvcmRPclNjYWxlID09PSAnc2NhbGUnKSB7XHJcbiAgICAgIGNvbnN0IHNjYWxlU2V0ID0gb2Zmc2V0VG9EZWdyZWVTZXRzLnNjYWxlW2RlZ3JlZVR5cGVdO1xyXG4gICAgICBpZiAoc2NhbGVTZXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICBkZWdyZWUgPSBzY2FsZVNldFtvZmZzZXRGcm9tUm9vdE5vdGVdO1xyXG4gICAgfSBlbHNlIGlmIChjaG9yZE9yU2NhbGUgPT09ICdjaG9yZCcpIHtcclxuICAgICAgY29uc3QgY2hvcmRTZXQgPSBvZmZzZXRUb0RlZ3JlZVNldHMuY2hvcmRbZGVncmVlVHlwZV07XHJcbiAgICAgIGlmIChjaG9yZFNldCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgIGRlZ3JlZSA9IGNob3JkU2V0W29mZnNldEZyb21Sb290Tm90ZV07XHJcbiAgICB9XHJcbiAgICB0aGlzLnNldERlZ3JlZVRleHQoZGVncmVlKTtcclxuICB9XHJcblxyXG4gIHNldERlZ3JlZVRleHQodGV4dCkge1xyXG4gICAgdGhpcy5kb21UZXh0Tm9kZS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlZ3JlZVRpbGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEtleWJvYXJkID0gcmVxdWlyZSgnLi9rZXlib2FyZCcpO1xyXG5jb25zdCBEZWdyZWVEaXNwbGF5ID0gcmVxdWlyZSgnLi9kZWdyZWUtZGlzcGxheScpO1xyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuY29uc3QgU2NhbGVEaXNwbGF5ID0gcmVxdWlyZSgnLi9zY2FsZS1kaXNwbGF5Jyk7XHJcblxyXG5TY2FsZUNvbnRyb2xsZXIuaW5pdCgpO1xyXG5TY2FsZURpc3BsYXkuaW5pdCgpO1xyXG5cclxuY29uc3QgbWFpbktleWJvYXJkID0gbmV3IEtleWJvYXJkKCk7XHJcbm1haW5LZXlib2FyZC5zZXREaXNwbGF5TmFtZUZvckFsbEtleXNPZlR5cGUoJ3N0YW5kYXJkJyk7XHJcblxyXG5jb25zdCBkZWdyZWVEaXNwbGF5ID0gbmV3IERlZ3JlZURpc3BsYXkoKTtcclxuZGVncmVlRGlzcGxheS5lbmFibGVIaWRkZW5Gb3JBbGxUaWxlcygpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBrZXlOYW1lU2V0cyA9IHJlcXVpcmUoJy4vZGF0YS9rZXktbmFtZS1zZXRzJyk7XHJcbmNvbnN0IGtleU5hbWVUb0lERW51bSA9IHJlcXVpcmUoJy4vZGF0YS9rZXktbmFtZS10by1pZC1lbnVtJyk7XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVLZXlJRChiYXNlTmFtZSkge1xyXG4gIGNvbnN0IGlkID0ga2V5TmFtZVRvSURFbnVtW2Jhc2VOYW1lXTtcclxuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIC0xO1xyXG4gIHJldHVybiBpZDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0S2V5TmFtZVNldCh0eXBlKSB7XHJcbiAgY29uc3Qga2V5TmFtZVNldCA9IGtleU5hbWVTZXRzW3R5cGVdO1xyXG4gIGlmIChrZXlOYW1lU2V0ID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICByZXR1cm4ga2V5TmFtZVNldDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCBrZXlJRCkge1xyXG4gIGNvbnN0IGFsaWFzT2ZTcGVjaWZpY1R5cGUgPSBrZXlOYW1lU2V0W2tleUlEXTtcclxuICBpZiAoYWxpYXNPZlNwZWNpZmljVHlwZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgcmV0dXJuIGFsaWFzT2ZTcGVjaWZpY1R5cGU7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBLZXlOYW1lIHtcclxuICBjb25zdHJ1Y3RvcihiYXNlTmFtZSkge1xyXG4gICAgdGhpcy5pZCA9IGRldGVybWluZUtleUlEKGJhc2VOYW1lKTtcclxuICB9XHJcblxyXG4gIGdldEFsaWFzT2ZUeXBlKHR5cGUpIHtcclxuICAgIGNvbnN0IGtleU5hbWVTZXQgPSBnZXRLZXlOYW1lU2V0KHR5cGUpO1xyXG4gICAgY29uc3QgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwgdGhpcy5pZCk7XHJcbiAgICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2V5TmFtZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgUGlhbm9LZXkgPSByZXF1aXJlKCcuL3BpYW5vLWtleScpO1xyXG5jb25zdCBTY2FsZURhdGFiYXNlID0gcmVxdWlyZSgnLi9zY2FsZS1kYXRhYmFzZScpO1xyXG5jb25zdCBUaW1lck1hbmFnZXIgPSByZXF1aXJlKCcuL3RpbWVyLW1hbmFnZXInKTtcclxuY29uc3QgRGVncmVlRGlzcGxheSA9IHJlcXVpcmUoJy4vZGVncmVlLWRpc3BsYXknKTtcclxuXHJcbmNvbnN0IHsgcmFuZ2UsIHVzZVBhdHRlcm4gfSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xyXG5jb25zdCBwaWFub0tleUJhc2VJRHMgPSByZXF1aXJlKCcuL2RhdGEvcGlhbm8ta2V5LWJhc2UtaWRzJyk7XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZUtleU5hbWVEb21JRHMoKSB7XHJcbiAgY29uc3Qga2V5TmFtZXNXaXRoT2N0YXZlcyA9IFtdO1xyXG4gIGNvbnN0IE5VTV9PRl9PQ1RBVkVTID0gMztcclxuICByYW5nZSgxLCBOVU1fT0ZfT0NUQVZFUykuZm9yRWFjaCgob2N0YXZlKSA9PiB7XHJcbiAgICBwaWFub0tleUJhc2VJRHMuZm9yRWFjaCgoYmFzZUlEKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5hbWVXaXRoT2N0YXZlID0gYmFzZUlEICsgb2N0YXZlO1xyXG4gICAgICBrZXlOYW1lc1dpdGhPY3RhdmVzLnB1c2gobmFtZVdpdGhPY3RhdmUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGtleU5hbWVzV2l0aE9jdGF2ZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBpYW5vS2V5c1VzaW5nRG9tSURzKGtleU5hbWVJRHMgPSBbXSkge1xyXG4gIGNvbnN0IHBpYW5vS2V5Tm9kZXMgPSBbXTtcclxuICBrZXlOYW1lSURzLmZvckVhY2goKGlkLCBrZXlJbmRleCkgPT4ge1xyXG4gICAgY29uc3QgcGlhbm9LZXkgPSBuZXcgUGlhbm9LZXkoaWQsIGtleUluZGV4KTtcclxuICAgIHBpYW5vS2V5Tm9kZXMucHVzaChwaWFub0tleSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHBpYW5vS2V5Tm9kZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBpYW5vS2V5cygpIHtcclxuICBjb25zdCBrZXlOYW1lSURzID0gZ2VuZXJhdGVLZXlOYW1lRG9tSURzKCk7XHJcbiAgY29uc3QgcGlhbm9LZXlzID0gZ2V0UGlhbm9LZXlzVXNpbmdEb21JRHMoa2V5TmFtZUlEcyk7XHJcbiAgcmV0dXJuIHBpYW5vS2V5cztcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhrZXlib2FyZCkge1xyXG4gIGtleWJvYXJkLmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGV2ZW50U291cmNlID0ga2V5Ym9hcmQua2V5cy5maW5kKGl0ZW0gPT4gaXRlbS5nZXREb21Ob2RlKCkgPT09IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcua2V5Ym9hcmRfX2tleScpKTtcclxuICAgIGlmIChldmVudFNvdXJjZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICBjb25zdCBpbmRleCA9IGV2ZW50U291cmNlLmdldEtleUluZGV4KCk7XHJcbiAgICBrZXlib2FyZC5lbmFibGVIaWdobGlnaHRpbmdGb3JTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KTtcclxuICAgIGtleWJvYXJkLmRlZ3JlZURpc3BsYXkuc2V0RGlzcGxheWVkVGlsZXNGb3JTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KTtcclxuICB9KTtcclxufVxyXG5cclxuXHJcbmNsYXNzIEtleWJvYXJkIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZCcpO1xyXG4gICAgdGhpcy5rZXlzID0gZ2V0UGlhbm9LZXlzKCk7XHJcbiAgICB0aGlzLmRlZ3JlZURpc3BsYXkgPSBuZXcgRGVncmVlRGlzcGxheSgpO1xyXG4gICAgdGhpcy50aW1lck1hbmFnZXIgPSBuZXcgVGltZXJNYW5hZ2VyKCk7XHJcbiAgICByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZGlzYWJsZUhpZ2hsaWdodGluZ0ZvckFsbEtleXMoKSB7XHJcbiAgICB0aGlzLmtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgIGtleS5kaXNhYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGVuYWJsZUhpZ2hsaWdodGluZ0ZvclNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpIHtcclxuICAgIGNvbnN0IHNjYWxlUGF0dGVybiA9IFNjYWxlRGF0YWJhc2UuZ2V0UGF0dGVybk9mU2VsZWN0ZWRTY2FsZSgpO1xyXG4gICAgaWYgKHNjYWxlUGF0dGVybi5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyLmNsZWFyQWxsVGltZXJzKCk7XHJcbiAgICB0aGlzLmRpc2FibGVIaWdobGlnaHRpbmdGb3JBbGxLZXlzKCk7XHJcbiAgICB1c2VQYXR0ZXJuKHNjYWxlUGF0dGVybilcclxuICAgICAgLmZvckl0ZW1zKHRoaXMua2V5cylcclxuICAgICAgLmZyb21JbmRleChpbmRleClcclxuICAgICAgLndpdGhUaW1lcih0aGlzLnRpbWVyTWFuYWdlcilcclxuICAgICAgLnJ1bkZvckZpcnN0SXRlbSgocm9vdEtleSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzUm9vdEtleSA9IHRydWU7XHJcbiAgICAgICAgcm9vdEtleS5lbmFibGVIaWdobGlnaHRpbmcoaXNSb290S2V5KTtcclxuICAgICAgfSlcclxuICAgICAgLnJ1bigoa2V5KSA9PiB7XHJcbiAgICAgICAga2V5LmVuYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldERpc3BsYXlOYW1lRm9yQWxsS2V5c09mVHlwZSh0eXBlKSB7XHJcbiAgICB0aGlzLmtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgIGtleS5zZXREaXNwbGF5TmFtZU9mVHlwZSh0eXBlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgTmFtZVNhbml0aXplciA9IHtcclxuXHJcbiAgLyogJ2J0bi1zY2FsZS1tYWpvcicgLT4gJ3NjYWxlLW1ham9yJyAqL1xyXG4gIGNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKSB7XHJcbiAgICBpZiAoYnV0dG9uSUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gICAgY29uc3Qgc3RhdGVOYW1lID0gYnV0dG9uSUQuc3Vic3RyaW5nKDQpO1xyXG4gICAgcmV0dXJuIHN0YXRlTmFtZTtcclxuICB9LFxyXG5cclxuICAvKiAnYy1zaGFycDEnIC0+ICdj4pmvJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9LZXlOYW1lQmFzZU5hbWUocGlhbm9LZXlEb21JRCkge1xyXG4gICAgaWYgKHBpYW5vS2V5RG9tSUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gICAgY29uc3QgdHJpbW1lZE5hbWUgPSBwaWFub0tleURvbUlELnNsaWNlKDAsIC0xKTtcclxuICAgIGNvbnN0IGtleU5hbWVCYXNlTmFtZSA9IHRyaW1tZWROYW1lLnJlcGxhY2UoJy1zaGFycCcsICfima8nKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgcmV0dXJuIGtleU5hbWVCYXNlTmFtZTtcclxuICB9LFxyXG5cclxuICAvKiAnYy1zaGFycDEnIC0+ICcxJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9PY3RhdmVOdW1iZXIocGlhbm9LZXlEb21JRCkge1xyXG4gICAgcmV0dXJuIHBpYW5vS2V5RG9tSUQuc2xpY2UoLTEpO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJ2JsYWNrJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9Db2xvcihwaWFub0tleURvbUlEKSB7XHJcbiAgICByZXR1cm4gKHBpYW5vS2V5RG9tSUQuaW5kZXhPZignc2hhcnAnKSAhPT0gLTEpID8gJ2JsYWNrJyA6ICd3aGl0ZSc7XHJcbiAgfSxcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVTYW5pdGl6ZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEtleU5hbWUgPSByZXF1aXJlKCcuL2tleS1uYW1lJyk7XHJcbmNvbnN0IE5hbWVTYW5pdGl6ZXIgPSByZXF1aXJlKCcuL25hbWUtc2FuaXRpemVyJyk7XHJcblxyXG5jb25zdCBoaWdobGlnaHRpbmdDbGFzc05hbWVzID0gcmVxdWlyZSgnLi9kYXRhL2hpZ2hsaWdodGluZy1jbGFzcy1uYW1lcycpO1xyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lQ29sb3IoZG9tSUQpIHtcclxuICByZXR1cm4gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvQ29sb3IoZG9tSUQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVOYW1lcyhkb21JRCkge1xyXG4gIGNvbnN0IGtleU5hbWVCYXNlTmFtZSA9IE5hbWVTYW5pdGl6ZXIuY29udmVydFBpYW5vS2V5RG9tSURUb0tleU5hbWVCYXNlTmFtZShkb21JRCk7XHJcbiAgY29uc3Qga2V5TmFtZSA9IG5ldyBLZXlOYW1lKGtleU5hbWVCYXNlTmFtZSk7XHJcbiAgcmV0dXJuIGtleU5hbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZU9jdGF2ZShkb21JRCkge1xyXG4gIHJldHVybiBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9PY3RhdmVOdW1iZXIoZG9tSUQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRNb3VzZUxpc3RlbmVyKHBpYW5vS2V5KSB7XHJcbiAgcGlhbm9LZXkuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB7XHJcbiAgICBpZiAocGlhbm9LZXkuaXNIaWdobGlnaHRlZCgpKSByZXR1cm47XHJcbiAgICBwaWFub0tleS5lbmFibGVIaWdobGlnaHRpbmcodHJ1ZSk7XHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoKSB7XHJcbiAgICAgIHBpYW5vS2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgICAgc2V0VGltZW91dChkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKSwgMCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVG91Y2hMaXN0ZW5lcihwaWFub0tleSkge1xyXG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICgpID0+IHtcclxuICAgIGlmIChwaWFub0tleS5pc0hpZ2hsaWdodGVkKCkpIHJldHVybjtcclxuICAgIHBpYW5vS2V5LmVuYWJsZUhpZ2hsaWdodGluZyh0cnVlKTtcclxuICAgIGZ1bmN0aW9uIG9uVG91Y2hFbmQoKSB7XHJcbiAgICAgIHBpYW5vS2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgICAgc2V0VGltZW91dChkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQpLCAwKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMocGlhbm9LZXkpIHtcclxuICBhZGRNb3VzZUxpc3RlbmVyKHBpYW5vS2V5KTtcclxuICBhZGRUb3VjaExpc3RlbmVyKHBpYW5vS2V5KTtcclxufVxyXG5cclxuXHJcbmNsYXNzIFBpYW5vS2V5IHtcclxuICBjb25zdHJ1Y3Rvcihkb21JRCwga2V5SW5kZXgpIHtcclxuICAgIHRoaXMuaW5kZXggPSBrZXlJbmRleDtcclxuICAgIHRoaXMubmFtZXMgPSBkZXRlcm1pbmVOYW1lcyhkb21JRCk7XHJcbiAgICB0aGlzLmNvbG9yID0gZGV0ZXJtaW5lQ29sb3IoZG9tSUQpO1xyXG4gICAgdGhpcy5vY3RhdmUgPSBkZXRlcm1pbmVPY3RhdmUoZG9tSUQpO1xyXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSUQpO1xyXG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19rZXktbmFtZScpO1xyXG4gICAgdGhpcy5kb21GaW5nZXJpbmdUZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmRfX2ZpbmdlcmluZycpO1xyXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcclxuICB9XHJcblxyXG4gIGlzSGlnaGxpZ2h0ZWQoKSB7XHJcbiAgICBsZXQgaXNIaWdobGlnaHRlZCA9IGZhbHNlO1xyXG4gICAgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcy5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcclxuICAgICAgaWYgKHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xyXG4gICAgICAgIGlzSGlnaGxpZ2h0ZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBpc0hpZ2hsaWdodGVkO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlnaGxpZ2h0aW5nKGlzUm9vdEtleSA9IGZhbHNlKSB7XHJcbiAgICBsZXQgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gJyc7XHJcbiAgICBpZiAoaXNSb290S2V5KSB7XHJcbiAgICAgIGhpZ2hsaWdodENsYXNzTmFtZSA9IHRoaXMuY29sb3IgPT09ICd3aGl0ZScgPyAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUtLXJvb3QnIDogJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrLS1yb290JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGhpZ2hsaWdodENsYXNzTmFtZSA9IHRoaXMuY29sb3IgPT09ICd3aGl0ZScgPyAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUnIDogJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJztcclxuICAgIH1cclxuICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGhpZ2hsaWdodENsYXNzTmFtZSk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlnaGxpZ2h0aW5nKCkge1xyXG4gICAgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcy5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcclxuICAgICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0Q3VzdG9tRGlzcGxheU5hbWUobmFtZSkge1xyXG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQgPSBuYW1lO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheU5hbWVPZlR5cGUodHlwZSkge1xyXG4gICAgY29uc3QgYWxpYXMgPSB0aGlzLm5hbWVzLmdldEFsaWFzT2ZUeXBlKHR5cGUpO1xyXG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQgPSBhbGlhcztcclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnROYW1lKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50O1xyXG4gIH1cclxuXHJcbiAgZ2V0S2V5SW5kZXgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbmRleDtcclxuICB9XHJcblxyXG4gIGdldERvbU5vZGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kb21Ob2RlO1xyXG4gIH1cclxuXHJcbiAgcmVzZXREaXNwbGF5TmFtZSgpIHtcclxuICAgIC8vIFRPRE86IEdldCBkZWZhdWx0IHR5cGUgZnJvbSBzZXR0aW5ncyBvYmplY3RcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQaWFub0tleTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgTmFtZVNhbml0aXplciA9IHJlcXVpcmUoJy4vbmFtZS1zYW5pdGl6ZXInKTtcclxuY29uc3QgU2NhbGVEaXNwbGF5ID0gcmVxdWlyZSgnLi9zY2FsZS1kaXNwbGF5Jyk7XHJcblxyXG5sZXQgc2NhbGVTdGF0ZSA9ICcnO1xyXG5cclxuZnVuY3Rpb24gZ2V0U3RhdGVOYW1lRnJvbUJ1dHRvbklEKGJ1dHRvbkVsZW0pIHtcclxuICBjb25zdCBidXR0b25JRCA9IGJ1dHRvbkVsZW0uaWQ7XHJcbiAgY29uc3Qgc3RhdGVOYW1lID0gTmFtZVNhbml0aXplci5jb252ZXJ0QnV0dG9uSURUb1N0YXRlTmFtZShidXR0b25JRCk7XHJcbiAgcmV0dXJuIHN0YXRlTmFtZTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkSGlnaGxpZ2h0T25CdXR0b24oYnRuKSB7XHJcbiAgYnRuLmNsYXNzTGlzdC5hZGQoJ2J0bi0tc2VsZWN0ZWQnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzZXRIaWdobGlnaHRPbkFsbEJ1dHRvbnMoc2NhbGVDb250cm9sbGVyKSB7XHJcbiAgc2NhbGVDb250cm9sbGVyLmJ1dHRvbnMuZm9yRWFjaCgoYnRuKSA9PiB7XHJcbiAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnYnRuLS1zZWxlY3RlZCcpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJbmZvT2ZTY2FsZVN0YXRlKCkge1xyXG4gIGNvbnN0IFtjaG9yZE9yU2NhbGUsIC4uLnNjYWxlVHlwZVRva2Vuc10gPSBzY2FsZVN0YXRlLnNwbGl0KCctJyk7XHJcbiAgY29uc3Qgc2NhbGVUeXBlID0gc2NhbGVUeXBlVG9rZW5zLmpvaW4oJyAnKTtcclxuICByZXR1cm4geyBjaG9yZE9yU2NhbGUsIHNjYWxlVHlwZSB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRCdXR0b25MaXN0ZW5lcnMoc2NhbGVDb250cm9sbGVyKSB7XHJcbiAgc2NhbGVDb250cm9sbGVyLmJ1dHRvbnMuZm9yRWFjaCgoYnRuKSA9PiB7XHJcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIHNjYWxlU3RhdGUgPSBnZXRTdGF0ZU5hbWVGcm9tQnV0dG9uSUQoYnRuKTtcclxuICAgICAgcmVzZXRIaWdobGlnaHRPbkFsbEJ1dHRvbnMoc2NhbGVDb250cm9sbGVyKTtcclxuICAgICAgYWRkSGlnaGxpZ2h0T25CdXR0b24oYnRuKTtcclxuICAgICAgU2NhbGVEaXNwbGF5LnNldFRleHQoc2NhbGVTdGF0ZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkRHJvcGRvd25UaXRsZUxpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBzY2FsZUNvbnRyb2xsZXIuY2F0ZWdvcmllcy5mb3JFYWNoKChjYXRlZ29yeSkgPT4ge1xyXG4gICAgY29uc3QgY2F0ZWdvcnlUaXRsZSA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1saXN0X19jYXRlZ29yeS10aXRsZScpO1xyXG4gICAgY29uc3QgZHJvcGRvd25MaXN0ID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLnNjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QnKTtcclxuICAgIGNvbnN0IGRyb3Bkb3duQXJyb3cgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tYXJyb3cnKTtcclxuICAgIGNhdGVnb3J5VGl0bGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIGNhdGVnb3J5VGl0bGUuY2xhc3NMaXN0LnRvZ2dsZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnktdGl0bGUtLWFjdGl2ZScpO1xyXG4gICAgICBkcm9wZG93bkxpc3QuY2xhc3NMaXN0LnRvZ2dsZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnktbGlzdC0taGlkZGVuJyk7XHJcbiAgICAgIGRyb3Bkb3duQXJyb3cuY2xhc3NMaXN0LnRvZ2dsZSgnZHJvcGRvd24tYXJyb3ctLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMoc2NhbGVDb250cm9sbGVyKSB7XHJcbiAgYWRkQnV0dG9uTGlzdGVuZXJzKHNjYWxlQ29udHJvbGxlcik7XHJcbiAgYWRkRHJvcGRvd25UaXRsZUxpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpO1xyXG59XHJcblxyXG5cclxuY2xhc3Mgc2NhbGVDb250cm9sbGVyIHtcclxuICBzdGF0aWMgaW5pdCgpIHtcclxuICAgIHRoaXMuYnV0dG9ucyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidG4nKV07XHJcbiAgICB0aGlzLmNhdGVnb3JpZXMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnknKV07XHJcbiAgICByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldENob3JkT3JTY2FsZSgpIHtcclxuICAgIGNvbnN0IHsgY2hvcmRPclNjYWxlIH0gPSBnZXRJbmZvT2ZTY2FsZVN0YXRlKCk7XHJcbiAgICByZXR1cm4gY2hvcmRPclNjYWxlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldFNjYWxlVHlwZSgpIHtcclxuICAgIGNvbnN0IHsgc2NhbGVUeXBlIH0gPSBnZXRJbmZvT2ZTY2FsZVN0YXRlKCk7XHJcbiAgICByZXR1cm4gc2NhbGVUeXBlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2NhbGVDb250cm9sbGVyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuXHJcbmNvbnN0IHNjYWxlRGF0YSA9IHJlcXVpcmUoJy4vZGF0YS9zY2FsZS1kYXRhJyk7XHJcblxyXG5mdW5jdGlvbiBnZXRTY2FsZVBhdHRlcm4oc2NhbGVUeXBlKSB7XHJcbiAgY29uc3QgcGF0dGVybiA9IHNjYWxlRGF0YS5wYXR0ZXJucy5zY2FsZXNbc2NhbGVUeXBlXTtcclxuICBpZiAocGF0dGVybiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENob3JkUGF0dGVybihzY2FsZVR5cGUpIHtcclxuICBjb25zdCBwYXR0ZXJuID0gc2NhbGVEYXRhLnBhdHRlcm5zLmNob3Jkc1tzY2FsZVR5cGVdO1xyXG4gIGlmIChwYXR0ZXJuID09PSB1bmRlZmluZWQpIHJldHVybiBbXTtcclxuICByZXR1cm4gcGF0dGVybjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGF0dGVybigpIHtcclxuICBjb25zdCBjaG9yZE9yU2NhbGUgPSBTY2FsZUNvbnRyb2xsZXIuZ2V0Q2hvcmRPclNjYWxlKCk7XHJcbiAgY29uc3Qgc2NhbGVUeXBlID0gU2NhbGVDb250cm9sbGVyLmdldFNjYWxlVHlwZSgpO1xyXG4gIGxldCBwYXR0ZXJuID0gW107XHJcbiAgaWYgKGNob3JkT3JTY2FsZSA9PT0gJ3NjYWxlJykge1xyXG4gICAgcGF0dGVybiA9IGdldFNjYWxlUGF0dGVybihzY2FsZVR5cGUpO1xyXG4gIH0gZWxzZSBpZiAoY2hvcmRPclNjYWxlID09PSAnY2hvcmQnKSB7XHJcbiAgICBwYXR0ZXJuID0gZ2V0Q2hvcmRQYXR0ZXJuKHNjYWxlVHlwZSk7XHJcbiAgfVxyXG4gIHJldHVybiBwYXR0ZXJuO1xyXG59XHJcblxyXG5cclxuY2xhc3Mgc2NhbGVEYXRhYmFzZSB7XHJcbiAgc3RhdGljIGdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKSB7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSBnZXRQYXR0ZXJuKCk7XHJcbiAgICByZXR1cm4gc2NhbGVQYXR0ZXJuO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzY2FsZURhdGFiYXNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jbGFzcyBTY2FsZURpc3BsYXkge1xyXG4gIHN0YXRpYyBpbml0KCkge1xyXG4gICAgdGhpcy5kb21FbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjYWxlLWRpc3BsYXlfX3RleHQtcGFuZWwnKTtcclxuICAgIHRoaXMuZG9tRWxlbS50ZXh0Q29udGVudCA9ICcnO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNldFRleHQodGV4dCkge1xyXG4gICAgdGhpcy5kb21FbGVtLnRleHRDb250ZW50ID0gdGV4dDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NhbGVEaXNwbGF5O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jbGFzcyBUaW1lck1hbmFnZXIge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy50aW1lcnMgPSBbXTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE86IFRha2Ugb2Zmc2V0IHRpbWUgZnJvbSBzZXR0aW5nc1xyXG4gIGFkZFRpbWVyKGNhbGxiYWNrLCBvZmZzZXRJbmRleCkge1xyXG4gICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KGNhbGxiYWNrLCAyMDAgKiBvZmZzZXRJbmRleCk7XHJcbiAgICB0aGlzLnRpbWVycy5wdXNoKHRpbWVyKTtcclxuICB9XHJcblxyXG4gIGNsZWFyQWxsVGltZXJzKCkge1xyXG4gICAgdGhpcy50aW1lcnMuZm9yRWFjaCgodGltZXIpID0+IHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy50aW1lcnMgPSBbXTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZXJNYW5hZ2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0XG4gKiBAcGFyYW0ge251bWJlcn0gZW5kIFRoaXMgbnVtYmVyIGlzIGluY2x1ZGVkXG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cbmZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIFsuLi5BcnJheShlbmQgLSBzdGFydCArIDEpLmZpbGwoKS5tYXAoKF8sIGkpID0+IGkgKyAxKV07XG59XG5cbi8qKlxuICogUnVucyBhIGNhbGxiYWNrIGZvciBlYWNoIGl0ZW0gb2YgaXRlbXMsIGl0ZXJhdGluZyB1c2luZyBpbmNyZW1lbnRzIGZyb20gdGhlIHBhdHRlcm5BcnJheVxuICogQHBhcmFtIHtBcnJheX0gcGF0dGVybkFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtc1xuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IEFwcGxpZXMgY2FsbGJhY2sgc3RhcnRpbmcgZnJvbSBpbmRleCArIHRoZSBmaXJzdCBpbmNyZW1lbnQgb2YgdGhlIHBhdHRlcm5cbiAqIEBwYXJhbSB7VGltZXJNYW5hZ2VyfSB0aW1lck1hbmFnZXIgT3B0aW9uYWwgbWFuYWdlciBmb3IgdGltZW91dHMgYmV0d2VlbiBlYWNoIGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmaXJzdEl0ZW1DYWxsYmFja1xuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tGb3JFYWNoSXRlbVxuICovXG5mdW5jdGlvbiB1c2VQYXR0ZXJuKHBhdHRlcm5BcnJheSkge1xuICByZXR1cm4ge1xuICAgIGZvckl0ZW1zKGl0ZW1zKSB7XG4gICAgICB0aGlzLml0ZW1zID0gaXRlbXM7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGZyb21JbmRleChpbmRleCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB3aXRoVGltZXIodGltZXJNYW5hZ2VyKSB7XG4gICAgICB0aGlzLnRpbWVyTWFuYWdlciA9IHRpbWVyTWFuYWdlcjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcnVuRm9yRmlyc3RJdGVtKGZpcnN0SXRlbUNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmZpcnN0SXRlbUNhbGxiYWNrID0gZmlyc3RJdGVtQ2FsbGJhY2s7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJ1bihjYWxsYmFja0ZvckVhY2hJdGVtKSB7XG4gICAgICBpZiAodGhpcy5maXJzdEl0ZW1DYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0SXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5pbmRleF07XG4gICAgICAgIHRoaXMuZmlyc3RJdGVtQ2FsbGJhY2soZmlyc3RJdGVtKTtcbiAgICAgIH1cblxuICAgICAgbGV0IG9mZnNldCA9IDA7XG4gICAgICBwYXR0ZXJuQXJyYXkuZm9yRWFjaCgoaW5jcmVtZW50LCBpZHgpID0+IHtcbiAgICAgICAgdGhpcy5pbmRleCArPSBpbmNyZW1lbnQ7XG4gICAgICAgIG9mZnNldCArPSBpbmNyZW1lbnQ7XG4gICAgICAgIGNvbnN0IGNsb3N1cmVPZmZzZXQgPSBvZmZzZXQ7XG5cbiAgICAgICAgY29uc3QgbmV4dEl0ZW0gPSB0aGlzLml0ZW1zW3RoaXMuaW5kZXhdO1xuICAgICAgICBpZiAobmV4dEl0ZW0gPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLnRpbWVyTWFuYWdlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY2FsbGJhY2tGb3JFYWNoSXRlbShuZXh0SXRlbSwgb2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRpbWVyTWFuYWdlci5hZGRUaW1lcigoKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFja0ZvckVhY2hJdGVtKG5leHRJdGVtLCBjbG9zdXJlT2Zmc2V0KTtcbiAgICAgICAgICB9LCBpZHggKyAxKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IHJhbmdlLCB1c2VQYXR0ZXJuIH07XG4iXX0=
