'use strict';

const ScaleDisplay = require('./scale-display');
const ScaleListCategory = require('./scale-list-category');
const ScaleListButton = require('./scale-list-button');

const { toTitleCase } = require('./util');

let scaleState = '';


function resetHighlightOnAllButtons(scaleController) {
  scaleController.buttons.forEach((btn) => {
    btn.disableHighlighting();
  });
}

function getInfoOfScaleState() {
  const [chordOrScale, ...scaleTypeTokens] = scaleState.split('-');
  const scaleType = scaleTypeTokens.join(' ');
  return { chordOrScale, scaleType };
}

function getScaleListCategories() {
  const categoryNodes = [...document.getElementsByClassName('scale-list__category')];
  const categories = [];
  categoryNodes.forEach((categoryNode) => {
    const category = new ScaleListCategory(categoryNode);
    categories.push(category);
  });
  return categories;
}

function getScaleListButtons() {
  const buttonNodes = [...document.getElementsByClassName('btn')];
  const scaleListButtons = [];
  buttonNodes.forEach((buttonNode) => {
    const scaleListButton = new ScaleListButton(buttonNode);
    scaleListButtons.push(scaleListButton);
  });
  return scaleListButtons;
}

function addButtonListeners(scaleController) {
  scaleController.buttons.forEach((btn) => {
    btn.addClickListener(() => {
      resetHighlightOnAllButtons(scaleController);
      btn.enableHighlighting();
      scaleState = btn.getStateName();
      const formattedScaleName = scaleController.getFormattedScaleName();
      ScaleDisplay.setText(formattedScaleName);
    });
  });
}

function registerEventListeners(scaleController) {
  addButtonListeners(scaleController);
}


class scaleController {
  static init() {
    this.buttons = getScaleListButtons();
    this.categories = getScaleListCategories();
    this.expandAllCategories();
    registerEventListeners(this);
  }

  static getChordOrScale() {
    const { chordOrScale } = getInfoOfScaleState();
    return chordOrScale;
  }

  static getScaleType() {
    const { scaleType } = getInfoOfScaleState();
    return scaleType;
  }

  static getFormattedScaleName() {
    const { chordOrScale, scaleType } = getInfoOfScaleState();
    const lowercaseName = `${scaleType} ${chordOrScale}`;
    const titlecaseName = toTitleCase(lowercaseName);
    return titlecaseName;
  }

  static expandAllCategories() {
    this.categories.forEach((category) => {
      category.expandMenu();
    });
  }

  static collapseAllCategories() {
    this.categories.forEach((category) => {
      category.collapseMenu();
    });
  }
}


module.exports = scaleController;
