'use strict';

const PianoKey = require('./piano-key');
const ScaleDisplay = require('./scale-display');
const { range } = require('./util');

const pianoKeyNames = ['c', 'c-sharp', 'd', 'd-sharp', 'e',
  'f', 'f-sharp', 'g', 'g-sharp', 'a', 'a-sharp', 'b'];

function generateKeyNameIDs() {
  const keyNamesWithOctaves = [];
  range(1, 3).forEach((i) => {
    pianoKeyNames.forEach((name) => {
      const nameWithOctave = name + i;
      keyNamesWithOctaves.push(nameWithOctave);
    });
  });
  return keyNamesWithOctaves;
}

function getPianoKeysUsingIDs(keyNameIDs = []) {
  const pianoKeyNodes = [];
  keyNameIDs.forEach((id, keyIndex) => {
    const pianoKey = new PianoKey(id, keyIndex);
    pianoKeyNodes.push(pianoKey);
  });
  return pianoKeyNodes;
}

function getPianoKeys() {
  const keyNameIDs = generateKeyNameIDs();
  const pianoKeys = getPianoKeysUsingIDs(keyNameIDs);
  return pianoKeys;
}

function registerEventListeners(keyboard) {
  keyboard.keys.forEach((key) => {
    key.addNewEventListener('click', () => {
      keyboard.displayScaleFromIndex('major', key.getKeyIndex());
    });
  });
}


class Keyboard {
  constructor() {
    this.keys = getPianoKeys();
    console.log(this.keys);
    registerEventListeners(this);
  }

  test() {
    this.keys.forEach((key) => {
      key.setDisplayNameOfType('sharp');
    });
  }

  displayScaleFromIndex(scale, index) {
    const rootKey = this.keys[index];
    rootKey.enableHighlighting();
    let iter = index;
    ScaleDisplay.setText(rootKey.getCurrentName());
    const pattern = [2, 2, 1, 2, 2, 2, 1];
    pattern.forEach((increment) => {
      iter += increment;
      const nextKey = this.keys[iter];
      nextKey.enableHighlighting();
    });
  }
}

module.exports = Keyboard;
