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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzLmpzIiwiYXBwL3NyYy9kYXRhL2tleS1uYW1lLXNldHMuanMiLCJhcHAvc3JjL2RhdGEva2V5LW5hbWUtdG8taWQtZW51bS5qcyIsImFwcC9zcmMvZGF0YS9vZmZzZXQtdG8tZGVncmVlLXNldHMuanMiLCJhcHAvc3JjL2RhdGEvcGlhbm8ta2V5LWJhc2UtaWRzLmpzIiwiYXBwL3NyYy9kYXRhL3NjYWxlLWRhdGEuanMiLCJhcHAvc3JjL2RlZ3JlZS1kaXNwbGF5LmpzIiwiYXBwL3NyYy9kZWdyZWUtdGlsZS5qcyIsImFwcC9zcmMvaW5kZXguanMiLCJhcHAvc3JjL2tleS1uYW1lLmpzIiwiYXBwL3NyYy9rZXlib2FyZC5qcyIsImFwcC9zcmMvbmFtZS1zYW5pdGl6ZXIuanMiLCJhcHAvc3JjL3BpYW5vLWF1ZGlvLWNvbnRyb2xsZXIuanMiLCJhcHAvc3JjL3BpYW5vLWtleS5qcyIsImFwcC9zcmMvc2NhbGUtY29udHJvbGxlci5qcyIsImFwcC9zcmMvc2NhbGUtZGF0YWJhc2UuanMiLCJhcHAvc3JjL3NjYWxlLWRpc3BsYXkuanMiLCJhcHAvc3JjL3RpbWVyLW1hbmFnZXIuanMiLCJhcHAvc3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMgPSBbXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JyxcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2stLXJvb3QnLFxyXG4gICdwaWFuby1rZXktaGlnaGxpZ2h0LS13aGl0ZScsXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJyxcclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qga2V5TmFtZVNldHMgPSB7XHJcbiAgc3RhbmRhcmQ6IFsnQycsICdD4pmvJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdC4pmtJywgJ0InXSxcclxuICBzaGFycDogWydDJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG4gIGZsYXQ6IFsnQycsICdE4pmtJywgJ0QnLCAnReKZrScsICdFJywgJ0YnLCAnR+KZrScsICdHJywgJ0Hima0nLCAnQScsICdC4pmtJywgJ0InXSxcclxuICBmaXhlZERvU2hhcnA6IFsnRG8nLCAnRGknLCAnUmUnLCAnUmknLCAnTWknLCAnRmEnLCAnRmknLCAnU28nLCAnU2knLCAnTGEnLCAnTGknLCAnVGknXSxcclxuICBmaXhlZERvRmxhdDogWydEbycsICdSYScsICdSZScsICdNZScsICdNaScsICdGYScsICdTZScsICdTbycsICdMZScsICdMYScsICdUZScsICdUaSddLFxyXG4gIHNwZWNpYWxGU2hhcnBNOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG4gIHNwZWNpYWxDU2hhcnBNOiBbJ0IjJywgJ0Pima8nLCAnRCcsICdE4pmvJywgJ0UnLCAnRSMnLCAnRuKZrycsICdHJywgJ0fima8nLCAnQScsICdB4pmvJywgJ0InXSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ga2V5TmFtZVNldHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGtleU5hbWVUb0lERW51bSA9IE9iamVjdC5mcmVlemUoe1xyXG4gICdDJzogMCxcclxuICAnQ+KZryc6IDEsXHJcbiAgJ0QnOiAyLFxyXG4gICdE4pmvJzogMyxcclxuICAnRSc6IDQsXHJcbiAgJ0YnOiA1LFxyXG4gICdG4pmvJzogNixcclxuICAnRyc6IDcsXHJcbiAgJ0fima8nOiA4LFxyXG4gICdBJzogOSxcclxuICAnQeKZryc6IDEwLFxyXG4gICdCJzogMTEsXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlOYW1lVG9JREVudW07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IG9mZnNldFRvRGVncmVlU2V0cyA9IHtcclxuICBzY2FsZToge1xyXG4gICAgc3RhbmRhcmQ6IFsnMScsICdiMicsICcyJywgJ2IzJywgJzMnLCAnNCcsICdiNScsICc1JywgJ2I2JywgJzYnLCAnYjcnLCAnNyddLFxyXG4gICAgbW92YWJsZURvU2hhcnA6IFsnRG8nLCAnRGknLCAnUmUnLCAnUmknLCAnTWknLCAnRmEnLCAnRmknLCAnU28nLCAnU2knLCAnTGEnLCAnTGknLCAnVGknXSxcclxuICAgIG1vdmFibGVEb0ZsYXQ6IFsnRG8nLCAnUmEnLCAnUmUnLCAnTWUnLCAnTWknLCAnRmEnLCAnU2UnLCAnU28nLCAnTGUnLCAnTGEnLCAnVGUnLCAnVGknXSxcclxuICB9LFxyXG4gIGNob3JkOiB7XHJcbiAgICBzdGFuZGFyZDogWycxJywgJ2IyJywgJzInLCAnYjMnLCAnMycsICc0JywgJ2I1JywgJzUnLCAnYjYnLCAnNicsICdiNycsICc3JywgJzEnLCAnYjknLCAnOScsICdzOScsICczJywgJ2IxMScsICcxMSddLFxyXG4gIH0sXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG9mZnNldFRvRGVncmVlU2V0cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgcGlhbm9LZXlCYXNlSURzID0gW1xyXG4gICdjJyxcclxuICAnYy1zaGFycCcsXHJcbiAgJ2QnLFxyXG4gICdkLXNoYXJwJyxcclxuICAnZScsXHJcbiAgJ2YnLFxyXG4gICdmLXNoYXJwJyxcclxuICAnZycsXHJcbiAgJ2ctc2hhcnAnLFxyXG4gICdhJyxcclxuICAnYS1zaGFycCcsXHJcbiAgJ2InLFxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwaWFub0tleUJhc2VJRHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGRhdGEgPSB7XHJcbiAgcGF0dGVybnM6IHtcclxuICAgIHNjYWxlczoge1xyXG4gICAgICAnbWFqb3InOiBbMiwgMiwgMSwgMiwgMiwgMl0sXHJcbiAgICAgICdtaW5vcic6IFsyLCAxLCAyLCAyLCAxLCAyXSxcclxuICAgICAgJ2hhcm1vbmljIG1pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDNdLFxyXG4gICAgICAnbWVsb2RpYyBtaW5vcic6IFsyLCAxLCAyLCAyLCAyLCAyXSxcclxuXHJcbiAgICB9LFxyXG4gICAgY2hvcmRzOiB7XHJcbiAgICAgICdtYWpvcic6IFs0LCAzXSxcclxuICAgICAgJ21pbm9yJzogWzMsIDRdLFxyXG4gICAgICAnZGltaW5pc2hlZCc6IFszLCAzXSxcclxuICAgICAgJ2F1Z21lbnRlZCc6IFs0LCA0XSxcclxuICAgICAgJ3N1c3BlbmRlZCAyJzogWzIsIDVdLFxyXG4gICAgICAnc3VzcGVuZGVkIDQnOiBbNSwgMl0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGE7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IERlZ3JlZVRpbGUgPSByZXF1aXJlKCcuL2RlZ3JlZS10aWxlJyk7XHJcbmNvbnN0IFNjYWxlRGF0YWJhc2UgPSByZXF1aXJlKCcuL3NjYWxlLWRhdGFiYXNlJyk7XHJcbmNvbnN0IFRpbWVyTWFuYWdlciA9IHJlcXVpcmUoJy4vdGltZXItbWFuYWdlcicpO1xyXG5cclxuY29uc3QgcGlhbm9LZXlCYXNlSURzID0gcmVxdWlyZSgnLi9kYXRhL3BpYW5vLWtleS1iYXNlLWlkcycpO1xyXG5jb25zdCB7IHJhbmdlLCB1c2VQYXR0ZXJuIH0gPSByZXF1aXJlKCcuL3V0aWwnKTtcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlRGVncmVlRGlzcGxheVRpbGVEb21JRHMoKSB7XHJcbiAgY29uc3QgdGlsZU5hbWVzID0gW107XHJcbiAgY29uc3QgTlVNX09GX09DVEFWRVMgPSAzO1xyXG4gIHJhbmdlKDEsIE5VTV9PRl9PQ1RBVkVTKS5mb3JFYWNoKChvY3RhdmUpID0+IHtcclxuICAgIHBpYW5vS2V5QmFzZUlEcy5mb3JFYWNoKChiYXNlSUQpID0+IHtcclxuICAgICAgY29uc3QgdGlsZU5hbWUgPSBgZGVncmVlLSR7YmFzZUlEfSR7b2N0YXZlfWA7XHJcbiAgICAgIHRpbGVOYW1lcy5wdXNoKHRpbGVOYW1lKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiB0aWxlTmFtZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERlZ3JlZVRpbGVzVXNpbmdEb21JRHModGlsZU5hbWVJRHMgPSBbXSkge1xyXG4gIGNvbnN0IGRlZ3JlZVRpbGVOb2RlcyA9IFtdO1xyXG4gIHRpbGVOYW1lSURzLmZvckVhY2goKGlkLCB0aWxlSW5kZXgpID0+IHtcclxuICAgIGNvbnN0IGRlZ3JlZVRpbGUgPSBuZXcgRGVncmVlVGlsZShpZCwgdGlsZUluZGV4KTtcclxuICAgIGRlZ3JlZVRpbGVOb2Rlcy5wdXNoKGRlZ3JlZVRpbGUpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBkZWdyZWVUaWxlTm9kZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERlZ3JlZVRpbGVzKCkge1xyXG4gIGNvbnN0IHRpbGVOYW1lSURzID0gZ2VuZXJhdGVEZWdyZWVEaXNwbGF5VGlsZURvbUlEcygpO1xyXG4gIGNvbnN0IGRlZ3JlZVRpbGVzID0gZ2V0RGVncmVlVGlsZXNVc2luZ0RvbUlEcyh0aWxlTmFtZUlEcyk7XHJcbiAgcmV0dXJuIGRlZ3JlZVRpbGVzO1xyXG59XHJcblxyXG5cclxuY2xhc3MgRGVncmVlRGlzcGxheSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmRlZ3JlZVRpbGVzID0gZ2V0RGVncmVlVGlsZXMoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyID0gbmV3IFRpbWVyTWFuYWdlcigpO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlkZGVuRm9yQWxsVGlsZXMoKSB7XHJcbiAgICB0aGlzLmRlZ3JlZVRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcclxuICAgICAgdGlsZS5lbmFibGVIaWRkZW4oKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheWVkVGlsZXNGb3JTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KSB7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSBTY2FsZURhdGFiYXNlLmdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKTtcclxuICAgIGlmIChzY2FsZVBhdHRlcm4ubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLmVuYWJsZUhpZGRlbkZvckFsbFRpbGVzKCk7XHJcbiAgICB0aGlzLnJlc2V0VGV4dE9uQWxsVGlsZXMoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyLmNsZWFyQWxsVGltZXJzKCk7XHJcbiAgICB1c2VQYXR0ZXJuKHNjYWxlUGF0dGVybilcclxuICAgICAgLmZvckl0ZW1zKHRoaXMuZGVncmVlVGlsZXMpXHJcbiAgICAgIC5mcm9tSW5kZXgoaW5kZXgpXHJcbiAgICAgIC53aXRoVGltZXIodGhpcy50aW1lck1hbmFnZXIpXHJcbiAgICAgIC5ydW5Gb3JGaXJzdEl0ZW0oKHRpbGUpID0+IHtcclxuICAgICAgICBjb25zdCByb290T2Zmc2V0ID0gMDtcclxuICAgICAgICB0aWxlLnNldERlZ3JlZU51bWJlcihyb290T2Zmc2V0KTtcclxuICAgICAgICB0aWxlLmRpc2FibGVIaWRkZW4oKTtcclxuICAgICAgfSlcclxuICAgICAgLnJ1bigodGlsZSwgb2Zmc2V0KSA9PiB7XHJcbiAgICAgICAgdGlsZS5zZXREZWdyZWVOdW1iZXIob2Zmc2V0KTtcclxuICAgICAgICB0aWxlLmRpc2FibGVIaWRkZW4oKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXNldFRleHRPbkFsbFRpbGVzKCkge1xyXG4gICAgdGhpcy5kZWdyZWVUaWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XHJcbiAgICAgIHRpbGUuc2V0RGVncmVlVGV4dCgnJyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVncmVlRGlzcGxheTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgU2NhbGVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9zY2FsZS1jb250cm9sbGVyJyk7XHJcblxyXG5jb25zdCBvZmZzZXRUb0RlZ3JlZVNldHMgPSByZXF1aXJlKCcuL2RhdGEvb2Zmc2V0LXRvLWRlZ3JlZS1zZXRzJyk7XHJcblxyXG5jbGFzcyBEZWdyZWVUaWxlIHtcclxuICBjb25zdHJ1Y3Rvcihkb21JRCwgaW5kZXgpIHtcclxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmRlZ3JlZS1kaXNwbGF5X19kZWdyZWUtdGV4dCcpO1xyXG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlkZGVuKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gIH1cclxuXHJcbiAgZGlzYWJsZUhpZGRlbigpIHtcclxuICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICB9XHJcblxyXG4gIHNldERlZ3JlZU51bWJlcihvZmZzZXRGcm9tUm9vdE5vdGUpIHtcclxuICAgIGNvbnN0IGNob3JkT3JTY2FsZSA9IFNjYWxlQ29udHJvbGxlci5nZXRDaG9yZE9yU2NhbGUoKTtcclxuICAgIGNvbnN0IGRlZ3JlZVR5cGUgPSAnc3RhbmRhcmQnOyAvLyBTZXR0aW5ncy5nZXREZWdyZWVUeXBlKCk7XHJcbiAgICBsZXQgZGVncmVlID0gJyc7XHJcbiAgICBpZiAoY2hvcmRPclNjYWxlID09PSAnc2NhbGUnKSB7XHJcbiAgICAgIGNvbnN0IHNjYWxlU2V0ID0gb2Zmc2V0VG9EZWdyZWVTZXRzLnNjYWxlW2RlZ3JlZVR5cGVdO1xyXG4gICAgICBpZiAoc2NhbGVTZXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICBkZWdyZWUgPSBzY2FsZVNldFtvZmZzZXRGcm9tUm9vdE5vdGVdO1xyXG4gICAgfSBlbHNlIGlmIChjaG9yZE9yU2NhbGUgPT09ICdjaG9yZCcpIHtcclxuICAgICAgY29uc3QgY2hvcmRTZXQgPSBvZmZzZXRUb0RlZ3JlZVNldHMuY2hvcmRbZGVncmVlVHlwZV07XHJcbiAgICAgIGlmIChjaG9yZFNldCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgIGRlZ3JlZSA9IGNob3JkU2V0W29mZnNldEZyb21Sb290Tm90ZV07XHJcbiAgICB9XHJcbiAgICB0aGlzLnNldERlZ3JlZVRleHQoZGVncmVlKTtcclxuICB9XHJcblxyXG4gIHNldERlZ3JlZVRleHQodGV4dCkge1xyXG4gICAgdGhpcy5kb21UZXh0Tm9kZS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlZ3JlZVRpbGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IEtleWJvYXJkID0gcmVxdWlyZSgnLi9rZXlib2FyZCcpO1xyXG5jb25zdCBEZWdyZWVEaXNwbGF5ID0gcmVxdWlyZSgnLi9kZWdyZWUtZGlzcGxheScpO1xyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuY29uc3QgU2NhbGVEaXNwbGF5ID0gcmVxdWlyZSgnLi9zY2FsZS1kaXNwbGF5Jyk7XHJcbmNvbnN0IFBpYW5vQXVkaW9Db250cm9sbGVyID0gcmVxdWlyZSgnLi9waWFuby1hdWRpby1jb250cm9sbGVyJyk7XHJcblxyXG5TY2FsZUNvbnRyb2xsZXIuaW5pdCgpO1xyXG5TY2FsZURpc3BsYXkuaW5pdCgpO1xyXG5QaWFub0F1ZGlvQ29udHJvbGxlci5pbml0KCk7XHJcblxyXG5jb25zdCBtYWluS2V5Ym9hcmQgPSBuZXcgS2V5Ym9hcmQoKTtcclxubWFpbktleWJvYXJkLnNldERpc3BsYXlOYW1lRm9yQWxsS2V5c09mVHlwZSgnc3RhbmRhcmQnKTtcclxuXHJcbmNvbnN0IGRlZ3JlZURpc3BsYXkgPSBuZXcgRGVncmVlRGlzcGxheSgpO1xyXG5kZWdyZWVEaXNwbGF5LmVuYWJsZUhpZGRlbkZvckFsbFRpbGVzKCk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGtleU5hbWVTZXRzID0gcmVxdWlyZSgnLi9kYXRhL2tleS1uYW1lLXNldHMnKTtcclxuY29uc3Qga2V5TmFtZVRvSURFbnVtID0gcmVxdWlyZSgnLi9kYXRhL2tleS1uYW1lLXRvLWlkLWVudW0nKTtcclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZUtleUlEKGJhc2VOYW1lKSB7XHJcbiAgY29uc3QgaWQgPSBrZXlOYW1lVG9JREVudW1bYmFzZU5hbWVdO1xyXG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gLTE7XHJcbiAgcmV0dXJuIGlkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRLZXlOYW1lU2V0KHR5cGUpIHtcclxuICBjb25zdCBrZXlOYW1lU2V0ID0ga2V5TmFtZVNldHNbdHlwZV07XHJcbiAgaWYgKGtleU5hbWVTZXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gIHJldHVybiBrZXlOYW1lU2V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbGlhc09mU3BlY2lmaWNUeXBlKGtleU5hbWVTZXQsIGtleUlEKSB7XHJcbiAgY29uc3QgYWxpYXNPZlNwZWNpZmljVHlwZSA9IGtleU5hbWVTZXRba2V5SURdO1xyXG4gIGlmIChhbGlhc09mU3BlY2lmaWNUeXBlID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuICByZXR1cm4gYWxpYXNPZlNwZWNpZmljVHlwZTtcclxufVxyXG5cclxuXHJcbmNsYXNzIEtleU5hbWUge1xyXG4gIGNvbnN0cnVjdG9yKGJhc2VOYW1lKSB7XHJcbiAgICB0aGlzLmlkID0gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxpYXNPZlR5cGUodHlwZSkge1xyXG4gICAgY29uc3Qga2V5TmFtZVNldCA9IGdldEtleU5hbWVTZXQodHlwZSk7XHJcbiAgICBjb25zdCBhbGlhc09mU3BlY2lmaWNUeXBlID0gZ2V0QWxpYXNPZlNwZWNpZmljVHlwZShrZXlOYW1lU2V0LCB0aGlzLmlkKTtcclxuICAgIHJldHVybiBhbGlhc09mU3BlY2lmaWNUeXBlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlOYW1lO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBQaWFub0tleSA9IHJlcXVpcmUoJy4vcGlhbm8ta2V5Jyk7XHJcbmNvbnN0IFNjYWxlRGF0YWJhc2UgPSByZXF1aXJlKCcuL3NjYWxlLWRhdGFiYXNlJyk7XHJcbmNvbnN0IFRpbWVyTWFuYWdlciA9IHJlcXVpcmUoJy4vdGltZXItbWFuYWdlcicpO1xyXG5jb25zdCBEZWdyZWVEaXNwbGF5ID0gcmVxdWlyZSgnLi9kZWdyZWUtZGlzcGxheScpO1xyXG5cclxuY29uc3QgeyByYW5nZSwgdXNlUGF0dGVybiB9ID0gcmVxdWlyZSgnLi91dGlsJyk7XHJcbmNvbnN0IHBpYW5vS2V5QmFzZUlEcyA9IHJlcXVpcmUoJy4vZGF0YS9waWFuby1rZXktYmFzZS1pZHMnKTtcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlS2V5TmFtZURvbUlEcygpIHtcclxuICBjb25zdCBrZXlOYW1lc1dpdGhPY3RhdmVzID0gW107XHJcbiAgY29uc3QgTlVNX09GX09DVEFWRVMgPSAzO1xyXG4gIHJhbmdlKDEsIE5VTV9PRl9PQ1RBVkVTKS5mb3JFYWNoKChvY3RhdmUpID0+IHtcclxuICAgIHBpYW5vS2V5QmFzZUlEcy5mb3JFYWNoKChiYXNlSUQpID0+IHtcclxuICAgICAgY29uc3QgbmFtZVdpdGhPY3RhdmUgPSBiYXNlSUQgKyBvY3RhdmU7XHJcbiAgICAgIGtleU5hbWVzV2l0aE9jdGF2ZXMucHVzaChuYW1lV2l0aE9jdGF2ZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4ga2V5TmFtZXNXaXRoT2N0YXZlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlzVXNpbmdEb21JRHMoa2V5TmFtZUlEcyA9IFtdKSB7XHJcbiAgY29uc3QgcGlhbm9LZXlOb2RlcyA9IFtdO1xyXG4gIGtleU5hbWVJRHMuZm9yRWFjaCgoaWQsIGtleUluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBwaWFub0tleSA9IG5ldyBQaWFub0tleShpZCwga2V5SW5kZXgpO1xyXG4gICAgcGlhbm9LZXlOb2Rlcy5wdXNoKHBpYW5vS2V5KTtcclxuICB9KTtcclxuICByZXR1cm4gcGlhbm9LZXlOb2RlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGlhbm9LZXlzKCkge1xyXG4gIGNvbnN0IGtleU5hbWVJRHMgPSBnZW5lcmF0ZUtleU5hbWVEb21JRHMoKTtcclxuICBjb25zdCBwaWFub0tleXMgPSBnZXRQaWFub0tleXNVc2luZ0RvbUlEcyhrZXlOYW1lSURzKTtcclxuICByZXR1cm4gcGlhbm9LZXlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKGtleWJvYXJkKSB7XHJcbiAga2V5Ym9hcmQuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZXZlbnRTb3VyY2UgPSBrZXlib2FyZC5rZXlzLmZpbmQoaXRlbSA9PiBpdGVtLmdldERvbU5vZGUoKSA9PT0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5rZXlib2FyZF9fa2V5JykpO1xyXG4gICAgaWYgKGV2ZW50U291cmNlID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgIGNvbnN0IGluZGV4ID0gZXZlbnRTb3VyY2UuZ2V0S2V5SW5kZXgoKTtcclxuICAgIGtleWJvYXJkLmVuYWJsZUhpZ2hsaWdodGluZ0ZvclNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpO1xyXG4gICAga2V5Ym9hcmQuZGVncmVlRGlzcGxheS5zZXREaXNwbGF5ZWRUaWxlc0ZvclNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuY2xhc3MgS2V5Ym9hcmQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmtleWJvYXJkJyk7XHJcbiAgICB0aGlzLmtleXMgPSBnZXRQaWFub0tleXMoKTtcclxuICAgIHRoaXMuZGVncmVlRGlzcGxheSA9IG5ldyBEZWdyZWVEaXNwbGF5KCk7XHJcbiAgICB0aGlzLnRpbWVyTWFuYWdlciA9IG5ldyBUaW1lck1hbmFnZXIoKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlnaGxpZ2h0aW5nRm9yQWxsS2V5cygpIHtcclxuICAgIHRoaXMua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAga2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlnaGxpZ2h0aW5nRm9yU2NhbGVTdGFydGluZ0Zyb21JbmRleChpbmRleCkge1xyXG4gICAgY29uc3Qgc2NhbGVQYXR0ZXJuID0gU2NhbGVEYXRhYmFzZS5nZXRQYXR0ZXJuT2ZTZWxlY3RlZFNjYWxlKCk7XHJcbiAgICBpZiAoc2NhbGVQYXR0ZXJuLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgdGhpcy50aW1lck1hbmFnZXIuY2xlYXJBbGxUaW1lcnMoKTtcclxuICAgIHRoaXMuZGlzYWJsZUhpZ2hsaWdodGluZ0ZvckFsbEtleXMoKTtcclxuICAgIHVzZVBhdHRlcm4oc2NhbGVQYXR0ZXJuKVxyXG4gICAgICAuZm9ySXRlbXModGhpcy5rZXlzKVxyXG4gICAgICAuZnJvbUluZGV4KGluZGV4KVxyXG4gICAgICAud2l0aFRpbWVyKHRoaXMudGltZXJNYW5hZ2VyKVxyXG4gICAgICAucnVuRm9yRmlyc3RJdGVtKChyb290S2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNSb290S2V5ID0gdHJ1ZTtcclxuICAgICAgICByb290S2V5LmVuYWJsZUhpZ2hsaWdodGluZyhpc1Jvb3RLZXkpO1xyXG4gICAgICB9KVxyXG4gICAgICAucnVuKChrZXkpID0+IHtcclxuICAgICAgICBrZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgICAga2V5LnBsYXlBdWRpbygpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldERpc3BsYXlOYW1lRm9yQWxsS2V5c09mVHlwZSh0eXBlKSB7XHJcbiAgICB0aGlzLmtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgIGtleS5zZXREaXNwbGF5TmFtZU9mVHlwZSh0eXBlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgTmFtZVNhbml0aXplciA9IHtcclxuXHJcbiAgLyogJ2J0bi1zY2FsZS1tYWpvcicgLT4gJ3NjYWxlLW1ham9yJyAqL1xyXG4gIGNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKSB7XHJcbiAgICBpZiAoYnV0dG9uSUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gICAgY29uc3Qgc3RhdGVOYW1lID0gYnV0dG9uSUQuc3Vic3RyaW5nKDQpO1xyXG4gICAgcmV0dXJuIHN0YXRlTmFtZTtcclxuICB9LFxyXG5cclxuICAvKiAnYy1zaGFycDEnIC0+ICdj4pmvJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9LZXlOYW1lQmFzZU5hbWUocGlhbm9LZXlEb21JRCkge1xyXG4gICAgaWYgKHBpYW5vS2V5RG9tSUQgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gICAgY29uc3QgdHJpbW1lZE5hbWUgPSBwaWFub0tleURvbUlELnNsaWNlKDAsIC0xKTtcclxuICAgIGNvbnN0IGtleU5hbWVCYXNlTmFtZSA9IHRyaW1tZWROYW1lLnJlcGxhY2UoJy1zaGFycCcsICfima8nKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgcmV0dXJuIGtleU5hbWVCYXNlTmFtZTtcclxuICB9LFxyXG5cclxuICAvKiAnYy1zaGFycDEnIC0+ICcxJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9PY3RhdmVOdW1iZXIocGlhbm9LZXlEb21JRCkge1xyXG4gICAgcmV0dXJuIHBpYW5vS2V5RG9tSUQuc2xpY2UoLTEpO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJ2JsYWNrJyAqL1xyXG4gIGNvbnZlcnRQaWFub0tleURvbUlEVG9Db2xvcihwaWFub0tleURvbUlEKSB7XHJcbiAgICByZXR1cm4gKHBpYW5vS2V5RG9tSUQuaW5kZXhPZignc2hhcnAnKSAhPT0gLTEpID8gJ2JsYWNrJyA6ICd3aGl0ZSc7XHJcbiAgfSxcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVTYW5pdGl6ZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IHBpYW5vS2V5QmFzZUlEcyA9IHJlcXVpcmUoJy4vZGF0YS9waWFuby1rZXktYmFzZS1pZHMnKTtcclxuY29uc3QgeyByYW5nZSB9ID0gcmVxdWlyZSgnLi91dGlsJyk7XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZUF1ZGlvRmlsZU5hbWVzKCkge1xyXG4gIGNvbnN0IGF1ZGlvRmlsZU5hbWVzID0gW107XHJcbiAgY29uc3QgTlVNX09GX09DVEFWRVMgPSAzO1xyXG4gIHJhbmdlKDEsIE5VTV9PRl9PQ1RBVkVTKS5mb3JFYWNoKChvY3RhdmUpID0+IHtcclxuICAgIHBpYW5vS2V5QmFzZUlEcy5mb3JFYWNoKChiYXNlSUQpID0+IHtcclxuICAgICAgY29uc3QgYXVkaW9GaWxlTmFtZSA9IGAuL2F1ZGlvLyR7YmFzZUlEfSR7b2N0YXZlfS5vZ2dgO1xyXG4gICAgICBhdWRpb0ZpbGVOYW1lcy5wdXNoKGF1ZGlvRmlsZU5hbWUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGF1ZGlvRmlsZU5hbWVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVBdWRpb0VsZW1lbnRzKGZpbGVuYW1lcykge1xyXG4gIGNvbnN0IGF1ZGlvRWxlbWVudHMgPSBbXTtcclxuICBmaWxlbmFtZXMuZm9yRWFjaCgoZmlsZW5hbWUpID0+IHtcclxuICAgIGNvbnN0IGF1ZGlvRWxlbWVudCA9IG5ldyBBdWRpbyhmaWxlbmFtZSk7XHJcbiAgICBhdWRpb0VsZW1lbnRzLnB1c2goYXVkaW9FbGVtZW50KTtcclxuICB9KTtcclxuICByZXR1cm4gYXVkaW9FbGVtZW50cztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXVkaW9FbGVtZW50cygpIHtcclxuICBjb25zdCBmaWxlbmFtZXMgPSBnZW5lcmF0ZUF1ZGlvRmlsZU5hbWVzKCk7XHJcbiAgY29uc3QgYXVkaW9FbGVtZW50cyA9IGNyZWF0ZUF1ZGlvRWxlbWVudHMoZmlsZW5hbWVzKTtcclxuICByZXR1cm4gYXVkaW9FbGVtZW50cztcclxufVxyXG5cclxuXHJcbmNsYXNzIFBpYW5vQXVkaW9Db250cm9sbGVyIHtcclxuICBzdGF0aWMgaW5pdChvcHRpb25zID0ge30pIHtcclxuICAgIGNvbnN0IHsgdm9sdW1lID0gMC4yIH0gPSBvcHRpb25zO1xyXG4gICAgdGhpcy5tYXN0ZXJWb2x1bWUgPSB2b2x1bWU7XHJcbiAgICB0aGlzLmF1ZGlvRWxlbWVudHMgPSBnZXRBdWRpb0VsZW1lbnRzKCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2V0TWFzdGVyVm9sdW1lKHZvbHVtZSA9IHRoaXMubWFzdGVyVm9sdW1lKSB7XHJcbiAgICBpZiAodm9sdW1lIDwgMCB8fCB2b2x1bWUgPiAxLjApIHJldHVybjtcclxuICAgIHRoaXMubWFzdGVyVm9sdW1lID0gdm9sdW1lO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHBsYXlLZXlBdEluZGV4KGluZGV4KSB7XHJcbiAgICBjb25zdCBhdWRpb0VsZW1lbnQgPSB0aGlzLmF1ZGlvRWxlbWVudHNbaW5kZXhdO1xyXG4gICAgaWYgKGF1ZGlvRWxlbWVudCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICBjb25zdCBhdWRpb0Nsb25lID0gYXVkaW9FbGVtZW50LmNsb25lTm9kZSgpO1xyXG4gICAgYXVkaW9DbG9uZS52b2x1bWUgPSB0aGlzLm1hc3RlclZvbHVtZTtcclxuICAgIGF1ZGlvQ2xvbmUucGxheSgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQaWFub0F1ZGlvQ29udHJvbGxlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgS2V5TmFtZSA9IHJlcXVpcmUoJy4va2V5LW5hbWUnKTtcclxuY29uc3QgTmFtZVNhbml0aXplciA9IHJlcXVpcmUoJy4vbmFtZS1zYW5pdGl6ZXInKTtcclxuY29uc3QgUGlhbm9BdWRpb0NvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3BpYW5vLWF1ZGlvLWNvbnRyb2xsZXInKTtcclxuXHJcbmNvbnN0IGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMgPSByZXF1aXJlKCcuL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzJyk7XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVDb2xvcihkb21JRCkge1xyXG4gIHJldHVybiBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9Db2xvcihkb21JRCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZU5hbWVzKGRvbUlEKSB7XHJcbiAgY29uc3Qga2V5TmFtZUJhc2VOYW1lID0gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvS2V5TmFtZUJhc2VOYW1lKGRvbUlEKTtcclxuICBjb25zdCBrZXlOYW1lID0gbmV3IEtleU5hbWUoa2V5TmFtZUJhc2VOYW1lKTtcclxuICByZXR1cm4ga2V5TmFtZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lT2N0YXZlKGRvbUlEKSB7XHJcbiAgcmV0dXJuIE5hbWVTYW5pdGl6ZXIuY29udmVydFBpYW5vS2V5RG9tSURUb09jdGF2ZU51bWJlcihkb21JRCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZE1vdXNlTGlzdGVuZXIocGlhbm9LZXkpIHtcclxuICBwaWFub0tleS5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHsxXHJcbiAgICBwaWFub0tleS5wbGF5QXVkaW8oKTtcclxuICAgIGlmIChwaWFub0tleS5pc0hpZ2hsaWdodGVkKCkpIHJldHVybjtcclxuICAgIHBpYW5vS2V5LmVuYWJsZUhpZ2hsaWdodGluZyh0cnVlKTtcclxuICAgIGZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcclxuICAgICAgcGlhbm9LZXkuZGlzYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgICBzZXRUaW1lb3V0KGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApLCAwKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUb3VjaExpc3RlbmVyKHBpYW5vS2V5KSB7XHJcbiAgcGlhbm9LZXkuZG9tTm9kZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKCkgPT4ge1xyXG4gICAgcGlhbm9LZXkucGxheUF1ZGlvKCk7XHJcbiAgICBpZiAocGlhbm9LZXkuaXNIaWdobGlnaHRlZCgpKSByZXR1cm47XHJcbiAgICBwaWFub0tleS5lbmFibGVIaWdobGlnaHRpbmcodHJ1ZSk7XHJcbiAgICBmdW5jdGlvbiBvblRvdWNoRW5kKCkge1xyXG4gICAgICBwaWFub0tleS5kaXNhYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKSwgMCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKHBpYW5vS2V5KSB7XHJcbiAgYWRkTW91c2VMaXN0ZW5lcihwaWFub0tleSk7XHJcbiAgYWRkVG91Y2hMaXN0ZW5lcihwaWFub0tleSk7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBQaWFub0tleSB7XHJcbiAgY29uc3RydWN0b3IoZG9tSUQsIGtleUluZGV4KSB7XHJcbiAgICB0aGlzLmluZGV4ID0ga2V5SW5kZXg7XHJcbiAgICB0aGlzLm5hbWVzID0gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpO1xyXG4gICAgdGhpcy5jb2xvciA9IGRldGVybWluZUNvbG9yKGRvbUlEKTtcclxuICAgIHRoaXMub2N0YXZlID0gZGV0ZXJtaW5lT2N0YXZlKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlEKTtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlID0gdGhpcy5kb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoJy5rZXlib2FyZF9fa2V5LW5hbWUnKTtcclxuICAgIHRoaXMuZG9tRmluZ2VyaW5nVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19maW5nZXJpbmcnKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBpc0hpZ2hsaWdodGVkKCkge1xyXG4gICAgbGV0IGlzSGlnaGxpZ2h0ZWQgPSBmYWxzZTtcclxuICAgIGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcclxuICAgICAgICBpc0hpZ2hsaWdodGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gaXNIaWdobGlnaHRlZDtcclxuICB9XHJcblxyXG4gIGVuYWJsZUhpZ2hsaWdodGluZyhpc1Jvb3RLZXkgPSBmYWxzZSkge1xyXG4gICAgbGV0IGhpZ2hsaWdodENsYXNzTmFtZSA9ICcnO1xyXG4gICAgaWYgKGlzUm9vdEtleSkge1xyXG4gICAgICBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlLS1yb290JyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjay0tcm9vdCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoaWdobGlnaHRDbGFzc05hbWUgPSB0aGlzLmNvbG9yID09PSAnd2hpdGUnID8gJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyA6ICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjayc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmFkZChoaWdobGlnaHRDbGFzc05hbWUpO1xyXG4gIH1cclxuXHJcbiAgZGlzYWJsZUhpZ2hsaWdodGluZygpIHtcclxuICAgIGhpZ2hsaWdodGluZ0NsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XHJcbiAgICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldEN1c3RvbURpc3BsYXlOYW1lKG5hbWUpIHtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gbmFtZTtcclxuICB9XHJcblxyXG4gIHNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpIHtcclxuICAgIGNvbnN0IGFsaWFzID0gdGhpcy5uYW1lcy5nZXRBbGlhc09mVHlwZSh0eXBlKTtcclxuICAgIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50ID0gYWxpYXM7XHJcbiAgfVxyXG5cclxuICBwbGF5QXVkaW8oKSB7XHJcbiAgICBQaWFub0F1ZGlvQ29udHJvbGxlci5wbGF5S2V5QXRJbmRleCh0aGlzLmluZGV4KTtcclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnROYW1lKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZG9tTmFtZVRleHROb2RlLnRleHRDb250ZW50O1xyXG4gIH1cclxuXHJcbiAgZ2V0S2V5SW5kZXgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbmRleDtcclxuICB9XHJcblxyXG4gIGdldERvbU5vZGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kb21Ob2RlO1xyXG4gIH1cclxuXHJcbiAgcmVzZXREaXNwbGF5TmFtZSgpIHtcclxuICAgIC8vIFRPRE86IEdldCBkZWZhdWx0IHR5cGUgZnJvbSBzZXR0aW5ncyBvYmplY3RcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQaWFub0tleTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgTmFtZVNhbml0aXplciA9IHJlcXVpcmUoJy4vbmFtZS1zYW5pdGl6ZXInKTtcclxuY29uc3QgU2NhbGVEaXNwbGF5ID0gcmVxdWlyZSgnLi9zY2FsZS1kaXNwbGF5Jyk7XHJcbmNvbnN0IHsgdG9UaXRsZUNhc2UgfSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xyXG5cclxubGV0IHNjYWxlU3RhdGUgPSAnJztcclxuXHJcbmZ1bmN0aW9uIGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidXR0b25FbGVtKSB7XHJcbiAgY29uc3QgYnV0dG9uSUQgPSBidXR0b25FbGVtLmlkO1xyXG4gIGNvbnN0IHN0YXRlTmFtZSA9IE5hbWVTYW5pdGl6ZXIuY29udmVydEJ1dHRvbklEVG9TdGF0ZU5hbWUoYnV0dG9uSUQpO1xyXG4gIHJldHVybiBzdGF0ZU5hbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEhpZ2hsaWdodE9uQnV0dG9uKGJ0bikge1xyXG4gIGJ0bi5jbGFzc0xpc3QuYWRkKCdidG4tLXNlbGVjdGVkJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0SGlnaGxpZ2h0T25BbGxCdXR0b25zKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIHNjYWxlQ29udHJvbGxlci5idXR0b25zLmZvckVhY2goKGJ0bikgPT4ge1xyXG4gICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi0tc2VsZWN0ZWQnKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5mb09mU2NhbGVTdGF0ZSgpIHtcclxuICBjb25zdCBbY2hvcmRPclNjYWxlLCAuLi5zY2FsZVR5cGVUb2tlbnNdID0gc2NhbGVTdGF0ZS5zcGxpdCgnLScpO1xyXG4gIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlVHlwZVRva2Vucy5qb2luKCcgJyk7XHJcbiAgcmV0dXJuIHsgY2hvcmRPclNjYWxlLCBzY2FsZVR5cGUgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkQnV0dG9uTGlzdGVuZXJzKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIHNjYWxlQ29udHJvbGxlci5idXR0b25zLmZvckVhY2goKGJ0bikgPT4ge1xyXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBzY2FsZVN0YXRlID0gZ2V0U3RhdGVOYW1lRnJvbUJ1dHRvbklEKGJ0bik7XHJcbiAgICAgIHJlc2V0SGlnaGxpZ2h0T25BbGxCdXR0b25zKHNjYWxlQ29udHJvbGxlcik7XHJcbiAgICAgIGFkZEhpZ2hsaWdodE9uQnV0dG9uKGJ0bik7XHJcbiAgICAgIGNvbnN0IGZvcm1hdHRlZFNjYWxlTmFtZSA9IHNjYWxlQ29udHJvbGxlci5nZXRGb3JtYXR0ZWRTY2FsZU5hbWUoKTtcclxuICAgICAgU2NhbGVEaXNwbGF5LnNldFRleHQoZm9ybWF0dGVkU2NhbGVOYW1lKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGREcm9wZG93blRpdGxlTGlzdGVuZXJzKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIHNjYWxlQ29udHJvbGxlci5jYXRlZ29yaWVzLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XHJcbiAgICBjb25zdCBjYXRlZ29yeVRpdGxlID0gY2F0ZWdvcnkucXVlcnlTZWxlY3RvcignLnNjYWxlLWxpc3RfX2NhdGVnb3J5LXRpdGxlJyk7XHJcbiAgICBjb25zdCBkcm9wZG93bkxpc3QgPSBjYXRlZ29yeS5xdWVyeVNlbGVjdG9yKCcuc2NhbGUtbGlzdF9fY2F0ZWdvcnktbGlzdCcpO1xyXG4gICAgY29uc3QgZHJvcGRvd25BcnJvdyA9IGNhdGVnb3J5LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1hcnJvdycpO1xyXG4gICAgY2F0ZWdvcnlUaXRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgY2F0ZWdvcnlUaXRsZS5jbGFzc0xpc3QudG9nZ2xlKCdzY2FsZS1saXN0X19jYXRlZ29yeS10aXRsZS0tYWN0aXZlJyk7XHJcbiAgICAgIGRyb3Bkb3duTGlzdC5jbGFzc0xpc3QudG9nZ2xlKCdzY2FsZS1saXN0X19jYXRlZ29yeS1saXN0LS1oaWRkZW4nKTtcclxuICAgICAgZHJvcGRvd25BcnJvdy5jbGFzc0xpc3QudG9nZ2xlKCdkcm9wZG93bi1hcnJvdy0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBhZGRCdXR0b25MaXN0ZW5lcnMoc2NhbGVDb250cm9sbGVyKTtcclxuICBhZGREcm9wZG93blRpdGxlTGlzdGVuZXJzKHNjYWxlQ29udHJvbGxlcik7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBzY2FsZUNvbnRyb2xsZXIge1xyXG4gIHN0YXRpYyBpbml0KCkge1xyXG4gICAgdGhpcy5idXR0b25zID0gWy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J0bicpXTtcclxuICAgIHRoaXMuY2F0ZWdvcmllcyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzY2FsZS1saXN0X19jYXRlZ29yeScpXTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0Q2hvcmRPclNjYWxlKCkge1xyXG4gICAgY29uc3QgeyBjaG9yZE9yU2NhbGUgfSA9IGdldEluZm9PZlNjYWxlU3RhdGUoKTtcclxuICAgIHJldHVybiBjaG9yZE9yU2NhbGU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0U2NhbGVUeXBlKCkge1xyXG4gICAgY29uc3QgeyBzY2FsZVR5cGUgfSA9IGdldEluZm9PZlNjYWxlU3RhdGUoKTtcclxuICAgIHJldHVybiBzY2FsZVR5cGU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0Rm9ybWF0dGVkU2NhbGVOYW1lKCkge1xyXG4gICAgY29uc3QgeyBjaG9yZE9yU2NhbGUsIHNjYWxlVHlwZSB9ID0gZ2V0SW5mb09mU2NhbGVTdGF0ZSgpO1xyXG4gICAgY29uc3QgbG93ZXJjYXNlTmFtZSA9IGAke3NjYWxlVHlwZX0gJHtjaG9yZE9yU2NhbGV9YDtcclxuICAgIGNvbnN0IHRpdGxlY2FzZU5hbWUgPSB0b1RpdGxlQ2FzZShsb3dlcmNhc2VOYW1lKTtcclxuICAgIHJldHVybiB0aXRsZWNhc2VOYW1lO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2NhbGVDb250cm9sbGVyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuXHJcbmNvbnN0IHNjYWxlRGF0YSA9IHJlcXVpcmUoJy4vZGF0YS9zY2FsZS1kYXRhJyk7XHJcblxyXG5mdW5jdGlvbiBnZXRTY2FsZVBhdHRlcm4oc2NhbGVUeXBlKSB7XHJcbiAgY29uc3QgcGF0dGVybiA9IHNjYWxlRGF0YS5wYXR0ZXJucy5zY2FsZXNbc2NhbGVUeXBlXTtcclxuICBpZiAocGF0dGVybiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENob3JkUGF0dGVybihzY2FsZVR5cGUpIHtcclxuICBjb25zdCBwYXR0ZXJuID0gc2NhbGVEYXRhLnBhdHRlcm5zLmNob3Jkc1tzY2FsZVR5cGVdO1xyXG4gIGlmIChwYXR0ZXJuID09PSB1bmRlZmluZWQpIHJldHVybiBbXTtcclxuICByZXR1cm4gcGF0dGVybjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGF0dGVybigpIHtcclxuICBjb25zdCBjaG9yZE9yU2NhbGUgPSBTY2FsZUNvbnRyb2xsZXIuZ2V0Q2hvcmRPclNjYWxlKCk7XHJcbiAgY29uc3Qgc2NhbGVUeXBlID0gU2NhbGVDb250cm9sbGVyLmdldFNjYWxlVHlwZSgpO1xyXG4gIGxldCBwYXR0ZXJuID0gW107XHJcbiAgaWYgKGNob3JkT3JTY2FsZSA9PT0gJ3NjYWxlJykge1xyXG4gICAgcGF0dGVybiA9IGdldFNjYWxlUGF0dGVybihzY2FsZVR5cGUpO1xyXG4gIH0gZWxzZSBpZiAoY2hvcmRPclNjYWxlID09PSAnY2hvcmQnKSB7XHJcbiAgICBwYXR0ZXJuID0gZ2V0Q2hvcmRQYXR0ZXJuKHNjYWxlVHlwZSk7XHJcbiAgfVxyXG4gIHJldHVybiBwYXR0ZXJuO1xyXG59XHJcblxyXG5cclxuY2xhc3Mgc2NhbGVEYXRhYmFzZSB7XHJcbiAgc3RhdGljIGdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKSB7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSBnZXRQYXR0ZXJuKCk7XHJcbiAgICByZXR1cm4gc2NhbGVQYXR0ZXJuO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzY2FsZURhdGFiYXNlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jbGFzcyBTY2FsZURpc3BsYXkge1xyXG4gIHN0YXRpYyBpbml0KCkge1xyXG4gICAgdGhpcy5kb21FbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjYWxlLWRpc3BsYXlfX3RleHQtcGFuZWwnKTtcclxuICAgIHRoaXMuZG9tRWxlbS50ZXh0Q29udGVudCA9ICcnO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNldFRleHQodGV4dCkge1xyXG4gICAgdGhpcy5kb21FbGVtLnRleHRDb250ZW50ID0gdGV4dDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NhbGVEaXNwbGF5O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jbGFzcyBUaW1lck1hbmFnZXIge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy50aW1lcnMgPSBbXTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE86IFRha2Ugb2Zmc2V0IHRpbWUgZnJvbSBzZXR0aW5nc1xyXG4gIGFkZFRpbWVyKGNhbGxiYWNrLCBvZmZzZXRJbmRleCkge1xyXG4gICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KGNhbGxiYWNrLCAyMDAgKiBvZmZzZXRJbmRleCk7XHJcbiAgICB0aGlzLnRpbWVycy5wdXNoKHRpbWVyKTtcclxuICB9XHJcblxyXG4gIGNsZWFyQWxsVGltZXJzKCkge1xyXG4gICAgdGhpcy50aW1lcnMuZm9yRWFjaCgodGltZXIpID0+IHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy50aW1lcnMgPSBbXTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGltZXJNYW5hZ2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhpcyBudW1iZXIgaXMgaW5jbHVkZWRcclxuICogQHJldHVybnMge251bWJlcltdfVxyXG4gKi9cclxuZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCkge1xyXG4gIHJldHVybiBbLi4uQXJyYXkoZW5kIC0gc3RhcnQgKyAxKS5maWxsKCkubWFwKChfLCBpKSA9PiBpICsgMSldO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgZmlyc3QgbGV0dGVyIG9mIGVhY2ggd29yZCBpbiBhIHN0cmluZyB0byB1cHBlcmNhc2VcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKi9cclxuZnVuY3Rpb24gdG9UaXRsZUNhc2Uoc3RyKSB7XHJcbiAgY29uc3Qgc3RySW5UaXRsZUNhc2UgPSBzdHIuc3BsaXQoJyAnKS5tYXAoKHdvcmQpID0+IHtcclxuICAgIHJldHVybiB3b3JkWzBdLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xyXG4gIH0pLmpvaW4oJyAnKTtcclxuICByZXR1cm4gc3RySW5UaXRsZUNhc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSdW5zIGEgY2FsbGJhY2sgZm9yIGVhY2ggaXRlbSBvZiBpdGVtcywgaXRlcmF0aW5nIHVzaW5nIGluY3JlbWVudHMgZnJvbSB0aGUgcGF0dGVybkFycmF5XHJcbiAqIEBwYXJhbSB7QXJyYXl9IHBhdHRlcm5BcnJheVxyXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggQXBwbGllcyBjYWxsYmFjayBzdGFydGluZyBmcm9tIGluZGV4ICsgdGhlIGZpcnN0IGluY3JlbWVudCBvZiB0aGUgcGF0dGVyblxyXG4gKiBAcGFyYW0ge1RpbWVyTWFuYWdlcn0gdGltZXJNYW5hZ2VyIE9wdGlvbmFsIG1hbmFnZXIgZm9yIHRpbWVvdXRzIGJldHdlZW4gZWFjaCBjYWxsYmFja1xyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmaXJzdEl0ZW1DYWxsYmFja1xyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja0ZvckVhY2hJdGVtXHJcbiAqL1xyXG5mdW5jdGlvbiB1c2VQYXR0ZXJuKHBhdHRlcm5BcnJheSkge1xyXG4gIHJldHVybiB7XHJcbiAgICBmb3JJdGVtcyhpdGVtcykge1xyXG4gICAgICB0aGlzLml0ZW1zID0gaXRlbXM7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuICAgIGZyb21JbmRleChpbmRleCkge1xyXG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuICAgIHdpdGhUaW1lcih0aW1lck1hbmFnZXIpIHtcclxuICAgICAgdGhpcy50aW1lck1hbmFnZXIgPSB0aW1lck1hbmFnZXI7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuICAgIHJ1bkZvckZpcnN0SXRlbShmaXJzdEl0ZW1DYWxsYmFjaykge1xyXG4gICAgICB0aGlzLmZpcnN0SXRlbUNhbGxiYWNrID0gZmlyc3RJdGVtQ2FsbGJhY2s7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuICAgIHJ1bihjYWxsYmFja0ZvckVhY2hJdGVtKSB7XHJcbiAgICAgIGlmICh0aGlzLmZpcnN0SXRlbUNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBmaXJzdEl0ZW0gPSB0aGlzLml0ZW1zW3RoaXMuaW5kZXhdO1xyXG4gICAgICAgIHRoaXMuZmlyc3RJdGVtQ2FsbGJhY2soZmlyc3RJdGVtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IG9mZnNldCA9IDA7XHJcbiAgICAgIHBhdHRlcm5BcnJheS5mb3JFYWNoKChpbmNyZW1lbnQsIGlkeCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5kZXggKz0gaW5jcmVtZW50O1xyXG4gICAgICAgIG9mZnNldCArPSBpbmNyZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgY2xvc3VyZU9mZnNldCA9IG9mZnNldDtcclxuXHJcbiAgICAgICAgY29uc3QgbmV4dEl0ZW0gPSB0aGlzLml0ZW1zW3RoaXMuaW5kZXhdO1xyXG4gICAgICAgIGlmIChuZXh0SXRlbSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRpbWVyTWFuYWdlciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBjYWxsYmFja0ZvckVhY2hJdGVtKG5leHRJdGVtLCBvZmZzZXQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnRpbWVyTWFuYWdlci5hZGRUaW1lcigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrRm9yRWFjaEl0ZW0obmV4dEl0ZW0sIGNsb3N1cmVPZmZzZXQpO1xyXG4gICAgICAgICAgfSwgaWR4ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IHJhbmdlLCB0b1RpdGxlQ2FzZSwgdXNlUGF0dGVybiB9O1xyXG4iXX0=
