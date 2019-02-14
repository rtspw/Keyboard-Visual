'use strict';

const DegreeTile = require('./degree-tile');

const pianoKeyBaseIDs = require('./data/piano-key-base-ids');
const { range } = require('./util');

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
  }

  enableHiddenForAllTiles() {
    this.degreeTiles.forEach((tile) => {
      tile.enableHidden();
    });
  }
}

module.exports = DegreeDisplay;
