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

},{"./data/piano-key-base-ids":5,"./degree-tile":8,"./scale-database":16,"./timer-manager":20,"./util":21}],8:[function(require,module,exports){
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

},{"./data/piano-key-base-ids":5,"./degree-display":7,"./piano-key":14,"./scale-database":16,"./timer-manager":20,"./util":21}],12:[function(require,module,exports){
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

},{"./data/piano-key-base-ids":5,"./util":21}],14:[function(require,module,exports){
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

const ScaleDisplay = require('./scale-display');
const ScaleListCategory = require('./scale-list-category');
const ScaleListButton = require('./scale-list-button');

const { toTitleCase } = require('./util');

let scaleState = '';


function resetHighlightOnAllButtons(scaleController) {
  scaleController.buttons.forEach((btn) => {
    btn.disableHighlighting();
  });
}

function getInfoOfScaleState() {
  const [chordOrScale, ...scaleTypeTokens] = scaleState.split('-');
  const scaleType = scaleTypeTokens.join(' ');
  return { chordOrScale, scaleType };
}

function getScaleListCategories() {
  const categoryNodes = [...document.getElementsByClassName('scale-list__category')];
  const categories = [];
  categoryNodes.forEach((categoryNode) => {
    const category = new ScaleListCategory(categoryNode);
    categories.push(category);
  });
  return categories;
}

function getScaleListButtons() {
  const buttonNodes = [...document.getElementsByClassName('btn')];
  const scaleListButtons = [];
  buttonNodes.forEach((buttonNode) => {
    const scaleListButton = new ScaleListButton(buttonNode);
    scaleListButtons.push(scaleListButton);
  });
  return scaleListButtons;
}

function addButtonListeners(scaleController) {
  scaleController.buttons.forEach((btn) => {
    btn.addClickListener(() => {
      resetHighlightOnAllButtons(scaleController);
      btn.enableHighlighting();
      scaleState = btn.getStateName();
      const formattedScaleName = scaleController.getFormattedScaleName();
      ScaleDisplay.setText(formattedScaleName);
    });
  });
}

function registerEventListeners(scaleController) {
  addButtonListeners(scaleController);
}


class scaleController {
  static init() {
    this.buttons = getScaleListButtons();
    this.categories = getScaleListCategories();
    this.expandAllCategories();
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

  static expandAllCategories() {
    this.categories.forEach((category) => {
      category.expandMenu();
    });
  }

  static collapseAllCategories() {
    this.categories.forEach((category) => {
      category.collapseMenu();
    });
  }
}


module.exports = scaleController;

},{"./scale-display":17,"./scale-list-button":18,"./scale-list-category":19,"./util":21}],16:[function(require,module,exports){
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

const NameSanitizer = require('./name-sanitizer');

function getStateNameFromButtonID(buttonElem) {
  const buttonID = buttonElem.id;
  const stateName = NameSanitizer.convertButtonIDToStateName(buttonID);
  return stateName;
}

class ScaleListButton {
  constructor(buttonNode) {
    this.node = buttonNode;
    this.stateName = getStateNameFromButtonID(buttonNode);
  }

  enableHighlighting() {
    this.node.classList.add('btn--selected');
  }

  disableHighlighting() {
    this.node.classList.remove('btn--selected');
  }

  getStateName() {
    return this.stateName;
  }

  addClickListener(callback) {
    this.node.addEventListener('click', callback);
  }
}

module.exports = ScaleListButton;

},{"./name-sanitizer":12}],19:[function(require,module,exports){
'use strict';

function registerEventListeners(category) {
  category.categoryTitle.addEventListener('click', () => {
    category.toggleMenu();
  });
}

class ScaleListCategory {
  constructor(categoryNode) {
    this.categoryTitle = categoryNode.querySelector('.scale-list__category-title');
    this.dropdownList = categoryNode.querySelector('.scale-list__category-list');
    this.dropdownArrow = categoryNode.querySelector('.dropdown-arrow');
    registerEventListeners(this);
  }

  toggleMenu() {
    this.categoryTitle.classList.toggle('scale-list__category-title--active');
    this.dropdownList.classList.toggle('scale-list__category-list--hidden');
    this.dropdownArrow.classList.toggle('dropdown-arrow--active');
  }

  expandMenu() {
    this.categoryTitle.classList.add('scale-list__category-title--active');
    this.dropdownList.classList.remove('scale-list__category-list--hidden');
    this.dropdownArrow.classList.add('dropdown-arrow--active');
  }

  collapseMenu() {
    this.categoryTitle.classList.remove('scale-list__category-title--active');
    this.dropdownList.classList.add('scale-list__category-list--hidden');
    this.dropdownArrow.classList.remove('dropdown-arrow--active');
  }
}

module.exports = ScaleListCategory;

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL2RhdGEvaGlnaGxpZ2h0aW5nLWNsYXNzLW5hbWVzLmpzIiwiYXBwL3NyYy9kYXRhL2tleS1uYW1lLXNldHMuanMiLCJhcHAvc3JjL2RhdGEva2V5LW5hbWUtdG8taWQtZW51bS5qcyIsImFwcC9zcmMvZGF0YS9vZmZzZXQtdG8tZGVncmVlLXNldHMuanMiLCJhcHAvc3JjL2RhdGEvcGlhbm8ta2V5LWJhc2UtaWRzLmpzIiwiYXBwL3NyYy9kYXRhL3NjYWxlLWRhdGEuanMiLCJhcHAvc3JjL2RlZ3JlZS1kaXNwbGF5LmpzIiwiYXBwL3NyYy9kZWdyZWUtdGlsZS5qcyIsImFwcC9zcmMvaW5kZXguanMiLCJhcHAvc3JjL2tleS1uYW1lLmpzIiwiYXBwL3NyYy9rZXlib2FyZC5qcyIsImFwcC9zcmMvbmFtZS1zYW5pdGl6ZXIuanMiLCJhcHAvc3JjL3BpYW5vLWF1ZGlvLWNvbnRyb2xsZXIuanMiLCJhcHAvc3JjL3BpYW5vLWtleS5qcyIsImFwcC9zcmMvc2NhbGUtY29udHJvbGxlci5qcyIsImFwcC9zcmMvc2NhbGUtZGF0YWJhc2UuanMiLCJhcHAvc3JjL3NjYWxlLWRpc3BsYXkuanMiLCJhcHAvc3JjL3NjYWxlLWxpc3QtYnV0dG9uLmpzIiwiYXBwL3NyYy9zY2FsZS1saXN0LWNhdGVnb3J5LmpzIiwiYXBwL3NyYy90aW1lci1tYW5hZ2VyLmpzIiwiYXBwL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcyA9IFtcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUtLXJvb3QnLFxyXG4gICdwaWFuby1rZXktaGlnaGxpZ2h0LS1ibGFjay0tcm9vdCcsXHJcbiAgJ3BpYW5vLWtleS1oaWdobGlnaHQtLXdoaXRlJyxcclxuICAncGlhbm8ta2V5LWhpZ2hsaWdodC0tYmxhY2snLFxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBoaWdobGlnaHRpbmdDbGFzc05hbWVzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBrZXlOYW1lU2V0cyA9IHtcclxuICBzdGFuZGFyZDogWydDJywgJ0Pima8nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Lima0nLCAnQiddLFxyXG4gIHNoYXJwOiBbJ0MnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdGJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXHJcbiAgZmxhdDogWydDJywgJ0Tima0nLCAnRCcsICdF4pmtJywgJ0UnLCAnRicsICdH4pmtJywgJ0cnLCAnQeKZrScsICdBJywgJ0Lima0nLCAnQiddLFxyXG4gIGZpeGVkRG9TaGFycDogWydEbycsICdEaScsICdSZScsICdSaScsICdNaScsICdGYScsICdGaScsICdTbycsICdTaScsICdMYScsICdMaScsICdUaSddLFxyXG4gIGZpeGVkRG9GbGF0OiBbJ0RvJywgJ1JhJywgJ1JlJywgJ01lJywgJ01pJywgJ0ZhJywgJ1NlJywgJ1NvJywgJ0xlJywgJ0xhJywgJ1RlJywgJ1RpJ10sXHJcbiAgc3BlY2lhbEZTaGFycE06IFsnQycsICdD4pmvJywgJ0QnLCAnROKZrycsICdFJywgJ0UjJywgJ0bima8nLCAnRycsICdH4pmvJywgJ0EnLCAnQeKZrycsICdCJ10sXHJcbiAgc3BlY2lhbENTaGFycE06IFsnQiMnLCAnQ+KZrycsICdEJywgJ0Tima8nLCAnRScsICdFIycsICdG4pmvJywgJ0cnLCAnR+KZrycsICdBJywgJ0Hima8nLCAnQiddLFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBrZXlOYW1lU2V0cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qga2V5TmFtZVRvSURFbnVtID0gT2JqZWN0LmZyZWV6ZSh7XHJcbiAgJ0MnOiAwLFxyXG4gICdD4pmvJzogMSxcclxuICAnRCc6IDIsXHJcbiAgJ0Tima8nOiAzLFxyXG4gICdFJzogNCxcclxuICAnRic6IDUsXHJcbiAgJ0bima8nOiA2LFxyXG4gICdHJzogNyxcclxuICAnR+KZryc6IDgsXHJcbiAgJ0EnOiA5LFxyXG4gICdB4pmvJzogMTAsXHJcbiAgJ0InOiAxMSxcclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGtleU5hbWVUb0lERW51bTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qgb2Zmc2V0VG9EZWdyZWVTZXRzID0ge1xyXG4gIHNjYWxlOiB7XHJcbiAgICBzdGFuZGFyZDogWycxJywgJ2IyJywgJzInLCAnYjMnLCAnMycsICc0JywgJ2I1JywgJzUnLCAnYjYnLCAnNicsICdiNycsICc3J10sXHJcbiAgICBtb3ZhYmxlRG9TaGFycDogWydEbycsICdEaScsICdSZScsICdSaScsICdNaScsICdGYScsICdGaScsICdTbycsICdTaScsICdMYScsICdMaScsICdUaSddLFxyXG4gICAgbW92YWJsZURvRmxhdDogWydEbycsICdSYScsICdSZScsICdNZScsICdNaScsICdGYScsICdTZScsICdTbycsICdMZScsICdMYScsICdUZScsICdUaSddLFxyXG4gIH0sXHJcbiAgY2hvcmQ6IHtcclxuICAgIHN0YW5kYXJkOiBbJzEnLCAnYjInLCAnMicsICdiMycsICczJywgJzQnLCAnYjUnLCAnNScsICdiNicsICc2JywgJ2I3JywgJzcnLCAnMScsICdiOScsICc5JywgJ3M5JywgJzMnLCAnYjExJywgJzExJ10sXHJcbiAgfSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gb2Zmc2V0VG9EZWdyZWVTZXRzO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBwaWFub0tleUJhc2VJRHMgPSBbXHJcbiAgJ2MnLFxyXG4gICdjLXNoYXJwJyxcclxuICAnZCcsXHJcbiAgJ2Qtc2hhcnAnLFxyXG4gICdlJyxcclxuICAnZicsXHJcbiAgJ2Ytc2hhcnAnLFxyXG4gICdnJyxcclxuICAnZy1zaGFycCcsXHJcbiAgJ2EnLFxyXG4gICdhLXNoYXJwJyxcclxuICAnYicsXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBpYW5vS2V5QmFzZUlEcztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgZGF0YSA9IHtcclxuICBwYXR0ZXJuczoge1xyXG4gICAgc2NhbGVzOiB7XHJcbiAgICAgICdtYWpvcic6IFsyLCAyLCAxLCAyLCAyLCAyXSxcclxuICAgICAgJ21pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDJdLFxyXG4gICAgICAnaGFybW9uaWMgbWlub3InOiBbMiwgMSwgMiwgMiwgMSwgM10sXHJcbiAgICAgICdtZWxvZGljIG1pbm9yJzogWzIsIDEsIDIsIDIsIDIsIDJdLFxyXG5cclxuICAgIH0sXHJcbiAgICBjaG9yZHM6IHtcclxuICAgICAgJ21ham9yJzogWzQsIDNdLFxyXG4gICAgICAnbWlub3InOiBbMywgNF0sXHJcbiAgICAgICdkaW1pbmlzaGVkJzogWzMsIDNdLFxyXG4gICAgICAnYXVnbWVudGVkJzogWzQsIDRdLFxyXG4gICAgICAnc3VzcGVuZGVkIDInOiBbMiwgNV0sXHJcbiAgICAgICdzdXNwZW5kZWQgNCc6IFs1LCAyXSxcclxuICAgIH0sXHJcbiAgfSxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZGF0YTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgRGVncmVlVGlsZSA9IHJlcXVpcmUoJy4vZGVncmVlLXRpbGUnKTtcclxuY29uc3QgU2NhbGVEYXRhYmFzZSA9IHJlcXVpcmUoJy4vc2NhbGUtZGF0YWJhc2UnKTtcclxuY29uc3QgVGltZXJNYW5hZ2VyID0gcmVxdWlyZSgnLi90aW1lci1tYW5hZ2VyJyk7XHJcblxyXG5jb25zdCBwaWFub0tleUJhc2VJRHMgPSByZXF1aXJlKCcuL2RhdGEvcGlhbm8ta2V5LWJhc2UtaWRzJyk7XHJcbmNvbnN0IHsgcmFuZ2UsIHVzZVBhdHRlcm4gfSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVEZWdyZWVEaXNwbGF5VGlsZURvbUlEcygpIHtcclxuICBjb25zdCB0aWxlTmFtZXMgPSBbXTtcclxuICBjb25zdCBOVU1fT0ZfT0NUQVZFUyA9IDM7XHJcbiAgcmFuZ2UoMSwgTlVNX09GX09DVEFWRVMpLmZvckVhY2goKG9jdGF2ZSkgPT4ge1xyXG4gICAgcGlhbm9LZXlCYXNlSURzLmZvckVhY2goKGJhc2VJRCkgPT4ge1xyXG4gICAgICBjb25zdCB0aWxlTmFtZSA9IGBkZWdyZWUtJHtiYXNlSUR9JHtvY3RhdmV9YDtcclxuICAgICAgdGlsZU5hbWVzLnB1c2godGlsZU5hbWUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHRpbGVOYW1lcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGVncmVlVGlsZXNVc2luZ0RvbUlEcyh0aWxlTmFtZUlEcyA9IFtdKSB7XHJcbiAgY29uc3QgZGVncmVlVGlsZU5vZGVzID0gW107XHJcbiAgdGlsZU5hbWVJRHMuZm9yRWFjaCgoaWQsIHRpbGVJbmRleCkgPT4ge1xyXG4gICAgY29uc3QgZGVncmVlVGlsZSA9IG5ldyBEZWdyZWVUaWxlKGlkLCB0aWxlSW5kZXgpO1xyXG4gICAgZGVncmVlVGlsZU5vZGVzLnB1c2goZGVncmVlVGlsZSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGRlZ3JlZVRpbGVOb2RlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGVncmVlVGlsZXMoKSB7XHJcbiAgY29uc3QgdGlsZU5hbWVJRHMgPSBnZW5lcmF0ZURlZ3JlZURpc3BsYXlUaWxlRG9tSURzKCk7XHJcbiAgY29uc3QgZGVncmVlVGlsZXMgPSBnZXREZWdyZWVUaWxlc1VzaW5nRG9tSURzKHRpbGVOYW1lSURzKTtcclxuICByZXR1cm4gZGVncmVlVGlsZXM7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBEZWdyZWVEaXNwbGF5IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZGVncmVlVGlsZXMgPSBnZXREZWdyZWVUaWxlcygpO1xyXG4gICAgdGhpcy50aW1lck1hbmFnZXIgPSBuZXcgVGltZXJNYW5hZ2VyKCk7XHJcbiAgfVxyXG5cclxuICBlbmFibGVIaWRkZW5Gb3JBbGxUaWxlcygpIHtcclxuICAgIHRoaXMuZGVncmVlVGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xyXG4gICAgICB0aWxlLmVuYWJsZUhpZGRlbigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXREaXNwbGF5ZWRUaWxlc0ZvclNjYWxlU3RhcnRpbmdGcm9tSW5kZXgoaW5kZXgpIHtcclxuICAgIGNvbnN0IHNjYWxlUGF0dGVybiA9IFNjYWxlRGF0YWJhc2UuZ2V0UGF0dGVybk9mU2VsZWN0ZWRTY2FsZSgpO1xyXG4gICAgaWYgKHNjYWxlUGF0dGVybi5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgIHRoaXMuZW5hYmxlSGlkZGVuRm9yQWxsVGlsZXMoKTtcclxuICAgIHRoaXMucmVzZXRUZXh0T25BbGxUaWxlcygpO1xyXG4gICAgdGhpcy50aW1lck1hbmFnZXIuY2xlYXJBbGxUaW1lcnMoKTtcclxuICAgIHVzZVBhdHRlcm4oc2NhbGVQYXR0ZXJuKVxyXG4gICAgICAuZm9ySXRlbXModGhpcy5kZWdyZWVUaWxlcylcclxuICAgICAgLmZyb21JbmRleChpbmRleClcclxuICAgICAgLndpdGhUaW1lcih0aGlzLnRpbWVyTWFuYWdlcilcclxuICAgICAgLnJ1bkZvckZpcnN0SXRlbSgodGlsZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJvb3RPZmZzZXQgPSAwO1xyXG4gICAgICAgIHRpbGUuc2V0RGVncmVlTnVtYmVyKHJvb3RPZmZzZXQpO1xyXG4gICAgICAgIHRpbGUuZGlzYWJsZUhpZGRlbigpO1xyXG4gICAgICB9KVxyXG4gICAgICAucnVuKCh0aWxlLCBvZmZzZXQpID0+IHtcclxuICAgICAgICB0aWxlLnNldERlZ3JlZU51bWJlcihvZmZzZXQpO1xyXG4gICAgICAgIHRpbGUuZGlzYWJsZUhpZGRlbigpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlc2V0VGV4dE9uQWxsVGlsZXMoKSB7XHJcbiAgICB0aGlzLmRlZ3JlZVRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcclxuICAgICAgdGlsZS5zZXREZWdyZWVUZXh0KCcnKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZWdyZWVEaXNwbGF5O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBTY2FsZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NjYWxlLWNvbnRyb2xsZXInKTtcclxuXHJcbmNvbnN0IG9mZnNldFRvRGVncmVlU2V0cyA9IHJlcXVpcmUoJy4vZGF0YS9vZmZzZXQtdG8tZGVncmVlLXNldHMnKTtcclxuXHJcbmNsYXNzIERlZ3JlZVRpbGUge1xyXG4gIGNvbnN0cnVjdG9yKGRvbUlELCBpbmRleCkge1xyXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSUQpO1xyXG4gICAgdGhpcy5kb21UZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcuZGVncmVlLWRpc3BsYXlfX2RlZ3JlZS10ZXh0Jyk7XHJcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgfVxyXG5cclxuICBlbmFibGVIaWRkZW4oKSB7XHJcbiAgICB0aGlzLmRvbU5vZGUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlkZGVuKCkge1xyXG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG4gIH1cclxuXHJcbiAgc2V0RGVncmVlTnVtYmVyKG9mZnNldEZyb21Sb290Tm90ZSkge1xyXG4gICAgY29uc3QgY2hvcmRPclNjYWxlID0gU2NhbGVDb250cm9sbGVyLmdldENob3JkT3JTY2FsZSgpO1xyXG4gICAgY29uc3QgZGVncmVlVHlwZSA9ICdzdGFuZGFyZCc7IC8vIFNldHRpbmdzLmdldERlZ3JlZVR5cGUoKTtcclxuICAgIGxldCBkZWdyZWUgPSAnJztcclxuICAgIGlmIChjaG9yZE9yU2NhbGUgPT09ICdzY2FsZScpIHtcclxuICAgICAgY29uc3Qgc2NhbGVTZXQgPSBvZmZzZXRUb0RlZ3JlZVNldHMuc2NhbGVbZGVncmVlVHlwZV07XHJcbiAgICAgIGlmIChzY2FsZVNldCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgIGRlZ3JlZSA9IHNjYWxlU2V0W29mZnNldEZyb21Sb290Tm90ZV07XHJcbiAgICB9IGVsc2UgaWYgKGNob3JkT3JTY2FsZSA9PT0gJ2Nob3JkJykge1xyXG4gICAgICBjb25zdCBjaG9yZFNldCA9IG9mZnNldFRvRGVncmVlU2V0cy5jaG9yZFtkZWdyZWVUeXBlXTtcclxuICAgICAgaWYgKGNob3JkU2V0ID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgICAgZGVncmVlID0gY2hvcmRTZXRbb2Zmc2V0RnJvbVJvb3ROb3RlXTtcclxuICAgIH1cclxuICAgIHRoaXMuc2V0RGVncmVlVGV4dChkZWdyZWUpO1xyXG4gIH1cclxuXHJcbiAgc2V0RGVncmVlVGV4dCh0ZXh0KSB7XHJcbiAgICB0aGlzLmRvbVRleHROb2RlLnRleHRDb250ZW50ID0gdGV4dDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVncmVlVGlsZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuL2tleWJvYXJkJyk7XHJcbmNvbnN0IERlZ3JlZURpc3BsYXkgPSByZXF1aXJlKCcuL2RlZ3JlZS1kaXNwbGF5Jyk7XHJcbmNvbnN0IFNjYWxlQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vc2NhbGUtY29udHJvbGxlcicpO1xyXG5jb25zdCBTY2FsZURpc3BsYXkgPSByZXF1aXJlKCcuL3NjYWxlLWRpc3BsYXknKTtcclxuY29uc3QgUGlhbm9BdWRpb0NvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3BpYW5vLWF1ZGlvLWNvbnRyb2xsZXInKTtcclxuXHJcblNjYWxlQ29udHJvbGxlci5pbml0KCk7XHJcblNjYWxlRGlzcGxheS5pbml0KCk7XHJcblBpYW5vQXVkaW9Db250cm9sbGVyLmluaXQoKTtcclxuXHJcbmNvbnN0IG1haW5LZXlib2FyZCA9IG5ldyBLZXlib2FyZCgpO1xyXG5tYWluS2V5Ym9hcmQuc2V0RGlzcGxheU5hbWVGb3JBbGxLZXlzT2ZUeXBlKCdzdGFuZGFyZCcpO1xyXG5cclxuY29uc3QgZGVncmVlRGlzcGxheSA9IG5ldyBEZWdyZWVEaXNwbGF5KCk7XHJcbmRlZ3JlZURpc3BsYXkuZW5hYmxlSGlkZGVuRm9yQWxsVGlsZXMoKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3Qga2V5TmFtZVNldHMgPSByZXF1aXJlKCcuL2RhdGEva2V5LW5hbWUtc2V0cycpO1xyXG5jb25zdCBrZXlOYW1lVG9JREVudW0gPSByZXF1aXJlKCcuL2RhdGEva2V5LW5hbWUtdG8taWQtZW51bScpO1xyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lS2V5SUQoYmFzZU5hbWUpIHtcclxuICBjb25zdCBpZCA9IGtleU5hbWVUb0lERW51bVtiYXNlTmFtZV07XHJcbiAgaWYgKGlkID09PSB1bmRlZmluZWQpIHJldHVybiAtMTtcclxuICByZXR1cm4gaWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEtleU5hbWVTZXQodHlwZSkge1xyXG4gIGNvbnN0IGtleU5hbWVTZXQgPSBrZXlOYW1lU2V0c1t0eXBlXTtcclxuICBpZiAoa2V5TmFtZVNldCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgcmV0dXJuIGtleU5hbWVTZXQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFsaWFzT2ZTcGVjaWZpY1R5cGUoa2V5TmFtZVNldCwga2V5SUQpIHtcclxuICBjb25zdCBhbGlhc09mU3BlY2lmaWNUeXBlID0ga2V5TmFtZVNldFtrZXlJRF07XHJcbiAgaWYgKGFsaWFzT2ZTcGVjaWZpY1R5cGUgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG4gIHJldHVybiBhbGlhc09mU3BlY2lmaWNUeXBlO1xyXG59XHJcblxyXG5cclxuY2xhc3MgS2V5TmFtZSB7XHJcbiAgY29uc3RydWN0b3IoYmFzZU5hbWUpIHtcclxuICAgIHRoaXMuaWQgPSBkZXRlcm1pbmVLZXlJRChiYXNlTmFtZSk7XHJcbiAgfVxyXG5cclxuICBnZXRBbGlhc09mVHlwZSh0eXBlKSB7XHJcbiAgICBjb25zdCBrZXlOYW1lU2V0ID0gZ2V0S2V5TmFtZVNldCh0eXBlKTtcclxuICAgIGNvbnN0IGFsaWFzT2ZTcGVjaWZpY1R5cGUgPSBnZXRBbGlhc09mU3BlY2lmaWNUeXBlKGtleU5hbWVTZXQsIHRoaXMuaWQpO1xyXG4gICAgcmV0dXJuIGFsaWFzT2ZTcGVjaWZpY1R5cGU7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleU5hbWU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFBpYW5vS2V5ID0gcmVxdWlyZSgnLi9waWFuby1rZXknKTtcclxuY29uc3QgU2NhbGVEYXRhYmFzZSA9IHJlcXVpcmUoJy4vc2NhbGUtZGF0YWJhc2UnKTtcclxuY29uc3QgVGltZXJNYW5hZ2VyID0gcmVxdWlyZSgnLi90aW1lci1tYW5hZ2VyJyk7XHJcbmNvbnN0IERlZ3JlZURpc3BsYXkgPSByZXF1aXJlKCcuL2RlZ3JlZS1kaXNwbGF5Jyk7XHJcblxyXG5jb25zdCB7IHJhbmdlLCB1c2VQYXR0ZXJuIH0gPSByZXF1aXJlKCcuL3V0aWwnKTtcclxuY29uc3QgcGlhbm9LZXlCYXNlSURzID0gcmVxdWlyZSgnLi9kYXRhL3BpYW5vLWtleS1iYXNlLWlkcycpO1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVLZXlOYW1lRG9tSURzKCkge1xyXG4gIGNvbnN0IGtleU5hbWVzV2l0aE9jdGF2ZXMgPSBbXTtcclxuICBjb25zdCBOVU1fT0ZfT0NUQVZFUyA9IDM7XHJcbiAgcmFuZ2UoMSwgTlVNX09GX09DVEFWRVMpLmZvckVhY2goKG9jdGF2ZSkgPT4ge1xyXG4gICAgcGlhbm9LZXlCYXNlSURzLmZvckVhY2goKGJhc2VJRCkgPT4ge1xyXG4gICAgICBjb25zdCBuYW1lV2l0aE9jdGF2ZSA9IGJhc2VJRCArIG9jdGF2ZTtcclxuICAgICAga2V5TmFtZXNXaXRoT2N0YXZlcy5wdXNoKG5hbWVXaXRoT2N0YXZlKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBrZXlOYW1lc1dpdGhPY3RhdmVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQaWFub0tleXNVc2luZ0RvbUlEcyhrZXlOYW1lSURzID0gW10pIHtcclxuICBjb25zdCBwaWFub0tleU5vZGVzID0gW107XHJcbiAga2V5TmFtZUlEcy5mb3JFYWNoKChpZCwga2V5SW5kZXgpID0+IHtcclxuICAgIGNvbnN0IHBpYW5vS2V5ID0gbmV3IFBpYW5vS2V5KGlkLCBrZXlJbmRleCk7XHJcbiAgICBwaWFub0tleU5vZGVzLnB1c2gocGlhbm9LZXkpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBwaWFub0tleU5vZGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQaWFub0tleXMoKSB7XHJcbiAgY29uc3Qga2V5TmFtZUlEcyA9IGdlbmVyYXRlS2V5TmFtZURvbUlEcygpO1xyXG4gIGNvbnN0IHBpYW5vS2V5cyA9IGdldFBpYW5vS2V5c1VzaW5nRG9tSURzKGtleU5hbWVJRHMpO1xyXG4gIHJldHVybiBwaWFub0tleXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMoa2V5Ym9hcmQpIHtcclxuICBrZXlib2FyZC5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBldmVudFNvdXJjZSA9IGtleWJvYXJkLmtleXMuZmluZChpdGVtID0+IGl0ZW0uZ2V0RG9tTm9kZSgpID09PSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmtleWJvYXJkX19rZXknKSk7XHJcbiAgICBpZiAoZXZlbnRTb3VyY2UgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgY29uc3QgaW5kZXggPSBldmVudFNvdXJjZS5nZXRLZXlJbmRleCgpO1xyXG4gICAga2V5Ym9hcmQuZW5hYmxlSGlnaGxpZ2h0aW5nRm9yU2NhbGVTdGFydGluZ0Zyb21JbmRleChpbmRleCk7XHJcbiAgICBrZXlib2FyZC5kZWdyZWVEaXNwbGF5LnNldERpc3BsYXllZFRpbGVzRm9yU2NhbGVTdGFydGluZ0Zyb21JbmRleChpbmRleCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBLZXlib2FyZCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmRvbU5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmQnKTtcclxuICAgIHRoaXMua2V5cyA9IGdldFBpYW5vS2V5cygpO1xyXG4gICAgdGhpcy5kZWdyZWVEaXNwbGF5ID0gbmV3IERlZ3JlZURpc3BsYXkoKTtcclxuICAgIHRoaXMudGltZXJNYW5hZ2VyID0gbmV3IFRpbWVyTWFuYWdlcigpO1xyXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcclxuICB9XHJcblxyXG4gIGRpc2FibGVIaWdobGlnaHRpbmdGb3JBbGxLZXlzKCkge1xyXG4gICAgdGhpcy5rZXlzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICBrZXkuZGlzYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBlbmFibGVIaWdobGlnaHRpbmdGb3JTY2FsZVN0YXJ0aW5nRnJvbUluZGV4KGluZGV4KSB7XHJcbiAgICBjb25zdCBzY2FsZVBhdHRlcm4gPSBTY2FsZURhdGFiYXNlLmdldFBhdHRlcm5PZlNlbGVjdGVkU2NhbGUoKTtcclxuICAgIGlmIChzY2FsZVBhdHRlcm4ubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLnRpbWVyTWFuYWdlci5jbGVhckFsbFRpbWVycygpO1xyXG4gICAgdGhpcy5kaXNhYmxlSGlnaGxpZ2h0aW5nRm9yQWxsS2V5cygpO1xyXG4gICAgdXNlUGF0dGVybihzY2FsZVBhdHRlcm4pXHJcbiAgICAgIC5mb3JJdGVtcyh0aGlzLmtleXMpXHJcbiAgICAgIC5mcm9tSW5kZXgoaW5kZXgpXHJcbiAgICAgIC53aXRoVGltZXIodGhpcy50aW1lck1hbmFnZXIpXHJcbiAgICAgIC5ydW5Gb3JGaXJzdEl0ZW0oKHJvb3RLZXkpID0+IHtcclxuICAgICAgICBjb25zdCBpc1Jvb3RLZXkgPSB0cnVlO1xyXG4gICAgICAgIHJvb3RLZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKGlzUm9vdEtleSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5ydW4oKGtleSkgPT4ge1xyXG4gICAgICAgIGtleS5lbmFibGVIaWdobGlnaHRpbmcoKTtcclxuICAgICAgICBrZXkucGxheUF1ZGlvKCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheU5hbWVGb3JBbGxLZXlzT2ZUeXBlKHR5cGUpIHtcclxuICAgIHRoaXMua2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAga2V5LnNldERpc3BsYXlOYW1lT2ZUeXBlKHR5cGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBOYW1lU2FuaXRpemVyID0ge1xyXG5cclxuICAvKiAnYnRuLXNjYWxlLW1ham9yJyAtPiAnc2NhbGUtbWFqb3InICovXHJcbiAgY29udmVydEJ1dHRvbklEVG9TdGF0ZU5hbWUoYnV0dG9uSUQpIHtcclxuICAgIGlmIChidXR0b25JRCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgICBjb25zdCBzdGF0ZU5hbWUgPSBidXR0b25JRC5zdWJzdHJpbmcoNCk7XHJcbiAgICByZXR1cm4gc3RhdGVOYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJ2Pima8nICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb0tleU5hbWVCYXNlTmFtZShwaWFub0tleURvbUlEKSB7XHJcbiAgICBpZiAocGlhbm9LZXlEb21JRCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcbiAgICBjb25zdCB0cmltbWVkTmFtZSA9IHBpYW5vS2V5RG9tSUQuc2xpY2UoMCwgLTEpO1xyXG4gICAgY29uc3Qga2V5TmFtZUJhc2VOYW1lID0gdHJpbW1lZE5hbWUucmVwbGFjZSgnLXNoYXJwJywgJ+KZrycpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICByZXR1cm4ga2V5TmFtZUJhc2VOYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qICdjLXNoYXJwMScgLT4gJzEnICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb09jdGF2ZU51bWJlcihwaWFub0tleURvbUlEKSB7XHJcbiAgICByZXR1cm4gcGlhbm9LZXlEb21JRC5zbGljZSgtMSk7XHJcbiAgfSxcclxuXHJcbiAgLyogJ2Mtc2hhcnAxJyAtPiAnYmxhY2snICovXHJcbiAgY29udmVydFBpYW5vS2V5RG9tSURUb0NvbG9yKHBpYW5vS2V5RG9tSUQpIHtcclxuICAgIHJldHVybiAocGlhbm9LZXlEb21JRC5pbmRleE9mKCdzaGFycCcpICE9PSAtMSkgPyAnYmxhY2snIDogJ3doaXRlJztcclxuICB9LFxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmFtZVNhbml0aXplcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgcGlhbm9LZXlCYXNlSURzID0gcmVxdWlyZSgnLi9kYXRhL3BpYW5vLWtleS1iYXNlLWlkcycpO1xyXG5jb25zdCB7IHJhbmdlIH0gPSByZXF1aXJlKCcuL3V0aWwnKTtcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlQXVkaW9GaWxlTmFtZXMoKSB7XHJcbiAgY29uc3QgYXVkaW9GaWxlTmFtZXMgPSBbXTtcclxuICBjb25zdCBOVU1fT0ZfT0NUQVZFUyA9IDM7XHJcbiAgcmFuZ2UoMSwgTlVNX09GX09DVEFWRVMpLmZvckVhY2goKG9jdGF2ZSkgPT4ge1xyXG4gICAgcGlhbm9LZXlCYXNlSURzLmZvckVhY2goKGJhc2VJRCkgPT4ge1xyXG4gICAgICBjb25zdCBhdWRpb0ZpbGVOYW1lID0gYC4vYXVkaW8vJHtiYXNlSUR9JHtvY3RhdmV9Lm9nZ2A7XHJcbiAgICAgIGF1ZGlvRmlsZU5hbWVzLnB1c2goYXVkaW9GaWxlTmFtZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4gYXVkaW9GaWxlTmFtZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUF1ZGlvRWxlbWVudHMoZmlsZW5hbWVzKSB7XHJcbiAgY29uc3QgYXVkaW9FbGVtZW50cyA9IFtdO1xyXG4gIGZpbGVuYW1lcy5mb3JFYWNoKChmaWxlbmFtZSkgPT4ge1xyXG4gICAgY29uc3QgYXVkaW9FbGVtZW50ID0gbmV3IEF1ZGlvKGZpbGVuYW1lKTtcclxuICAgIGF1ZGlvRWxlbWVudHMucHVzaChhdWRpb0VsZW1lbnQpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBhdWRpb0VsZW1lbnRzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBdWRpb0VsZW1lbnRzKCkge1xyXG4gIGNvbnN0IGZpbGVuYW1lcyA9IGdlbmVyYXRlQXVkaW9GaWxlTmFtZXMoKTtcclxuICBjb25zdCBhdWRpb0VsZW1lbnRzID0gY3JlYXRlQXVkaW9FbGVtZW50cyhmaWxlbmFtZXMpO1xyXG4gIHJldHVybiBhdWRpb0VsZW1lbnRzO1xyXG59XHJcblxyXG5cclxuY2xhc3MgUGlhbm9BdWRpb0NvbnRyb2xsZXIge1xyXG4gIHN0YXRpYyBpbml0KG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgeyB2b2x1bWUgPSAwLjIgfSA9IG9wdGlvbnM7XHJcbiAgICB0aGlzLm1hc3RlclZvbHVtZSA9IHZvbHVtZTtcclxuICAgIHRoaXMuYXVkaW9FbGVtZW50cyA9IGdldEF1ZGlvRWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZXRNYXN0ZXJWb2x1bWUodm9sdW1lID0gdGhpcy5tYXN0ZXJWb2x1bWUpIHtcclxuICAgIGlmICh2b2x1bWUgPCAwIHx8IHZvbHVtZSA+IDEuMCkgcmV0dXJuO1xyXG4gICAgdGhpcy5tYXN0ZXJWb2x1bWUgPSB2b2x1bWU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGxheUtleUF0SW5kZXgoaW5kZXgpIHtcclxuICAgIGNvbnN0IGF1ZGlvRWxlbWVudCA9IHRoaXMuYXVkaW9FbGVtZW50c1tpbmRleF07XHJcbiAgICBpZiAoYXVkaW9FbGVtZW50ID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuICAgIGNvbnN0IGF1ZGlvQ2xvbmUgPSBhdWRpb0VsZW1lbnQuY2xvbmVOb2RlKCk7XHJcbiAgICBhdWRpb0Nsb25lLnZvbHVtZSA9IHRoaXMubWFzdGVyVm9sdW1lO1xyXG4gICAgYXVkaW9DbG9uZS5wbGF5KCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBpYW5vQXVkaW9Db250cm9sbGVyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBLZXlOYW1lID0gcmVxdWlyZSgnLi9rZXktbmFtZScpO1xyXG5jb25zdCBOYW1lU2FuaXRpemVyID0gcmVxdWlyZSgnLi9uYW1lLXNhbml0aXplcicpO1xyXG5jb25zdCBQaWFub0F1ZGlvQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vcGlhbm8tYXVkaW8tY29udHJvbGxlcicpO1xyXG5cclxuY29uc3QgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcyA9IHJlcXVpcmUoJy4vZGF0YS9oaWdobGlnaHRpbmctY2xhc3MtbmFtZXMnKTtcclxuXHJcbmZ1bmN0aW9uIGRldGVybWluZUNvbG9yKGRvbUlEKSB7XHJcbiAgcmV0dXJuIE5hbWVTYW5pdGl6ZXIuY29udmVydFBpYW5vS2V5RG9tSURUb0NvbG9yKGRvbUlEKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lTmFtZXMoZG9tSUQpIHtcclxuICBjb25zdCBrZXlOYW1lQmFzZU5hbWUgPSBOYW1lU2FuaXRpemVyLmNvbnZlcnRQaWFub0tleURvbUlEVG9LZXlOYW1lQmFzZU5hbWUoZG9tSUQpO1xyXG4gIGNvbnN0IGtleU5hbWUgPSBuZXcgS2V5TmFtZShrZXlOYW1lQmFzZU5hbWUpO1xyXG4gIHJldHVybiBrZXlOYW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVPY3RhdmUoZG9tSUQpIHtcclxuICByZXR1cm4gTmFtZVNhbml0aXplci5jb252ZXJ0UGlhbm9LZXlEb21JRFRvT2N0YXZlTnVtYmVyKGRvbUlEKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkTW91c2VMaXN0ZW5lcihwaWFub0tleSkge1xyXG4gIHBpYW5vS2V5LmRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4gezFcclxuICAgIHBpYW5vS2V5LnBsYXlBdWRpbygpO1xyXG4gICAgaWYgKHBpYW5vS2V5LmlzSGlnaGxpZ2h0ZWQoKSkgcmV0dXJuO1xyXG4gICAgcGlhbm9LZXkuZW5hYmxlSGlnaGxpZ2h0aW5nKHRydWUpO1xyXG4gICAgZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xyXG4gICAgICBwaWFub0tleS5kaXNhYmxlSGlnaGxpZ2h0aW5nKCk7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCksIDApO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvdWNoTGlzdGVuZXIocGlhbm9LZXkpIHtcclxuICBwaWFub0tleS5kb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoKSA9PiB7XHJcbiAgICBwaWFub0tleS5wbGF5QXVkaW8oKTtcclxuICAgIGlmIChwaWFub0tleS5pc0hpZ2hsaWdodGVkKCkpIHJldHVybjtcclxuICAgIHBpYW5vS2V5LmVuYWJsZUhpZ2hsaWdodGluZyh0cnVlKTtcclxuICAgIGZ1bmN0aW9uIG9uVG91Y2hFbmQoKSB7XHJcbiAgICAgIHBpYW5vS2V5LmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICAgICAgc2V0VGltZW91dChkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQpLCAwKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMocGlhbm9LZXkpIHtcclxuICBhZGRNb3VzZUxpc3RlbmVyKHBpYW5vS2V5KTtcclxuICBhZGRUb3VjaExpc3RlbmVyKHBpYW5vS2V5KTtcclxufVxyXG5cclxuXHJcbmNsYXNzIFBpYW5vS2V5IHtcclxuICBjb25zdHJ1Y3Rvcihkb21JRCwga2V5SW5kZXgpIHtcclxuICAgIHRoaXMuaW5kZXggPSBrZXlJbmRleDtcclxuICAgIHRoaXMubmFtZXMgPSBkZXRlcm1pbmVOYW1lcyhkb21JRCk7XHJcbiAgICB0aGlzLmNvbG9yID0gZGV0ZXJtaW5lQ29sb3IoZG9tSUQpO1xyXG4gICAgdGhpcy5vY3RhdmUgPSBkZXRlcm1pbmVPY3RhdmUoZG9tSUQpO1xyXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSUQpO1xyXG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUgPSB0aGlzLmRvbU5vZGUucXVlcnlTZWxlY3RvcignLmtleWJvYXJkX19rZXktbmFtZScpO1xyXG4gICAgdGhpcy5kb21GaW5nZXJpbmdUZXh0Tm9kZSA9IHRoaXMuZG9tTm9kZS5xdWVyeVNlbGVjdG9yKCcua2V5Ym9hcmRfX2ZpbmdlcmluZycpO1xyXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycyh0aGlzKTtcclxuICB9XHJcblxyXG4gIGlzSGlnaGxpZ2h0ZWQoKSB7XHJcbiAgICBsZXQgaXNIaWdobGlnaHRlZCA9IGZhbHNlO1xyXG4gICAgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcy5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcclxuICAgICAgaWYgKHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xyXG4gICAgICAgIGlzSGlnaGxpZ2h0ZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBpc0hpZ2hsaWdodGVkO1xyXG4gIH1cclxuXHJcbiAgZW5hYmxlSGlnaGxpZ2h0aW5nKGlzUm9vdEtleSA9IGZhbHNlKSB7XHJcbiAgICBsZXQgaGlnaGxpZ2h0Q2xhc3NOYW1lID0gJyc7XHJcbiAgICBpZiAoaXNSb290S2V5KSB7XHJcbiAgICAgIGhpZ2hsaWdodENsYXNzTmFtZSA9IHRoaXMuY29sb3IgPT09ICd3aGl0ZScgPyAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUtLXJvb3QnIDogJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrLS1yb290JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGhpZ2hsaWdodENsYXNzTmFtZSA9IHRoaXMuY29sb3IgPT09ICd3aGl0ZScgPyAncGlhbm8ta2V5LWhpZ2hsaWdodC0td2hpdGUnIDogJ3BpYW5vLWtleS1oaWdobGlnaHQtLWJsYWNrJztcclxuICAgIH1cclxuICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGhpZ2hsaWdodENsYXNzTmFtZSk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlnaGxpZ2h0aW5nKCkge1xyXG4gICAgaGlnaGxpZ2h0aW5nQ2xhc3NOYW1lcy5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcclxuICAgICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0Q3VzdG9tRGlzcGxheU5hbWUobmFtZSkge1xyXG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQgPSBuYW1lO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlzcGxheU5hbWVPZlR5cGUodHlwZSkge1xyXG4gICAgY29uc3QgYWxpYXMgPSB0aGlzLm5hbWVzLmdldEFsaWFzT2ZUeXBlKHR5cGUpO1xyXG4gICAgdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQgPSBhbGlhcztcclxuICB9XHJcblxyXG4gIHBsYXlBdWRpbygpIHtcclxuICAgIFBpYW5vQXVkaW9Db250cm9sbGVyLnBsYXlLZXlBdEluZGV4KHRoaXMuaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudE5hbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kb21OYW1lVGV4dE5vZGUudGV4dENvbnRlbnQ7XHJcbiAgfVxyXG5cclxuICBnZXRLZXlJbmRleCgpIHtcclxuICAgIHJldHVybiB0aGlzLmluZGV4O1xyXG4gIH1cclxuXHJcbiAgZ2V0RG9tTm9kZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRvbU5vZGU7XHJcbiAgfVxyXG5cclxuICByZXNldERpc3BsYXlOYW1lKCkge1xyXG4gICAgLy8gVE9ETzogR2V0IGRlZmF1bHQgdHlwZSBmcm9tIHNldHRpbmdzIG9iamVjdFxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBpYW5vS2V5O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBTY2FsZURpc3BsYXkgPSByZXF1aXJlKCcuL3NjYWxlLWRpc3BsYXknKTtcclxuY29uc3QgU2NhbGVMaXN0Q2F0ZWdvcnkgPSByZXF1aXJlKCcuL3NjYWxlLWxpc3QtY2F0ZWdvcnknKTtcclxuY29uc3QgU2NhbGVMaXN0QnV0dG9uID0gcmVxdWlyZSgnLi9zY2FsZS1saXN0LWJ1dHRvbicpO1xyXG5cclxuY29uc3QgeyB0b1RpdGxlQ2FzZSB9ID0gcmVxdWlyZSgnLi91dGlsJyk7XHJcblxyXG5sZXQgc2NhbGVTdGF0ZSA9ICcnO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHJlc2V0SGlnaGxpZ2h0T25BbGxCdXR0b25zKHNjYWxlQ29udHJvbGxlcikge1xyXG4gIHNjYWxlQ29udHJvbGxlci5idXR0b25zLmZvckVhY2goKGJ0bikgPT4ge1xyXG4gICAgYnRuLmRpc2FibGVIaWdobGlnaHRpbmcoKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5mb09mU2NhbGVTdGF0ZSgpIHtcclxuICBjb25zdCBbY2hvcmRPclNjYWxlLCAuLi5zY2FsZVR5cGVUb2tlbnNdID0gc2NhbGVTdGF0ZS5zcGxpdCgnLScpO1xyXG4gIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlVHlwZVRva2Vucy5qb2luKCcgJyk7XHJcbiAgcmV0dXJuIHsgY2hvcmRPclNjYWxlLCBzY2FsZVR5cGUgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2NhbGVMaXN0Q2F0ZWdvcmllcygpIHtcclxuICBjb25zdCBjYXRlZ29yeU5vZGVzID0gWy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5JyldO1xyXG4gIGNvbnN0IGNhdGVnb3JpZXMgPSBbXTtcclxuICBjYXRlZ29yeU5vZGVzLmZvckVhY2goKGNhdGVnb3J5Tm9kZSkgPT4ge1xyXG4gICAgY29uc3QgY2F0ZWdvcnkgPSBuZXcgU2NhbGVMaXN0Q2F0ZWdvcnkoY2F0ZWdvcnlOb2RlKTtcclxuICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGNhdGVnb3JpZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNjYWxlTGlzdEJ1dHRvbnMoKSB7XHJcbiAgY29uc3QgYnV0dG9uTm9kZXMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnRuJyldO1xyXG4gIGNvbnN0IHNjYWxlTGlzdEJ1dHRvbnMgPSBbXTtcclxuICBidXR0b25Ob2Rlcy5mb3JFYWNoKChidXR0b25Ob2RlKSA9PiB7XHJcbiAgICBjb25zdCBzY2FsZUxpc3RCdXR0b24gPSBuZXcgU2NhbGVMaXN0QnV0dG9uKGJ1dHRvbk5vZGUpO1xyXG4gICAgc2NhbGVMaXN0QnV0dG9ucy5wdXNoKHNjYWxlTGlzdEJ1dHRvbik7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHNjYWxlTGlzdEJ1dHRvbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEJ1dHRvbkxpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBzY2FsZUNvbnRyb2xsZXIuYnV0dG9ucy5mb3JFYWNoKChidG4pID0+IHtcclxuICAgIGJ0bi5hZGRDbGlja0xpc3RlbmVyKCgpID0+IHtcclxuICAgICAgcmVzZXRIaWdobGlnaHRPbkFsbEJ1dHRvbnMoc2NhbGVDb250cm9sbGVyKTtcclxuICAgICAgYnRuLmVuYWJsZUhpZ2hsaWdodGluZygpO1xyXG4gICAgICBzY2FsZVN0YXRlID0gYnRuLmdldFN0YXRlTmFtZSgpO1xyXG4gICAgICBjb25zdCBmb3JtYXR0ZWRTY2FsZU5hbWUgPSBzY2FsZUNvbnRyb2xsZXIuZ2V0Rm9ybWF0dGVkU2NhbGVOYW1lKCk7XHJcbiAgICAgIFNjYWxlRGlzcGxheS5zZXRUZXh0KGZvcm1hdHRlZFNjYWxlTmFtZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJFdmVudExpc3RlbmVycyhzY2FsZUNvbnRyb2xsZXIpIHtcclxuICBhZGRCdXR0b25MaXN0ZW5lcnMoc2NhbGVDb250cm9sbGVyKTtcclxufVxyXG5cclxuXHJcbmNsYXNzIHNjYWxlQ29udHJvbGxlciB7XHJcbiAgc3RhdGljIGluaXQoKSB7XHJcbiAgICB0aGlzLmJ1dHRvbnMgPSBnZXRTY2FsZUxpc3RCdXR0b25zKCk7XHJcbiAgICB0aGlzLmNhdGVnb3JpZXMgPSBnZXRTY2FsZUxpc3RDYXRlZ29yaWVzKCk7XHJcbiAgICB0aGlzLmV4cGFuZEFsbENhdGVnb3JpZXMoKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0Q2hvcmRPclNjYWxlKCkge1xyXG4gICAgY29uc3QgeyBjaG9yZE9yU2NhbGUgfSA9IGdldEluZm9PZlNjYWxlU3RhdGUoKTtcclxuICAgIHJldHVybiBjaG9yZE9yU2NhbGU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0U2NhbGVUeXBlKCkge1xyXG4gICAgY29uc3QgeyBzY2FsZVR5cGUgfSA9IGdldEluZm9PZlNjYWxlU3RhdGUoKTtcclxuICAgIHJldHVybiBzY2FsZVR5cGU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0Rm9ybWF0dGVkU2NhbGVOYW1lKCkge1xyXG4gICAgY29uc3QgeyBjaG9yZE9yU2NhbGUsIHNjYWxlVHlwZSB9ID0gZ2V0SW5mb09mU2NhbGVTdGF0ZSgpO1xyXG4gICAgY29uc3QgbG93ZXJjYXNlTmFtZSA9IGAke3NjYWxlVHlwZX0gJHtjaG9yZE9yU2NhbGV9YDtcclxuICAgIGNvbnN0IHRpdGxlY2FzZU5hbWUgPSB0b1RpdGxlQ2FzZShsb3dlcmNhc2VOYW1lKTtcclxuICAgIHJldHVybiB0aXRsZWNhc2VOYW1lO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGV4cGFuZEFsbENhdGVnb3JpZXMoKSB7XHJcbiAgICB0aGlzLmNhdGVnb3JpZXMuZm9yRWFjaCgoY2F0ZWdvcnkpID0+IHtcclxuICAgICAgY2F0ZWdvcnkuZXhwYW5kTWVudSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY29sbGFwc2VBbGxDYXRlZ29yaWVzKCkge1xyXG4gICAgdGhpcy5jYXRlZ29yaWVzLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XHJcbiAgICAgIGNhdGVnb3J5LmNvbGxhcHNlTWVudSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzY2FsZUNvbnRyb2xsZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IFNjYWxlQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vc2NhbGUtY29udHJvbGxlcicpO1xyXG5cclxuY29uc3Qgc2NhbGVEYXRhID0gcmVxdWlyZSgnLi9kYXRhL3NjYWxlLWRhdGEnKTtcclxuXHJcbmZ1bmN0aW9uIGdldFNjYWxlUGF0dGVybihzY2FsZVR5cGUpIHtcclxuICBjb25zdCBwYXR0ZXJuID0gc2NhbGVEYXRhLnBhdHRlcm5zLnNjYWxlc1tzY2FsZVR5cGVdO1xyXG4gIGlmIChwYXR0ZXJuID09PSB1bmRlZmluZWQpIHJldHVybiBbXTtcclxuICByZXR1cm4gcGF0dGVybjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2hvcmRQYXR0ZXJuKHNjYWxlVHlwZSkge1xyXG4gIGNvbnN0IHBhdHRlcm4gPSBzY2FsZURhdGEucGF0dGVybnMuY2hvcmRzW3NjYWxlVHlwZV07XHJcbiAgaWYgKHBhdHRlcm4gPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xyXG4gIHJldHVybiBwYXR0ZXJuO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQYXR0ZXJuKCkge1xyXG4gIGNvbnN0IGNob3JkT3JTY2FsZSA9IFNjYWxlQ29udHJvbGxlci5nZXRDaG9yZE9yU2NhbGUoKTtcclxuICBjb25zdCBzY2FsZVR5cGUgPSBTY2FsZUNvbnRyb2xsZXIuZ2V0U2NhbGVUeXBlKCk7XHJcbiAgbGV0IHBhdHRlcm4gPSBbXTtcclxuICBpZiAoY2hvcmRPclNjYWxlID09PSAnc2NhbGUnKSB7XHJcbiAgICBwYXR0ZXJuID0gZ2V0U2NhbGVQYXR0ZXJuKHNjYWxlVHlwZSk7XHJcbiAgfSBlbHNlIGlmIChjaG9yZE9yU2NhbGUgPT09ICdjaG9yZCcpIHtcclxuICAgIHBhdHRlcm4gPSBnZXRDaG9yZFBhdHRlcm4oc2NhbGVUeXBlKTtcclxuICB9XHJcbiAgcmV0dXJuIHBhdHRlcm47XHJcbn1cclxuXHJcblxyXG5jbGFzcyBzY2FsZURhdGFiYXNlIHtcclxuICBzdGF0aWMgZ2V0UGF0dGVybk9mU2VsZWN0ZWRTY2FsZSgpIHtcclxuICAgIGNvbnN0IHNjYWxlUGF0dGVybiA9IGdldFBhdHRlcm4oKTtcclxuICAgIHJldHVybiBzY2FsZVBhdHRlcm47XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNjYWxlRGF0YWJhc2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNsYXNzIFNjYWxlRGlzcGxheSB7XHJcbiAgc3RhdGljIGluaXQoKSB7XHJcbiAgICB0aGlzLmRvbUVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2NhbGUtZGlzcGxheV9fdGV4dC1wYW5lbCcpO1xyXG4gICAgdGhpcy5kb21FbGVtLnRleHRDb250ZW50ID0gJyc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2V0VGV4dCh0ZXh0KSB7XHJcbiAgICB0aGlzLmRvbUVsZW0udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2FsZURpc3BsYXk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IE5hbWVTYW5pdGl6ZXIgPSByZXF1aXJlKCcuL25hbWUtc2FuaXRpemVyJyk7XHJcblxyXG5mdW5jdGlvbiBnZXRTdGF0ZU5hbWVGcm9tQnV0dG9uSUQoYnV0dG9uRWxlbSkge1xyXG4gIGNvbnN0IGJ1dHRvbklEID0gYnV0dG9uRWxlbS5pZDtcclxuICBjb25zdCBzdGF0ZU5hbWUgPSBOYW1lU2FuaXRpemVyLmNvbnZlcnRCdXR0b25JRFRvU3RhdGVOYW1lKGJ1dHRvbklEKTtcclxuICByZXR1cm4gc3RhdGVOYW1lO1xyXG59XHJcblxyXG5jbGFzcyBTY2FsZUxpc3RCdXR0b24ge1xyXG4gIGNvbnN0cnVjdG9yKGJ1dHRvbk5vZGUpIHtcclxuICAgIHRoaXMubm9kZSA9IGJ1dHRvbk5vZGU7XHJcbiAgICB0aGlzLnN0YXRlTmFtZSA9IGdldFN0YXRlTmFtZUZyb21CdXR0b25JRChidXR0b25Ob2RlKTtcclxuICB9XHJcblxyXG4gIGVuYWJsZUhpZ2hsaWdodGluZygpIHtcclxuICAgIHRoaXMubm9kZS5jbGFzc0xpc3QuYWRkKCdidG4tLXNlbGVjdGVkJyk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlSGlnaGxpZ2h0aW5nKCkge1xyXG4gICAgdGhpcy5ub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi0tc2VsZWN0ZWQnKTtcclxuICB9XHJcblxyXG4gIGdldFN0YXRlTmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLnN0YXRlTmFtZTtcclxuICB9XHJcblxyXG4gIGFkZENsaWNrTGlzdGVuZXIoY2FsbGJhY2spIHtcclxuICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhbGxiYWNrKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NhbGVMaXN0QnV0dG9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50TGlzdGVuZXJzKGNhdGVnb3J5KSB7XHJcbiAgY2F0ZWdvcnkuY2F0ZWdvcnlUaXRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIGNhdGVnb3J5LnRvZ2dsZU1lbnUoKTtcclxuICB9KTtcclxufVxyXG5cclxuY2xhc3MgU2NhbGVMaXN0Q2F0ZWdvcnkge1xyXG4gIGNvbnN0cnVjdG9yKGNhdGVnb3J5Tm9kZSkge1xyXG4gICAgdGhpcy5jYXRlZ29yeVRpdGxlID0gY2F0ZWdvcnlOb2RlLnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZS1saXN0X19jYXRlZ29yeS10aXRsZScpO1xyXG4gICAgdGhpcy5kcm9wZG93bkxpc3QgPSBjYXRlZ29yeU5vZGUucXVlcnlTZWxlY3RvcignLnNjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QnKTtcclxuICAgIHRoaXMuZHJvcGRvd25BcnJvdyA9IGNhdGVnb3J5Tm9kZS5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tYXJyb3cnKTtcclxuICAgIHJlZ2lzdGVyRXZlbnRMaXN0ZW5lcnModGhpcyk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVNZW51KCkge1xyXG4gICAgdGhpcy5jYXRlZ29yeVRpdGxlLmNsYXNzTGlzdC50b2dnbGUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5LXRpdGxlLS1hY3RpdmUnKTtcclxuICAgIHRoaXMuZHJvcGRvd25MaXN0LmNsYXNzTGlzdC50b2dnbGUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QtLWhpZGRlbicpO1xyXG4gICAgdGhpcy5kcm9wZG93bkFycm93LmNsYXNzTGlzdC50b2dnbGUoJ2Ryb3Bkb3duLWFycm93LS1hY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGV4cGFuZE1lbnUoKSB7XHJcbiAgICB0aGlzLmNhdGVnb3J5VGl0bGUuY2xhc3NMaXN0LmFkZCgnc2NhbGUtbGlzdF9fY2F0ZWdvcnktdGl0bGUtLWFjdGl2ZScpO1xyXG4gICAgdGhpcy5kcm9wZG93bkxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2NhbGUtbGlzdF9fY2F0ZWdvcnktbGlzdC0taGlkZGVuJyk7XHJcbiAgICB0aGlzLmRyb3Bkb3duQXJyb3cuY2xhc3NMaXN0LmFkZCgnZHJvcGRvd24tYXJyb3ctLWFjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgY29sbGFwc2VNZW51KCkge1xyXG4gICAgdGhpcy5jYXRlZ29yeVRpdGxlLmNsYXNzTGlzdC5yZW1vdmUoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5LXRpdGxlLS1hY3RpdmUnKTtcclxuICAgIHRoaXMuZHJvcGRvd25MaXN0LmNsYXNzTGlzdC5hZGQoJ3NjYWxlLWxpc3RfX2NhdGVnb3J5LWxpc3QtLWhpZGRlbicpO1xyXG4gICAgdGhpcy5kcm9wZG93bkFycm93LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bkb3duLWFycm93LS1hY3RpdmUnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NhbGVMaXN0Q2F0ZWdvcnk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNsYXNzIFRpbWVyTWFuYWdlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnRpbWVycyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogVGFrZSBvZmZzZXQgdGltZSBmcm9tIHNldHRpbmdzXHJcbiAgYWRkVGltZXIoY2FsbGJhY2ssIG9mZnNldEluZGV4KSB7XHJcbiAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIDIwMCAqIG9mZnNldEluZGV4KTtcclxuICAgIHRoaXMudGltZXJzLnB1c2godGltZXIpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJBbGxUaW1lcnMoKSB7XHJcbiAgICB0aGlzLnRpbWVycy5mb3JFYWNoKCh0aW1lcikgPT4ge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRpbWVycyA9IFtdO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaW1lck1hbmFnZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcclxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGlzIG51bWJlciBpcyBpbmNsdWRlZFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyW119XHJcbiAqL1xyXG5mdW5jdGlvbiByYW5nZShzdGFydCwgZW5kKSB7XHJcbiAgcmV0dXJuIFsuLi5BcnJheShlbmQgLSBzdGFydCArIDEpLmZpbGwoKS5tYXAoKF8sIGkpID0+IGkgKyAxKV07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSBmaXJzdCBsZXR0ZXIgb2YgZWFjaCB3b3JkIGluIGEgc3RyaW5nIHRvIHVwcGVyY2FzZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAqL1xyXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZShzdHIpIHtcclxuICBjb25zdCBzdHJJblRpdGxlQ2FzZSA9IHN0ci5zcGxpdCgnICcpLm1hcCgod29yZCkgPT4ge1xyXG4gICAgcmV0dXJuIHdvcmRbMF0udG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgfSkuam9pbignICcpO1xyXG4gIHJldHVybiBzdHJJblRpdGxlQ2FzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJ1bnMgYSBjYWxsYmFjayBmb3IgZWFjaCBpdGVtIG9mIGl0ZW1zLCBpdGVyYXRpbmcgdXNpbmcgaW5jcmVtZW50cyBmcm9tIHRoZSBwYXR0ZXJuQXJyYXlcclxuICogQHBhcmFtIHtBcnJheX0gcGF0dGVybkFycmF5XHJcbiAqIEBwYXJhbSB7QXJyYXl9IGl0ZW1zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBBcHBsaWVzIGNhbGxiYWNrIHN0YXJ0aW5nIGZyb20gaW5kZXggKyB0aGUgZmlyc3QgaW5jcmVtZW50IG9mIHRoZSBwYXR0ZXJuXHJcbiAqIEBwYXJhbSB7VGltZXJNYW5hZ2VyfSB0aW1lck1hbmFnZXIgT3B0aW9uYWwgbWFuYWdlciBmb3IgdGltZW91dHMgYmV0d2VlbiBlYWNoIGNhbGxiYWNrXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZpcnN0SXRlbUNhbGxiYWNrXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrRm9yRWFjaEl0ZW1cclxuICovXHJcbmZ1bmN0aW9uIHVzZVBhdHRlcm4ocGF0dGVybkFycmF5KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGZvckl0ZW1zKGl0ZW1zKSB7XHJcbiAgICAgIHRoaXMuaXRlbXMgPSBpdGVtcztcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgZnJvbUluZGV4KGluZGV4KSB7XHJcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgd2l0aFRpbWVyKHRpbWVyTWFuYWdlcikge1xyXG4gICAgICB0aGlzLnRpbWVyTWFuYWdlciA9IHRpbWVyTWFuYWdlcjtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgcnVuRm9yRmlyc3RJdGVtKGZpcnN0SXRlbUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuZmlyc3RJdGVtQ2FsbGJhY2sgPSBmaXJzdEl0ZW1DYWxsYmFjaztcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgcnVuKGNhbGxiYWNrRm9yRWFjaEl0ZW0pIHtcclxuICAgICAgaWYgKHRoaXMuZmlyc3RJdGVtQ2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IGZpcnN0SXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5pbmRleF07XHJcbiAgICAgICAgdGhpcy5maXJzdEl0ZW1DYWxsYmFjayhmaXJzdEl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuICAgICAgcGF0dGVybkFycmF5LmZvckVhY2goKGluY3JlbWVudCwgaWR4KSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbmRleCArPSBpbmNyZW1lbnQ7XHJcbiAgICAgICAgb2Zmc2V0ICs9IGluY3JlbWVudDtcclxuICAgICAgICBjb25zdCBjbG9zdXJlT2Zmc2V0ID0gb2Zmc2V0O1xyXG5cclxuICAgICAgICBjb25zdCBuZXh0SXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5pbmRleF07XHJcbiAgICAgICAgaWYgKG5leHRJdGVtID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGltZXJNYW5hZ2VyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGNhbGxiYWNrRm9yRWFjaEl0ZW0obmV4dEl0ZW0sIG9mZnNldCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudGltZXJNYW5hZ2VyLmFkZFRpbWVyKCgpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2tGb3JFYWNoSXRlbShuZXh0SXRlbSwgY2xvc3VyZU9mZnNldCk7XHJcbiAgICAgICAgICB9LCBpZHggKyAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICB9O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHsgcmFuZ2UsIHRvVGl0bGVDYXNlLCB1c2VQYXR0ZXJuIH07XHJcbiJdfQ==
