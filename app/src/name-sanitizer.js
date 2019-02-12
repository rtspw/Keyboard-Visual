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
