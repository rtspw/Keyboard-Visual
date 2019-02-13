'use strict';

const ScaleController = require('./scale-controller');

const scaleData = require('./data/scale-data');

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

function getPattern() {
  const chordOrScale = ScaleController.getChordOrScale();
  const scaleType = ScaleController.getScaleType();
  let pattern = [];
  if (chordOrScale === 'scale') {
    pattern = getScalePattern(scaleType);
  } else if (chordOrScale === 'chord') {
    pattern = getChordPattern(scaleType);
  }
  return pattern;
}


class scaleDatabase {
  static getPatternOfSelectedScale() {
    const scalePattern = getPattern();
    return scalePattern;
  }
}

module.exports = scaleDatabase;
