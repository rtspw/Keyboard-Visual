'use strict';

var NameSanitizer = {
  /* 'btn-scale-major' -> 'scale-major' */
  convertButtonIDToStateName: function convertButtonIDToStateName(buttonID) {
    if (buttonID === undefined) return '';
    var stateName = buttonID.substring(4);
    return stateName;
  },

  /* 'c-sharp1' -> 'c♯' */
  convertPianoKeyDomIDToKeyNameBaseName: function convertPianoKeyDomIDToKeyNameBaseName(pianoKeyDomID) {
    if (pianoKeyDomID === undefined) return '';
    var trimmedName = pianoKeyDomID.slice(0, -1);
    var keyNameBaseName = trimmedName.replace('-sharp', '♯').toUpperCase();
    return keyNameBaseName;
  }
};
module.exports = NameSanitizer;