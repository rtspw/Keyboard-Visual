'use strict';

const KeyName = require('./key-name');
const NameSanitizer = require('./name-sanitizer');

function determineColor(domID) {
  return (domID.indexOf('sharp') !== -1) ? 'black' : 'white';
}

function determineNames(domID) {
  const keyNameBaseName = NameSanitizer.convertPianoKeyDomIDToKeyNameBaseName(domID);
  const keyName = new KeyName(keyNameBaseName);
  return keyName;
}

function determineOctave(domID) {
  return domID.slice(-1);
}

function registerEventListeners(pianoKey) {
  pianoKey.domNode.addEventListener('mousedown', pianoKey.enableHighlighting.bind(pianoKey));
  document.addEventListener('mouseup', pianoKey.disableHighlighting.bind(pianoKey));
  pianoKey.domNode.addEventListener('touchstart', pianoKey.enableHighlighting.bind(pianoKey));
  pianoKey.domNode.addEventListener('touchend', pianoKey.disableHighlighting.bind(pianoKey));
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

  enableHighlighting(isRootKey = false) {
    const highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
    this.domNode.classList.add(highlightClassName);
  }

  disableHighlighting(isRootKey = false) {
    const highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
    this.domNode.classList.remove(highlightClassName);
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

  resetDisplayName() {
    // TODO
    return this;
  }

  addNewEventListener(event, callback) {
    this.domNode.addEventListener(event, callback);
  }
}

module.exports = PianoKey;
