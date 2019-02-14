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
      degree = offsetToDegreeSets.scale[degreeType][offsetFromRootNote];
    } else if (chordOrScale === 'chord') {
      degree = offsetToDegreeSets.chord[degreeType][offsetFromRootNote];
    }
    this.domTextNode.textContent = degree;
  }
}

module.exports = DegreeTile;
