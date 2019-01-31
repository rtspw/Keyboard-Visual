'use strict';

const PianoKey = require('./pianoKey');
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

function getPianoKeyNodesWithIDs(keyNameIDs = []) {
  const pianoKeyNodes = [];
  keyNameIDs.forEach((id) => {
    const pianoKey = new PianoKey(id);
    pianoKeyNodes.push(pianoKey);
  });
  return pianoKeyNodes;
}

function getPianoKeyNodes() {
  const keyNameIDs = generateKeyNameIDs();
  const pianoKeyNodes = getPianoKeyNodesWithIDs(keyNameIDs);
  return pianoKeyNodes;
}

class Keyboard {
  constructor() {
    this.keyNodes = getPianoKeyNodes();
  }
}

module.exports = Keyboard;
