'use strict';

const ScaleController = require('./scale-controller');

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
      'suspended2': [2, 5],
      'suspended4': [5, 2],
    },
  },
};

function getInfoOfScaleState(scaleState = '') {
  const [chordOrScale, ...scaleTypeTokens] = scaleState.split('-');
  const scaleType = scaleTypeTokens.join(' ');
  return [chordOrScale, scaleType];
}

function getScalePattern(scaleType) {
  const pattern = data.patterns.scales[scaleType];
  if (pattern === undefined) return [];
  return pattern;
}

function getChordPattern(scaleType) {
  const pattern = data.patterns.chords[scaleType];
  if (pattern === undefined) return [];
  return pattern;
}

function getPattern(scaleInfo) {
  const [chordOrScale, scaleType] = scaleInfo;
  let pattern = [];
  if (chordOrScale === 'scale') {
    pattern = getScalePattern(scaleType);
  } else if (chordOrScale === 'chord') {
    pattern = getChordPattern(scaleType);
  }
  return pattern;
}

class scaleDatabase {
  static getPatternOf(scaleState = '') {
    const scaleInfo = getInfoOfScaleState(scaleState);
    const pattern = getPattern(scaleInfo);
    return pattern;
  }

  static getPatternOfSelectedScale() {
    const scaleState = ScaleController.getScaleState();
    const scalePattern = this.getPatternOf(scaleState);
    return scalePattern;
  }
}

module.exports = scaleDatabase;
