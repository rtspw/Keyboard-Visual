'use strict';

const KeyName = require('./keyName');

function determineColor(domID) {
  return (domID.indexOf('sharp') !== -1) ? 'black' : 'white';
}

function determineNames(domID) {
  const trimmedName = domID.slice(0, -1);
  const reformattedName = trimmedName.replace('-sharp', '♯').toUpperCase();
  const keyName = new KeyName(reformattedName);
  return keyName;
}


class PianoKey {
  constructor(domID) {
    this.names = determineNames(domID);
    this.color = determineColor(domID);
    this.octave = domID.slice(-1);
    this.domNode = document.getElementById(domID);
    this.domNameTextNode = this.domNode.querySelector('.keyboard__key-name');
    this.domFingeringTextNode = this.domNode.querySelector('.keyboard__fingering');
    this.registerEventListeners();
  }

  registerEventListeners() {
    this.domNode.addEventListener('mousedown', this.enableHighlighting.bind(this));
    this.domNode.addEventListener('mouseup', this.disableHighlighting.bind(this));
  }

  enableHighlighting() {
    const highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
    this.domNode.classList.add(highlightClassName);
    this.setDisplayNameOfType('flat');
  }

  disableHighlighting() {
    const highlightClassName = this.color === 'white' ? 'piano-key-highlight--white' : 'piano-key-highlight--black';
    this.domNode.classList.remove(highlightClassName);
    this.setCustomDisplayName('');
  }

  setCustomDisplayName(name) {
    this.domNameTextNode.textContent = name;
  }

  setDisplayNameOfType(type) {
    const alias = this.names.getAliasOfType(type);
    this.domNameTextNode.textContent = alias;
  }

  setStandardDisplayName() {
    // TODO
    return this;
  }
}

module.exports = PianoKey;
