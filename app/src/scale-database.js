'use strict';

const ScaleController = require('./scale-controller');

const scaleData = require('./data/scale-data');

function getInfoOfScaleState(scaleState = '') {
  const [chordOrScale, ...scaleTypeTokens] = scaleState.split('-');
  const scaleType = scaleTypeTokens.join(' ');
  return [chordOrScale, scaleType];
}

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
