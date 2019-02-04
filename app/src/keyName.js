'use strict';

const keyNameSets = {
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
  if (id === undefined) {
    return -1;
  }
  return id;
}

function getAliases(keyID) {
  const aliases = idToAlisesDict[keyID];
  if (aliases === undefined) {
    return {};
  }
  return aliases;
}

class KeyName {
  constructor(baseName) {
    this.id = determineKeyID(baseName);
  }

  getAliasOfType(type) {
    if (keyNameSets[type] === undefined) {
      return '';
    }
    const keyNameSet = keyNameSets[type];
    const aliasOfSpecificType = keyNameSet[this.id];
    if (aliasOfSpecificType === undefined) {
      return '';
    }
    return aliasOfSpecificType;
  }
}

module.exports = KeyName;
