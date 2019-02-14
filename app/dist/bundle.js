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
      'suspended 2': [2, 5],
      'suspended 4': [5, 2],
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

},{"./data/piano-key-base-ids":5,"./degree-tile":8,"./scale-database":16,"./timer-manager":18,"./util":19}],8:[function(require,module,exports){
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

},{"./data/offset-to-degree-sets":4,"./scale-controller":15}],9:[function(require,module,exports){
'use strict';

const Keyboard = require('./keyboard');
const DegreeDisplay = require('./degree-display');
const ScaleController = require('./scale-controller');
const ScaleDisplay = require('./scale-display');
const PianoAudioController = require('./piano-audio-controller');

ScaleController.init();
ScaleDisplay.init();
PianoAudioController.init();

const mainKeyboard = new Keyboard();
mainKeyboard.setDisplayNameForAllKeysOfType('standard');

const degreeDisplay = new DegreeDisplay();
degreeDisplay.enableHiddenForAllTiles();

},{"./degree-display":7,"./keyboard":11,"./piano-audio-controller":13,"./scale-controller":15,"./scale-display":17}],10:[function(require,module,exports){
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
        key.playAudio();
      });
  }

  setDisplayNameForAllKeysOfType(type) {
    this.keys.forEach((key) => {
      key.setDisplayNameOfType(type);
    });
  }
}

