'use strict';

const DegreeTile = require('./degree-tile');
const ScaleDatabase = require('./scale-database');
const TimerManager = require('./timer-manager');

const pianoKeyBaseIDs = require('./data/piano-key-base-ids');
const { range, usePattern } = require('./util');

function generateDegreeDisplayTileDomIDs() {
  const tileNames = [];
  const NUM_OF_OCTAVES = 3;
  range(1, NUM_OF_OCTAVES).forEach((octave) => {
    pianoKeyBaseIDs.forEach((baseID) => {
      const tileName = `degree-${baseID}${octave}`;
      tileNames.push(tileName);
    });
  });
  return tileNames;
}

function getDegreeTilesUsingDomIDs(tileNameIDs = []) {
  const degreeTileNodes = [];
  tileNameIDs.forEach((id, tileIndex) => {
    const degreeTile = new DegreeTile(id, tileIndex);
    degreeTileNodes.push(degreeTile);
  });
  return degreeTileNodes;
}

function getDegreeTiles() {
  const tileNameIDs = generateDegreeDisplayTileDomIDs();
  const degreeTiles = getDegreeTilesUsingDomIDs(tileNameIDs);
  return degreeTiles;
}


class DegreeDisplay {
  constructor() {
    this.degreeTiles = getDegreeTiles();
    this.timerManager = new TimerManager();
  }

  enableHiddenForAllTiles() {
    this.degreeTiles.forEach((tile) => {
      tile.enableHidden();
    });
  }

  setDisplayedTilesForScaleStartingFromIndex(index) {
    const scalePattern = ScaleDatabase.getPatternOfSelectedScale();
    if (scalePattern.length === 0) return;
    this.enableHiddenForAllTiles();
    this.resetTextOnAllTiles();
    this.timerManager.clearAllTimers();
    usePattern(scalePattern)
      .forItems(this.degreeTiles)
      .fromIndex(index)
      .withTimer(this.timerManager)
      .runForFirstItem((tile) => {
        const rootOffset = 0;
        tile.setDegreeNumber(rootOffset);
        tile.disableHidden();
      })
      .run((tile, offset) => {
        tile.setDegreeNumber(offset);
        tile.disableHidden();
      });
  }

  resetTextOnAllTiles() {
    this.degreeTiles.forEach((tile) => {
      tile.setDegreeText('');
    });
  }
}

module.exports = DegreeDisplay;