module.exports = Keyboard;

},{"./data/piano-key-base-ids":5,"./degree-display":7,"./piano-key":14,"./scale-database":16,"./timer-manager":18,"./util":19}],12:[function(require,module,exports){
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

const pianoKeyBaseIDs = require('./data/piano-key-base-ids');
const { range } = require('./util');

function generateAudioFileNames() {
  const audioFileNames = [];
  const NUM_OF_OCTAVES = 3;
  range(1, NUM_OF_OCTAVES).forEach((octave) => {
    pianoKeyBaseIDs.forEach((baseID) => {
      const audioFileName = `./audio/${baseID}${octave}.ogg`;
      audioFileNames.push(audioFileName);
    });
  });
  return audioFileNames;
}

function createAudioElements(filenames) {
  const audioElements = [];
  filenames.forEach((filename) => {
    const audioElement = new Audio(filename);
    audioElements.push(audioElement);
  });
  return audioElements;
}

function getAudioElements() {
  const filenames = generateAudioFileNames();
  const audioElements = createAudioElements(filenames);
  return audioElements;
}


class PianoAudioController {
  static init(options = {}) {
    const { volume = 0.2 } = options;
    this.masterVolume = volume;
    this.audioElements = getAudioElements();
  }

  static setMasterVolume(volume = this.masterVolume) {
    if (volume < 0 || volume > 1.0) return;
    this.masterVolume = volume;
  }

  static playKeyAtIndex(index) {
    const audioElement = this.audioElements[index];
    if (audioElement === undefined) return;
    const audioClone = audioElement.cloneNode();
    audioClone.volume = this.masterVolume;
    audioClone.play();
  }
}

module.exports = PianoAudioController;

},{"./data/piano-key-base-ids":5,"./util":19}],14:[function(require,module,exports){
'use strict';

const KeyName = require('./key-name');
const NameSanitizer = require('./name-sanitizer');
const PianoAudioController = require('./piano-audio-controller');

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
  pianoKey.domNode.addEventListener('mousedown', () => {1
    pianoKey.playAudio();
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
    pianoKey.playAudio();
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

  playAudio() {
    PianoAudioController.playKeyAtIndex(this.index);
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

},{"./data/highlighting-class-names":1,"./key-name":10,"./name-sanitizer":12,"./piano-audio-controller":13}],15:[function(require,module,exports){
'use strict';

const NameSanitizer = require('./name-sanitizer');
const ScaleDisplay = require('./scale-display');
const { toTitleCase } = require('./util');

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
      const formattedScaleName = scaleController.getFormattedScaleName();
      ScaleDisplay.setText(formattedScaleName);
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

  static getFormattedScaleName() {
    const { chordOrScale, scaleType } = getInfoOfScaleState();
    const lowercaseName = `${scaleType} ${chordOrScale}`;
    const titlecaseName = toTitleCase(lowercaseName);
    return titlecaseName;
  }
}


module.exports = scaleController;

},{"./name-sanitizer":12,"./scale-display":17,"./util":19}],16:[function(require,module,exports){
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

},{"./data/scale-data":6,"./scale-controller":15}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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
 * Sets the first letter of each word in a string to uppercase
 * @param {string} str
 */
function toTitleCase(str) {
  const strInTitleCase = str.split(' ').map((word) => {
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }).join(' ');
  return strInTitleCase;
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

module.exports = { range, toTitleCase, usePattern };

},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzLmpzIiwiYXBwL3NyYy9kYXRhL2tleS1uYW1lLXNldHMuanMiLCJhcHAvc3JjL2RhdGEva2V5LW5hbWUtdG8taWQtZW51bS5qcyIsImFwcC9zcmMvZGF0YS9vZmZzZXQtdG8tZGVncmVlLXNldHMuanMiLCJhcHAvc3JjL2RhdGEvcGlhbm8ta2V5LWJhc2UtaWRzLmpzIiwiYXBwL3NyYy9kYXRhL3NjYWxlLWRhdGEuanMiLCJhcHAvc3JjL2RlZ3JlZS1kaXNwbGF5LmpzIiwiYXBwL3NyYy9kZWdyZWUtdGlsZS5qcyIsImFwcC9zcmMvaW5kZXguanMiLCJhcHAvc3JjL2tleS1uYW1lLmpzIiwiYXBwL3NyYy9rZXlib2FyZC5qcyIsImFwcC9zcmMvbmFtZS1zYW5pdGl6ZXIuanMiLCJhcHAvc3JjL3BpYW5vLWF1ZGlvLWNvbnRyb2xsZXIuanMiLCJhcHAvc3JjL3BpYW5vLWtleS5qcyIsImFwcC9zcmMvc2NhbGUtY29udHJvbGxlci5qcyIsImFwcC9zcmMvc2NhbGUtZGF0YWJhc2UuanMiLCJhcHAvc3JjL3NjYWxlLWRpc3BsYXkuanMiLCJhcHAvc3JjL3RpbWVyLW1hbmFnZXIuanMiLCJhcHAvc3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMgPSBbXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JyxcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2stLXJvb3QnLFxyXG4gICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScsXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJyxcclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qga2V5TmFtZVNldHMgPSB7XHJcbiAgc3RhbmRhcmQ6IFsnQycsICdD4pmvJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdC4pmtJywgJ0InXSxcclxuICBzaGFycDogWydDJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG4gIGZsYXQ6IFsnQycsICdE4pmtJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnR+KZrScsICdHJywgJ0Hima0nLCAnQScsICdC4pmtJywgJ0InXSxcclxuICBmaXhlZERvU2hhcnA6IFsnRG8nLCAnRGknLCAnUmUnLCAnUmknLCAnTWknLCAnRmEnLCAnRmknLCAnU28nLCAnU2knLCAnTGEnLCAnTGknLCAnVGknXSxcclxuICBmaXhlZERvRmxhdDogWydEbycsICdSYScsICdSZScsICdNZScsICdNaScsICdGYScsICdTZScsICdTbycsICdMZScsICdMYScsICdUZScsICdUaSddLFxyXG4gIHNwZWNpYWxGU2hhcnBNOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG4gIHNwZWNpYWxDU2hhcnBNOiBbJ0IjJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRSMnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga2V5TmFtZVNldHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGtleU5hbWVUb0lERW51bSA9IE9iamVjdC5mcmVlemUoe1xyXG4gICdDJzogMCxcclxuICAnQ+KZryc6IDEsXHJcbiAgJ0QnOiAyLFxyXG4gICdE4pmvJzogMyxcclxuICAnRSc6IDQsXHJcbiAgJ0YnOiA1LFxyXG4gICdG4pmvJzogNixcclxuICAnRyc6IDcsXHJcbiAgJ0fima8nOiA4LFxyXG4gICdBJzogOSxcclxuICAnQeKZryc6IDEwLFxyXG4gICdCJzogMTEsXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlOYW1lVG9JREVudW07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IG9mZnNldFRvRGVncmVlU2V0cyA9IHtcclxuICBzY2FsZToge1xyXG4gICAgc3RhbmRhcmQ6IFsnMScsICdiMicsICcyJywgJ2IzJywgJzMnLCAnNCcsICdiNScsICc1JywgJ2I2JywgJzYnLCAnYjcnLCAnNyddLFxyXG4gICAgbW92YWJsZURvU2hhcnA6IFsnRG8nLCAnRGknLCAnUmUnLCAnUmknLCAnTWknLCAnRmEnLCAnRmknLCAnU28nLCAnU2knLCAnTGEnLCAnTGknLCAnVGknXSxcclxuICAgIG1vdmFibGVEb0ZsYXQ6IFsnRG8nLCAnUmEnLCAnUmUnLCAnTWUnLCAnTWknLCAnRmEnLCAnU2UnLCAnU28nLCAnTGUnLCAnTGEnLCAnVGUnLCAnVGknXSxcclxuICB9LFxyXG4gIGNob3JkOiB7XHJcbiAgICBzdGFuZGFyZDogWycxJywgJ2IyJywgJzInLCAnYjMnLCAnMycsICc0JywgJ2I1JywgJzUnLCAnYjYnLCAnNicsICdiNycsICc3JywgJzEnLCAnYjknLCAnOScsICdzOScsICczJywgJ2IxMScsICcxMSddLFxyXG4gIH0sXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG9mZnNldFRvRGVncmVlU2V0cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgcGlhbm9LZXlCYXNlSURzID0gW1xyXG4gICdjJyxcclxuICAnYy1zaGFycCcsXHJcbiAgJ2QnLFxyXG4gICdkLXNoYXJwJyxcclxuICAnZScsXHJcbiAgJ2YnLFxyXG4gICdmLXNoYXJwJyxcclxuICAnZycsXHJcbiAgJ2ctc2hhcnAnLFxyXG4gICdhJyxcclxuICAnYS1zaGFycCcsXHJcbiAgJ2InLFxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwaWFub0tleUJhc2VJRHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGRhdGEgPSB7XHJcbiAgcGF0dGVybnM6IHtcclxuICAgIHNjYWxlczoge1xyXG4gICAgICAnbWFqb3InOiBbMiwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICdtaW5vcic6IFsyLCAxLCAyLCAyLCAxLCAyXSxcclxuICAgICAgJ2hhcm1vbmljIG1pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAnbWVsb2RpYyBtaW5vcic6IFsyLCAxLCAyLCAyLCAyLCAyXSxcclxuXHJcbiAgICB9LFxyXG4gICAgY2hvcmRzOiB7XHJcbiAgICAgICdtYWpvcic6IFs0LCAzXSxcclxuICAgICAgJ21pbm9yJzogWzMsIDRdLFxyXG4gICAgICAnZGltaW5pc2hlZCc6IFszLCAzXSxcclxuICAgICAgJ2F1Z21lbnRlZCc6IFs0LCA0XSxcclxuICAgICAgJ3N1c3BlbmRlZCAyJzogWzIsIDVdLFxyXG4gICAgICAnc3VzcGVuZGVkIDQnOiBbNSwgMl0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGE7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IERlZ3JlZVRpbGUgPSByZXF1aXJlKCcuL2RlZ3JlZS10aWxlJyk7XHJcbmNvbnN0IFNjYWxlRGF0YWJhc2UgPSByZXF1aXJlKCcuL3NjYWxlLWRhdGFiYXNlJyk7XHJcbmNvbnN0IFRpbWVyTWFuYWdlciA9IHJlcXVpcmUoJy4vdGltZXItbWFuYWdlcicpO1xyXG5cclxuY29uc3QgcGlhbm9LZXlCYXNlSURzID0gcmVxdWlyZSgnLi9kYXRhL3BpYW5vLWtleS1iYXNlLWlkcycpO1xyXG5jb25zdCB7IHJhbmdlLCB1c2VQYXR0ZXJuIH0gPSByZXF1aXJlKCcuL3V0aWwnKTtcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlRGVncmVlRGlzcGxheVRpbGVEb21JRHMoKSB7XHJcbiAgY29uc3QgdGlsZU5hbWVzID0gW107XHJcbiAgY29uc3QgTlVNX09GX09DVEFWRVMgPSAzO1xyXG4gIHJhbmdlKDEsIE5VTV9PRl9PQ1RBVkVTKS5mb3JFYWNoKChvY3RhdmUpID0+IHtcclxuICAgIHBpYW5vS2V5QmFzZUlEcy5mb3JFYWNoKChiYXNlSUQpID0+IHtcclxuICAgICAgY29uc3QgdGlsZU5hbWUgPSBgZGVncmVlLSR7YmFzZUlEfSR7b2N0YXZlfWA7XHJcbiAgICAgIHRpbGVOYW1lcy5wdXNoKHRpbGVOYW1lKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiB0aWxlTmFtZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERlZ3JlZVRpbGVzVXNpbmdEb21JRHModGlsZU5hbWVJRHMgPSBbXSkge1xyXG4gIGNvbnN0IGRlZ3JlZVRpbGVOb2RlcyA9IFtdO1xyXG4gIHRpbGVOYW1lSURzLmZvckVhY2goKGlkLCB0aWxlSW5kZXgpID0+IHtcclxuICAgIGNvbnN0IGRlZ3JlZVRpbGUgPSBuZXcgRGVncmVlVGlsZShpZCwgdGlsZUluZGV4KTtcclxuICAgIGRlZ3JlZVRpbGVOb2Rlcy5wdXNoKGRlZ3JlZVRpbGUpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBkZWdyZWVUaWxlTm9kZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERlZ3JlZVRpbGVzKCkge1xyXG4gIGNvbnN0IHRpbGVOYW1lSURzID0gZ2VuZXJhdGVEZWdyZWVEaXNwbGF5VGlsZURvbUlEcygpO1xyXG4gIGNvbnN0IGRlZ3JlZVRpbGVzID0gZ2V0RGVncmVlVGlsZXNVc2luZ0RvbUlEcyh0aWxlTmFtZUlEcyk7XHJcbiAgcmV0dXJuIGRlZ3JlZVRpbGVzO1xyXG59XHJcblxyXG5cclxuY2xhc3MgRGVncmVlRGlzcGxheSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmRlZ3JlZVRpbGVzID0gZ2V0RGVncmVlVGlsZXMoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyID0gbmV3IFRpbWVyTWFuYWdlcigpO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlkZGVuRm9yQWxsVGlsZXMoKSB7XHJcbiAgICB0aGlzLmRlZ3JlZVRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcclxuICAgICAgdGlsZS5lbmFibGVIaWRkZW4oKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheWVkVGlsZXNGb3JTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KSB7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSBTY2FsZURhdGFiYXNlLmdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKTtcclxuICAgIGlmIChzY2FsZVBhdHRlcm4ubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLmVuYWJsZUhpZGRlbkZvckFsbFRpbGVzKCk7XHJcbiAgICB0aGlzLnJlc2V0VGV4dE9uQWxsVGlsZXMoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyLmNsZWFyQWxsVGltZXJzKCk7XHJcbiAgICB1c2VQYXR0ZXJuKHNjYWxlUGF0dGVybilcclxuICAgICAgLmZvckl0ZW1zKHRoaXMuZGVncmVlVGlsZXMpXHJcbiAgICAgIC5mcm9tSW5kZXgoaW5kZXgpXHJcbiAgICAgIC53aXRoVGltZXIodGhpcy50aW1lck1hbmFnZXIpXHJcbiAgICAgIC5ydW5Gb3JGaXJzdEl0ZW0oKHRpbGUpID0+IHtcclxuICAgICAgICBjb25zdCByb290T2Zmc2V0ID0gMDtcclxuICAgICAgICB0aWxlLnNldERlZ3JlZU51bWJlcihyb290T2Zmc2V0KTtcclxuICAgICAgICB0aWxlLmRpc2FibGVIaWRkZW4oKTtcclxuICAgICAgfSlcclxuICAgICAgLnJ1bigodGlsZSwgb2Zmc2V0KSA9PiB7XHJcbiAgICAgICAgdGlsZS5zZXREZWdyZWVOdW1iZXIob2Zmc2V0KTtcclxuICAgICAgICB0aWxlLmRpc2FibGVIaWRkZW4oKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXNldFRleHRPbkFsbFRpbGVzKCkge1xyXG4gICAgdGhpcy5kZWdyZWVUaWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XHJcbiAgICAgIHRpbGUuc2V0RGVncmVlVGV4dCgnJyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVncmVlRGlzcGxheTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcblxyXG5jb25zdCBvZmZzZXRUb0RlZ3JlZVNldHMgPSByZXF1aXJlKCcuL2RhdGEvb2Zmc2V0LXRvLWRlZ3JlZS1zZXRzJyk7XHJcblxyXG5jbGFzcyBEZWdyZWVUaWxlIHtcclxuICBjb25zdHJ1Y3Rvcihkb21JRCwgaW5kZXgpIHtcclxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmRlZ3JlZS1kaXNwbGF5X19kZWdyZWUtdGV4dCcpO1xyXG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlkZGVuKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gIH1cclxuXHJcbiAgZGlzYWJsZUhpZGRlbigpIHtcclxuICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICB9XHJcblxyXG4gIHNldERlZ3JlZU51bWJlcihvZmZzZXRGcm9tUm9vdE5vdGUpIHtcclxuICAgIGNvbnN0IGNob3JkT3JTY2FsZSA9IFNjYWxlQ29udHJvbGxlci5nZXRDaG9yZE9yU2NhbGUoKTtcclxuICAgIGNvbnN0IGRlZ3JlZVR5cGUgPSAnc3RhbmRhcmQnOyAvLyBTZXR0aW5ncy5nZXREZWdyZWVUeXBlKCk7XHJcbiAgICBsZXQgZGVncmVlID0gJyc7XHJcbiAgICBpZiAoY2hvcmRPclNjYWxlID09PSAnc2NhbGUnKSB7XHJcbiAgICAgIGNvbnN0IHNjYWxlU2V0ID0gb2Zmc2V0VG9EZWdyZWVTZXRzLnNjYWxlW2RlZ3JlZVR5cGVdO1xyXG4gICAgICBpZiAoc2NhbGVTZXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICBkZWdyZWUgPSBzY2FsZVNldFtvZmZzZXRGcm9tUm9vdE5vdGVdO1xyXG4gICAgfSBlbHNlIGlmIChjaG9yZE9yU2NhbGUgPT09ICdjaG9yZCcpIHtcclxuICAgICAgY29uc3QgY2hvcmRTZXQgPSBvZmZzZXRUb0RlZ3JlZVNldHMuY2hvcmRbZGVncmVlVHlwZV07XHJcbiAgICAgIGlmIChjaG9yZFNldCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgIGRlZ3JlZSA9IGNob3JkU2V0W29mZnNldEZyb21Sb290Tm90ZV07XHJcbiAgICB9XHJcbiAgICB0aGlzLnNldERlZ3JlZVRleHQoZGVncmVlKTtcclxuICB9XHJcblxyXG4gIHNldERlZ3JlZVRleHQodGV4dCkge1xyXG4gICAgdGhpcy5kb21UZXh0Tm9kZS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlZ3JlZVRpbGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEtleWJvYXJkID0gcmVxdWlyZSgnLi9rZXlib2FyZCcpO1xyXG5jb25zdCBEZWdyZWVEaXNwbGF5ID0gcmVxdWlyZSgnLi9kZWdyZWUtZGlzcGxheScpO1xyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuY29uc3QgU2NhbGVEaXNwbGF5ID0gcmVxdWlyZSgnLi9zY2FsZS1kaXNwbGF5Jyk7XHJcbmNvbnN0IFBpYW5vQXVkaW9Db250cm9sbGVyID0gcmVxdWlyZSgnLi9waWFuby1hdWRpby1jb250cm9sbGVyJyk7XHJcblxyXG5TY2FsZUNvbnRyb2xsZXIuaW5pdCgpO1xyXG5TY2FsZURpc3BsYXkuaW5pdCgpO1xyXG5QaWFub0F1ZGlvQ29udHJvbGxlci5pbml0KCk7XHJcblxyXG5jb25zdCBtYWluS2V5Ym9hcmQgPSBuZXcgS2V5Ym9hcmQoKTtcclxubWFpbktleWJvYXJkLnNldERpc3BsYXlOYW1lRm9yQWxsS2V5c09mVHlwZSgnc3RhbmRhcmQnKTtcclxuXHJcbmNvbnN0IGRlZ3JlZURpc3BsYXkgPSBuZXcgRGVncmVlRGlzcGxheSgpO1xyXG5kZWdyZWVEaXNwbGF5LmVuYWJsZUhpZGRlbkZvckFsbFRpbGVzKCk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGtleU5hbWVTZXRzID0gcmVxdWlyZSgnLi9kYXRhL2tleS1uYW1lLXNldHMnKTtcclxuY29uc3Qga2V5TmFtZVRvSURFbnVtID0gcmVxdWlyZSgnLi9kYXRhL2tleS1uYW1lLXRvLWlkLWVudW0nKTtcclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZUtleUlEKGJhc2VOYW1lKSB7XHJcbiAgY29uc3QgaWQgPSBrZXlOYW1lVG9JREVudW1bYmFzZU5hbWVdO1xyXG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gLTE7XHJcbiAgcmV0dXJuIGlkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRLZXlOYW1lU2V0KHR5cGUpIHtcclxuICBjb25zdCBrZXlOYW1lU2V0ID0ga2V5TmFtZVNldHNbdHlwZV07XHJcbiAgaWYgKGtleU5hbWVTZXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gIHJldHVybiBrZXlOYW1lU2V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbGlhc09mU3BlY2lmaWNUeXBlKGtleU5hbWVTZXQsIGtleUlEKSB7XHJcbiAgY29uc3QgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGtleU5hbWVTZXRba2V5SURdO1xyXG4gIGlmIChhbGlhc09mU3BlY2lmaWNUeXBlID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcclxufVxyXG5cclxuXHJcbmNsYXNzIEtleU5hbWUge1xyXG4gIGNvbnN0cnVjdG9yKGJhc2VOYW1lKSB7XHJcbiAgICB0aGlzLmlkID0gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxpYXNPZlR5cGUodHlwZSkge1xyXG4gICAgY29uc3Qga2V5TmFtZVNldCA9IGdldEtleU5hbWVTZXQodHlwZSk7XHJcbiAgICBjb25zdCBhbGlhc09mU3BlY2lmaWNUeXBlID0gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCB0aGlzLmlkKTtcclxuICAgIHJldHVybiBhbGlhc09mU3BlY2lmaWNUeXBlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlOYW1lO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBQaWFub0tleSA9IHJlcXVpcmUoJy4vcGlhbm8ta2V5Jyk7XHJcbmNvbnN0IFNjYWxlRGF0YWJhc2UgPSByZXF1aXJlKCcuL3NjYWxlLWRhdGFiYXNlJyk7XHJcbmNvbnN0IFRpbWVyTWFuYWdlciA9IHJlcXVpcmUoJy4vdGltZXItbWFuYWdlcicpO1xyXG5jb25zdCBEZWdyZWVEaXNwbGF5ID0gcmVxdWlyZSgnLi9kZWdyZWUtZGlzcGxheScpO1xyXG5cclxuY29uc3QgeyByYW5nZSwgdXNlUGF0dGVybiB9ID0gcmVxdWlyZSgnLi91dGlsJyk7XHJcbmNvbnN0IHBpYW5vS2V5QmFzZUlEcyA9IHJlcXVpcmUoJy4vZGF0YS9waWFuby1rZXktYmFzZS1pZHMnKTtcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlS2V5TmFtZURvbUlEcygpIHtcclxuICBjb25zdCBrZXlOYW1lc1dpdGhPY3RhdmVzID0gW107XHJcbiAgY29uc3QgTlVNX09GX09DVEFWRVMgPSAzO1xyXG4gIHJhbmdlKDEsIE5VTV9PRl9PQ1RBVkVTKS5mb3JFYWNoKChvY3RhdmUpID0+IHtcclxuICAgIHBpYW5vS2V5QmFzZUlEcy5mb3JFYWNoKChiYXNlSUQpID0+IHtcclxuICAgICAgY29uc3QgbmFtZVdpdGhPY3RhdmUgPSBiYXNlSUQgKyBvY3RhdmU7XHJcbiAgICAgIGtleU5hbWVzV2l0aE9jdGF2ZXMucHVzaChuYW1lV2l0aE9jdGF2ZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4ga2V5TmFtZXNXaXRoT2N0YXZlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlzVXNpbmdEb21JRHMoa2V5TmFtZUlEcyA9IFtdKSB7XHJcbiAgY29uc3QgcGlhbm9LZXlOb2RlcyA9IFtdO1xyXG4gIGtleU5hbWVJRHMuZm9yRWFjaCgoaWQsIGtleUluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBwaWFub0tleSA9IG5ldyBQaWFub0tleShpZCwga2V5SW5kZXgpO1xyXG4gICAgcGlhbm9LZXlOb2Rlcy5wdXNoKHBpYW5vS2V5KTtcclxuICB9KTtcclxuICByZXR1cm4gcGlhbm9LZXlOb2RlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlzKCkge1xyXG4gIGNvbnN0IGtleU5hbWVJRHMgPSBnZW5lcmF0ZUtleU5hbWVEb21JRHMoKTtcclxuICBjb25zdCBwaWFub0tleXMgPSBnZXRQaWFub0tleXNVc2luZ0RvbUlEcyhrZXlOYW1lSURzKTtcclxuICByZXR1cm4gcGlhbm9LZXlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKGtleWJvYXJkKSB7XHJcbiAga2V5Ym9hcmQuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZXZlbnRTb3VyY2UgPSBrZXlib2FyZC5rZXlzLmZpbmQoaXRlbSA9PiBpdGVtLmdldERvbU5vZGUoKSA9PT0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5rZXlib2FyZF9fa2V5JykpO1xyXG4gICAgaWYgKGV2ZW50U291cmNlID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgIGNvbnN0IGluZGV4ID0gZXZlbnRTb3VyY2UuZ2V0S2V5SW5kZXgoKTtcclxuICAgIGtleWJvYXJkLmVuYWJsZUhpZ2hsaWdodGluZ0ZvclNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpO1xyXG4gICAga2V5Ym9hcmQuZGVncmVlRGlzcGxheS5zZXREaXNwbGF5ZWRUaWxlc0ZvclNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuY2xhc3MgS2V5Ym9hcmQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmtleWJvYXJkJyk7XHJcbiAgICB0aGlzLmtleXMgPSBnZXRQaWFub0tleXMoKTtcclxuICAgIHRoaXMuZGVncmVlRGlzcGxheSA9IG5ldyBEZWdyZWVEaXNwbGF5KCk7XHJcbiAgICB0aGlzLnRpbWVyTWFuYWdlciA9IG5ldyBUaW1lck1hbmFnZXIoKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlnaGxpZ2h0aW5nRm9yQWxsS2V5cygpIHtcclxuICAgIHRoaXMua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAga2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlnaGxpZ2h0aW5nRm9yU2NhbGVTdGFydGluZ0Zyb21JbmRleChpbmRleCkge1xyXG4gICAgY29uc3Qgc2NhbGVQYXR0ZXJuID0gU2NhbGVEYXRhYmFzZS5nZXRQYXR0ZXJuT2ZTZWxlY3RlZFNjYWxlKCk7XHJcbiAgICBpZiAoc2NhbGVQYXR0ZXJuLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgdGhpcy50aW1lck1hbmFnZXIuY2xlYXJBbGxUaW1lcnMoKTtcclxuICAgIHRoaXMuZGlzYWJsZUhpZ2hsaWdodGluZ0ZvckFsbEtleXMoKTtcclxuICAgIHVzZVBhdHRlcm4oc2NhbGVQYXR0ZXJuKVxyXG4gICAgICAuZm9ySXRlbXModGhpcy5rZXlzKVxyXG4gICAgICAuZnJvbUluZGV4KGluZGV4KVxyXG4gICAgICAud2l0aFRpbWVyKHRoaXMudGltZXJNYW5hZ2VyKVxyXG4gICAgICAucnVuRm9yRmlyc3RJdGVtKChyb290S2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNSb290S2V5ID0gdHJ1ZTtcclxuICAgICAgICByb290S2V5LmVuYWJsZUhpZ2hsaWdodGluZyhpc1Jvb3RLZXkpO1xyXG4gICAgICB9KVxyXG4gICAgICAucnVuKChrZXkpID0+IHtcclxuICAgICAgICBrZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgICAga2V5LnBsYXlBdWRpbygpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldERpc3BsYXlOYW1lRm9yQWxsS2V5c09mVHlwZSh0eXBlKSB7XHJcbiAgICB0aGlzLmtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgIGtleS5zZXREaXNwbGF5TmFtZU9mVHlwZSh0eXBlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgTmFtZVNhbml0aXplciA9IHtcclxuXHJcbiAgLyogJ2J0bi1zY2FsZS1tYWpvcicgLT4gJ3NjYWxlLW1ham9yJyAqL1xyXG4gIGNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKSB7XHJcbiAgICBpZiAoYnV0dG9uSUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gICAgY29uc3Qgc3RhdGVOYW1lID0gYnV0dG9uSUQuc3Vic3RyaW5nKDQpO1xyXG4gICAgcmV0dXJuIHN0YXRlTmFtZTtcclxuICB9LFxyXG5cclxuICAvKiAnYy1zaGFycDEnIC0+ICdj4pmvJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9LZXlOYW1lQmFzZU5hbWUocGlhbm9LZXlEb21JRCkge1xyXG4gICAgaWYgKHBpYW5vS2V5RG9tSUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gICAgY29uc3QgdHJpbW1lZE5hbWUgPSBwaWFub0tleURvbUlELnNsaWNlKDAsIC0xKTtcclxuICAgIGNvbnN0IGtleU5hbWVCYXNlTmFtZSA9IHRyaW1tZWROYW1lLnJlcGxhY2UoJy1zaGFycCcsICfima8nKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgcmV0dXJuIGtleU5hbWVCYXNlTmFtZTtcclxuICB9LFxyXG5cclxuICAvKiAnYy1zaGFycDEnIC0+ICcxJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9PY3RhdmVOdW1iZXIocGlhbm9LZXlEb21JRCkge1xyXG4gICAgcmV0dXJuIHBpYW5vS2V5RG9tSUQuc2xpY2UoLTEpO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJ2JsYWNrJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9Db2xvcihwaWFub0tleURvbUlEKSB7XHJcbiAgICByZXR1cm4gKHBpYW5vS2V5RG9tSUQuaW5kZXhPZignc2hhcnAnKSAhPT0gLTEpID8gJ2JsYWNrJyA6ICd3aGl0ZSc7XHJcbiAgfSxcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVTYW5pdGl6ZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcGlhbm9LZXlCYXNlSURzID0gcmVxdWlyZSgnLi9kYXRhL3BpYW5vLWtleS1iYXNlLWlkcycpO1xuY29uc3QgeyByYW5nZSB9ID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQXVkaW9GaWxlTmFtZXMoKSB7XG4gIGNvbnN0IGF1ZGlvRmlsZU5hbWVzID0gW107XG4gIGNvbnN0IE5VTV9PRl9PQ1RBVkVTID0gMztcbiAgcmFuZ2UoMSwgTlVNX09GX09DVEFWRVMpLmZvckVhY2goKG9jdGF2ZSkgPT4ge1xuICAgIHBpYW5vS2V5QmFzZUlEcy5mb3JFYWNoKChiYXNlSUQpID0+IHtcbiAgICAgIGNvbnN0IGF1ZGlvRmlsZU5hbWUgPSBgLi9hdWRpby8ke2Jhc2VJRH0ke29jdGF2ZX0ub2dnYDtcbiAgICAgIGF1ZGlvRmlsZU5hbWVzLnB1c2goYXVkaW9GaWxlTmFtZSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gYXVkaW9GaWxlTmFtZXM7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUF1ZGlvRWxlbWVudHMoZmlsZW5hbWVzKSB7XG4gIGNvbnN0IGF1ZGlvRWxlbWVudHMgPSBbXTtcbiAgZmlsZW5hbWVzLmZvckVhY2goKGZpbGVuYW1lKSA9PiB7XG4gICAgY29uc3QgYXVkaW9FbGVtZW50ID0gbmV3IEF1ZGlvKGZpbGVuYW1lKTtcbiAgICBhdWRpb0VsZW1lbnRzLnB1c2goYXVkaW9FbGVtZW50KTtcbiAgfSk7XG4gIHJldHVybiBhdWRpb0VsZW1lbnRzO1xufVxuXG5mdW5jdGlvbiBnZXRBdWRpb0VsZW1lbnRzKCkge1xuICBjb25zdCBmaWxlbmFtZXMgPSBnZW5lcmF0ZUF1ZGlvRmlsZU5hbWVzKCk7XG4gIGNvbnN0IGF1ZGlvRWxlbWVudHMgPSBjcmVhdGVBdWRpb0VsZW1lbnRzKGZpbGVuYW1lcyk7XG4gIHJldHVybiBhdWRpb0VsZW1lbnRzO1xufVxuXG5cbmNsYXNzIFBpYW5vQXVkaW9Db250cm9sbGVyIHtcbiAgc3RhdGljIGluaXQob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgeyB2b2x1bWUgPSAwLjIgfSA9IG9wdGlvbnM7XG4gICAgdGhpcy5tYXN0ZXJWb2x1bWUgPSB2b2x1bWU7XG4gICAgdGhpcy5hdWRpb0VsZW1lbnRzID0gZ2V0QXVkaW9FbGVtZW50cygpO1xuICB9XG5cbiAgc3RhdGljIHNldE1hc3RlclZvbHVtZSh2b2x1bWUgPSB0aGlzLm1hc3RlclZvbHVtZSkge1xuICAgIGlmICh2b2x1bWUgPCAwIHx8IHZvbHVtZSA+IDEuMCkgcmV0dXJuO1xuICAgIHRoaXMubWFzdGVyVm9sdW1lID0gdm9sdW1lO1xuICB9XG5cbiAgc3RhdGljIHBsYXlLZXlBdEluZGV4KGluZGV4KSB7XG4gICAgY29uc3QgYXVkaW9FbGVtZW50ID0gdGhpcy5hdWRpb0VsZW1lbnRzW2luZGV4XTtcbiAgICBpZiAoYXVkaW9FbGVtZW50ID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICBjb25zdCBhdWRpb0Nsb25lID0gYXVkaW9FbGVtZW50LmNsb25lTm9kZSgpO1xuICAgIGF1ZGlvQ2xvbmUudm9sdW1lID0gdGhpcy5tYXN0ZXJWb2x1bWU7XG4gICAgYXVkaW9DbG9uZS5wbGF5KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQaWFub0F1ZGlvQ29udHJvbGxlcjtcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEtleU5hbWUgPSByZXF1aXJlKCcuL2tleS1uYW1lJyk7XHJcbmNvbnN0IE5hbWVTYW5pdGl6ZXIgPSByZXF1aXJlKCcuL25hbWUtc2FuaXRpemVyJyk7XHJcbmNvbnN0IFBpYW5vQXVkaW9Db250cm9sbGVyID0gcmVxdWlyZSgnLi9waWFuby1hdWRpby1jb250cm9sbGVyJyk7XHJcblxyXG5jb25zdCBoaWdobGlnaHRpbmdDbGFzc05hbWVzID0gcmVxdWlyZSgnLi9kYXRhL2hpZ2hsaWdodGluZy1jbGFzcy1uYW1lcycpO1xyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lQ29sb3IoZG9tSUQpIHtcclxuICByZXR1cm4gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvQ29sb3IoZG9tSUQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVOYW1lcyhkb21JRCkge1xyXG4gIGNvbnN0IGtleU5hbWVCYXNlTmFtZSA9IE5hbWVTYW5pdGl6ZXIuY29udmVydFBpYW5vS2V5RG9tSURUb0tleU5hbWVCYXNlTmFtZShkb21JRCk7XHJcbiAgY29uc3Qga2V5TmFtZSA9IG5ldyBLZXlOYW1lKGtleU5hbWVCYXNlTmFtZSk7XHJcbiAgcmV0dXJuIGtleU5hbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZU9jdGF2ZShkb21JRCkge1xyXG4gIHJldHVybiBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9PY3RhdmVOdW1iZXIoZG9tSUQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRNb3VzZUxpc3RlbmVyKHBpYW5vS2V5KSB7XHJcbiAgcGlhbm9LZXkuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB7MVxyXG4gICAgcGlhbm9LZXkucGxheUF1ZGlvKCk7XHJcbiAgICBpZiAocGlhbm9LZXkuaXNIaWdobGlnaHRlZCgpKSByZXR1cm47XHJcbiAgICBwaWFub0tleS5lbmFibGVIaWdobGlnaHRpbmcodHJ1ZSk7XHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoKSB7XHJcbiAgICAgIHBpYW5vS2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgICAgc2V0VGltZW91dChkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKSwgMCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVG91Y2hMaXN0ZW5lcihwaWFub0tleSkge1xyXG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICgpID0+IHtcclxuICAgIHBpYW5vS2V5LnBsYXlBdWRpbygpO1xyXG4gICAgaWYgKHBpYW5vS2V5LmlzSGlnaGxpZ2h0ZWQoKSkgcmV0dXJuO1xyXG4gICAgcGlhbm9LZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKHRydWUpO1xyXG4gICAgZnVuY3Rpb24gb25Ub3VjaEVuZCgpIHtcclxuICAgICAgcGlhbm9LZXkuZGlzYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgICBzZXRUaW1lb3V0KGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCksIDApO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhwaWFub0tleSkge1xyXG4gIGFkZE1vdXNlTGlzdGVuZXIocGlhbm9LZXkpO1xyXG4gIGFkZFRvdWNoTGlzdGVuZXIocGlhbm9LZXkpO1xyXG59XHJcblxyXG5cclxuY2xhc3MgUGlhbm9LZXkge1xyXG4gIGNvbnN0cnVjdG9yKGRvbUlELCBrZXlJbmRleCkge1xyXG4gICAgdGhpcy5pbmRleCA9IGtleUluZGV4O1xyXG4gICAgdGhpcy5uYW1lcyA9IGRldGVybWluZU5hbWVzKGRvbUlEKTtcclxuICAgIHRoaXMuY29sb3IgPSBkZXRlcm1pbmVDb2xvcihkb21JRCk7XHJcbiAgICB0aGlzLm9jdGF2ZSA9IGRldGVybWluZU9jdGF2ZShkb21JRCk7XHJcbiAgICB0aGlzLmRvbU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkb21JRCk7XHJcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmRfX2tleS1uYW1lJyk7XHJcbiAgICB0aGlzLmRvbUZpbmdlcmluZ1RleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fZmluZ2VyaW5nJyk7XHJcbiAgICByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaXNIaWdobGlnaHRlZCgpIHtcclxuICAgIGxldCBpc0hpZ2hsaWdodGVkID0gZmFsc2U7XHJcbiAgICBoaWdobGlnaHRpbmdDbGFzc05hbWVzLmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XHJcbiAgICAgICAgaXNIaWdobGlnaHRlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGlzSGlnaGxpZ2h0ZWQ7XHJcbiAgfVxyXG5cclxuICBlbmFibGVIaWdobGlnaHRpbmcoaXNSb290S2V5ID0gZmFsc2UpIHtcclxuICAgIGxldCBoaWdobGlnaHRDbGFzc05hbWUgPSAnJztcclxuICAgIGlmIChpc1Jvb3RLZXkpIHtcclxuICAgICAgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/ICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZS0tcm9vdCcgOiAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2stLXJvb3QnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gdGhpcy5jb2xvciA9PT0gJ3doaXRlJyA/ICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScgOiAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2snO1xyXG4gICAgfVxyXG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoaGlnaGxpZ2h0Q2xhc3NOYW1lKTtcclxuICB9XHJcblxyXG4gIGRpc2FibGVIaWdobGlnaHRpbmcoKSB7XHJcbiAgICBoaWdobGlnaHRpbmdDbGFzc05hbWVzLmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xyXG4gICAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRDdXN0b21EaXNwbGF5TmFtZShuYW1lKSB7XHJcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IG5hbWU7XHJcbiAgfVxyXG5cclxuICBzZXREaXNwbGF5TmFtZU9mVHlwZSh0eXBlKSB7XHJcbiAgICBjb25zdCBhbGlhcyA9IHRoaXMubmFtZXMuZ2V0QWxpYXNPZlR5cGUodHlwZSk7XHJcbiAgICB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudCA9IGFsaWFzO1xyXG4gIH1cclxuXHJcbiAgcGxheUF1ZGlvKCkge1xyXG4gICAgUGlhbm9BdWRpb0NvbnRyb2xsZXIucGxheUtleUF0SW5kZXgodGhpcy5pbmRleCk7XHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50TmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRvbU5hbWVUZXh0Tm9kZS50ZXh0Q29udGVudDtcclxuICB9XHJcblxyXG4gIGdldEtleUluZGV4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5kZXg7XHJcbiAgfVxyXG5cclxuICBnZXREb21Ob2RlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZG9tTm9kZTtcclxuICB9XHJcblxyXG4gIHJlc2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAvLyBUT0RPOiBHZXQgZGVmYXVsdCB0eXBlIGZyb20gc2V0dGluZ3Mgb2JqZWN0XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGlhbm9LZXk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IE5hbWVTYW5pdGl6ZXIgPSByZXF1aXJlKCcuL25hbWUtc2FuaXRpemVyJyk7XHJcbmNvbnN0IFNjYWxlRGlzcGxheSA9IHJlcXVpcmUoJy4vc2NhbGUtZGlzcGxheScpO1xyXG5jb25zdCB7IHRvVGl0bGVDYXNlIH0gPSByZXF1aXJlKCcuL3V0aWwnKTtcclxuXHJcbmxldCBzY2FsZVN0YXRlID0gJyc7XHJcblxyXG5mdW5jdGlvbiBnZXRTdGF0ZU5hbWVGcm9tQnV0dG9uSUQoYnV0dG9uRWxlbSkge1xyXG4gIGNvbnN0IGJ1dHRvbklEID0gYnV0dG9uRWxlbS5pZDtcclxuICBjb25zdCBzdGF0ZU5hbWUgPSBOYW1lU2FuaXRpemVyLmNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKTtcclxuICByZXR1cm4gc3RhdGVOYW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRIaWdobGlnaHRPbkJ1dHRvbihidG4pIHtcclxuICBidG4uY2xhc3NMaXN0LmFkZCgnYnRuLS1zZWxlY3RlZCcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldEhpZ2hsaWdodE9uQWxsQnV0dG9ucyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBzY2FsZUNvbnRyb2xsZXIuYnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcclxuICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdidG4tLXNlbGVjdGVkJyk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluZm9PZlNjYWxlU3RhdGUoKSB7XHJcbiAgY29uc3QgW2Nob3JkT3JTY2FsZSwgLi4uc2NhbGVUeXBlVG9rZW5zXSA9IHNjYWxlU3RhdGUuc3BsaXQoJy0nKTtcclxuICBjb25zdCBzY2FsZVR5cGUgPSBzY2FsZVR5cGVUb2tlbnMuam9pbignICcpO1xyXG4gIHJldHVybiB7IGNob3JkT3JTY2FsZSwgc2NhbGVUeXBlIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEJ1dHRvbkxpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBzY2FsZUNvbnRyb2xsZXIuYnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgc2NhbGVTdGF0ZSA9IGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidG4pO1xyXG4gICAgICByZXNldEhpZ2hsaWdodE9uQWxsQnV0dG9ucyhzY2FsZUNvbnRyb2xsZXIpO1xyXG4gICAgICBhZGRIaWdobGlnaHRPbkJ1dHRvbihidG4pO1xyXG4gICAgICBjb25zdCBmb3JtYXR0ZWRTY2FsZU5hbWUgPSBzY2FsZUNvbnRyb2xsZXIuZ2V0Rm9ybWF0dGVkU2NhbGVOYW1lKCk7XHJcbiAgICAgIFNjYWxlRGlzcGxheS5zZXRUZXh0KGZvcm1hdHRlZFNjYWxlTmFtZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkRHJvcGRvd25UaXRsZUxpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBzY2FsZUNvbnRyb2xsZXIuY2F0ZWdvcmllcy5mb3JFYWNoKChjYXRlZ29yeSkgPT4ge1xyXG4gICAgY29uc3QgY2F0ZWdvcnlUaXRsZSA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1saXN0X19jYXRlZ29yeS10aXRsZScpO1xyXG4gICAgY29uc3QgZHJvcGRvd25MaXN0ID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLnNjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QnKTtcclxuICAgIGNvbnN0IGRyb3Bkb3duQXJyb3cgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tYXJyb3cnKTtcclxuICAgIGNhdGVnb3J5VGl0bGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIGNhdGVnb3J5VGl0bGUuY2xhc3NMaXN0LnRvZ2dsZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnktdGl0bGUtLWFjdGl2ZScpO1xyXG4gICAgICBkcm9wZG93bkxpc3QuY2xhc3NMaXN0LnRvZ2dsZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnktbGlzdC0taGlkZGVuJyk7XHJcbiAgICAgIGRyb3Bkb3duQXJyb3cuY2xhc3NMaXN0LnRvZ2dsZSgnZHJvcGRvd24tYXJyb3ctLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMoc2NhbGVDb250cm9sbGVyKSB7XHJcbiAgYWRkQnV0dG9uTGlzdGVuZXJzKHNjYWxlQ29udHJvbGxlcik7XHJcbiAgYWRkRHJvcGRvd25UaXRsZUxpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpO1xyXG59XHJcblxyXG5cclxuY2xhc3Mgc2NhbGVDb250cm9sbGVyIHtcclxuICBzdGF0aWMgaW5pdCgpIHtcclxuICAgIHRoaXMuYnV0dG9ucyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidG4nKV07XHJcbiAgICB0aGlzLmNhdGVnb3JpZXMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnknKV07XHJcbiAgICByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldENob3JkT3JTY2FsZSgpIHtcclxuICAgIGNvbnN0IHsgY2hvcmRPclNjYWxlIH0gPSBnZXRJbmZvT2ZTY2FsZVN0YXRlKCk7XHJcbiAgICByZXR1cm4gY2hvcmRPclNjYWxlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldFNjYWxlVHlwZSgpIHtcclxuICAgIGNvbnN0IHsgc2NhbGVUeXBlIH0gPSBnZXRJbmZvT2ZTY2FsZVN0YXRlKCk7XHJcbiAgICByZXR1cm4gc2NhbGVUeXBlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldEZvcm1hdHRlZFNjYWxlTmFtZSgpIHtcclxuICAgIGNvbnN0IHsgY2hvcmRPclNjYWxlLCBzY2FsZVR5cGUgfSA9IGdldEluZm9PZlNjYWxlU3RhdGUoKTtcclxuICAgIGNvbnN0IGxvd2VyY2FzZU5hbWUgPSBgJHtzY2FsZVR5cGV9ICR7Y2hvcmRPclNjYWxlfWA7XHJcbiAgICBjb25zdCB0aXRsZWNhc2VOYW1lID0gdG9UaXRsZUNhc2UobG93ZXJjYXNlTmFtZSk7XHJcbiAgICByZXR1cm4gdGl0bGVjYXNlTmFtZTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNjYWxlQ29udHJvbGxlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcblxyXG5jb25zdCBzY2FsZURhdGEgPSByZXF1aXJlKCcuL2RhdGEvc2NhbGUtZGF0YScpO1xyXG5cclxuZnVuY3Rpb24gZ2V0U2NhbGVQYXR0ZXJuKHNjYWxlVHlwZSkge1xyXG4gIGNvbnN0IHBhdHRlcm4gPSBzY2FsZURhdGEucGF0dGVybnMuc2NhbGVzW3NjYWxlVHlwZV07XHJcbiAgaWYgKHBhdHRlcm4gPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xyXG4gIHJldHVybiBwYXR0ZXJuO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDaG9yZFBhdHRlcm4oc2NhbGVUeXBlKSB7XHJcbiAgY29uc3QgcGF0dGVybiA9IHNjYWxlRGF0YS5wYXR0ZXJucy5jaG9yZHNbc2NhbGVUeXBlXTtcclxuICBpZiAocGF0dGVybiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBhdHRlcm4oKSB7XHJcbiAgY29uc3QgY2hvcmRPclNjYWxlID0gU2NhbGVDb250cm9sbGVyLmdldENob3JkT3JTY2FsZSgpO1xyXG4gIGNvbnN0IHNjYWxlVHlwZSA9IFNjYWxlQ29udHJvbGxlci5nZXRTY2FsZVR5cGUoKTtcclxuICBsZXQgcGF0dGVybiA9IFtdO1xyXG4gIGlmIChjaG9yZE9yU2NhbGUgPT09ICdzY2FsZScpIHtcclxuICAgIHBhdHRlcm4gPSBnZXRTY2FsZVBhdHRlcm4oc2NhbGVUeXBlKTtcclxuICB9IGVsc2UgaWYgKGNob3JkT3JTY2FsZSA9PT0gJ2Nob3JkJykge1xyXG4gICAgcGF0dGVybiA9IGdldENob3JkUGF0dGVybihzY2FsZVR5cGUpO1xyXG4gIH1cclxuICByZXR1cm4gcGF0dGVybjtcclxufVxyXG5cclxuXHJcbmNsYXNzIHNjYWxlRGF0YWJhc2Uge1xyXG4gIHN0YXRpYyBnZXRQYXR0ZXJuT2ZTZWxlY3RlZFNjYWxlKCkge1xyXG4gICAgY29uc3Qgc2NhbGVQYXR0ZXJuID0gZ2V0UGF0dGVybigpO1xyXG4gICAgcmV0dXJuIHNjYWxlUGF0dGVybjtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2NhbGVEYXRhYmFzZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY2xhc3MgU2NhbGVEaXNwbGF5IHtcclxuICBzdGF0aWMgaW5pdCgpIHtcclxuICAgIHRoaXMuZG9tRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1kaXNwbGF5X190ZXh0LXBhbmVsJyk7XHJcbiAgICB0aGlzLmRvbUVsZW0udGV4dENvbnRlbnQgPSAnJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZXRUZXh0KHRleHQpIHtcclxuICAgIHRoaXMuZG9tRWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjYWxlRGlzcGxheTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY2xhc3MgVGltZXJNYW5hZ2VyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudGltZXJzID0gW107XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPOiBUYWtlIG9mZnNldCB0aW1lIGZyb20gc2V0dGluZ3NcclxuICBhZGRUaW1lcihjYWxsYmFjaywgb2Zmc2V0SW5kZXgpIHtcclxuICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dChjYWxsYmFjaywgMjAwICogb2Zmc2V0SW5kZXgpO1xyXG4gICAgdGhpcy50aW1lcnMucHVzaCh0aW1lcik7XHJcbiAgfVxyXG5cclxuICBjbGVhckFsbFRpbWVycygpIHtcclxuICAgIHRoaXMudGltZXJzLmZvckVhY2goKHRpbWVyKSA9PiB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICB9KTtcclxuICAgIHRoaXMudGltZXJzID0gW107XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyTWFuYWdlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFxyXG4gKiBAcGFyYW0ge251bWJlcn0gZW5kIFRoaXMgbnVtYmVyIGlzIGluY2x1ZGVkXHJcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuICovXHJcbmZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQpIHtcclxuICByZXR1cm4gWy4uLkFycmF5KGVuZCAtIHN0YXJ0ICsgMSkuZmlsbCgpLm1hcCgoXywgaSkgPT4gaSArIDEpXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIGZpcnN0IGxldHRlciBvZiBlYWNoIHdvcmQgaW4gYSBzdHJpbmcgdG8gdXBwZXJjYXNlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICovXHJcbmZ1bmN0aW9uIHRvVGl0bGVDYXNlKHN0cikge1xyXG4gIGNvbnN0IHN0ckluVGl0bGVDYXNlID0gc3RyLnNwbGl0KCcgJykubWFwKCh3b3JkKSA9PiB7XHJcbiAgICByZXR1cm4gd29yZFswXS50b1VwcGVyQ2FzZSgpICsgd29yZC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcclxuICB9KS5qb2luKCcgJyk7XHJcbiAgcmV0dXJuIHN0ckluVGl0bGVDYXNlO1xyXG59XHJcblxyXG4vKipcclxuICogUnVucyBhIGNhbGxiYWNrIGZvciBlYWNoIGl0ZW0gb2YgaXRlbXMsIGl0ZXJhdGluZyB1c2luZyBpbmNyZW1lbnRzIGZyb20gdGhlIHBhdHRlcm5BcnJheVxyXG4gKiBAcGFyYW0ge0FycmF5fSBwYXR0ZXJuQXJyYXlcclxuICogQHBhcmFtIHtBcnJheX0gaXRlbXNcclxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IEFwcGxpZXMgY2FsbGJhY2sgc3RhcnRpbmcgZnJvbSBpbmRleCArIHRoZSBmaXJzdCBpbmNyZW1lbnQgb2YgdGhlIHBhdHRlcm5cclxuICogQHBhcmFtIHtUaW1lck1hbmFnZXJ9IHRpbWVyTWFuYWdlciBPcHRpb25hbCBtYW5hZ2VyIGZvciB0aW1lb3V0cyBiZXR3ZWVuIGVhY2ggY2FsbGJhY2tcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZmlyc3RJdGVtQ2FsbGJhY2tcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tGb3JFYWNoSXRlbVxyXG4gKi9cclxuZnVuY3Rpb24gdXNlUGF0dGVybihwYXR0ZXJuQXJyYXkpIHtcclxuICByZXR1cm4ge1xyXG4gICAgZm9ySXRlbXMoaXRlbXMpIHtcclxuICAgICAgdGhpcy5pdGVtcyA9IGl0ZW1zO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBmcm9tSW5kZXgoaW5kZXgpIHtcclxuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICB3aXRoVGltZXIodGltZXJNYW5hZ2VyKSB7XHJcbiAgICAgIHRoaXMudGltZXJNYW5hZ2VyID0gdGltZXJNYW5hZ2VyO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBydW5Gb3JGaXJzdEl0ZW0oZmlyc3RJdGVtQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5maXJzdEl0ZW1DYWxsYmFjayA9IGZpcnN0SXRlbUNhbGxiYWNrO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBydW4oY2FsbGJhY2tGb3JFYWNoSXRlbSkge1xyXG4gICAgICBpZiAodGhpcy5maXJzdEl0ZW1DYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3QgZmlyc3RJdGVtID0gdGhpcy5pdGVtc1t0aGlzLmluZGV4XTtcclxuICAgICAgICB0aGlzLmZpcnN0SXRlbUNhbGxiYWNrKGZpcnN0SXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG4gICAgICBwYXR0ZXJuQXJyYXkuZm9yRWFjaCgoaW5jcmVtZW50LCBpZHgpID0+IHtcclxuICAgICAgICB0aGlzLmluZGV4ICs9IGluY3JlbWVudDtcclxuICAgICAgICBvZmZzZXQgKz0gaW5jcmVtZW50O1xyXG4gICAgICAgIGNvbnN0IGNsb3N1cmVPZmZzZXQgPSBvZmZzZXQ7XHJcblxyXG4gICAgICAgIGNvbnN0IG5leHRJdGVtID0gdGhpcy5pdGVtc1t0aGlzLmluZGV4XTtcclxuICAgICAgICBpZiAobmV4dEl0ZW0gPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50aW1lck1hbmFnZXIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgY2FsbGJhY2tGb3JFYWNoSXRlbShuZXh0SXRlbSwgb2Zmc2V0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy50aW1lck1hbmFnZXIuYWRkVGltZXIoKCkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFja0ZvckVhY2hJdGVtKG5leHRJdGVtLCBjbG9zdXJlT2Zmc2V0KTtcclxuICAgICAgICAgIH0sIGlkeCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0geyByYW5nZSwgdG9UaXRsZUNhc2UsIHVzZVBhdHRlcm4gfTtcclxuIl19
