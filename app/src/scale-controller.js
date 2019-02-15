'use strict';

const NameSanitizer = require('./name-sanitizer');
const ScaleDisplay = require('./scale-display');
const ScaleListCategory = require('./scale-list-category');

const { toTitleCase } = require('./util');

let scaleState = '';

function getStateNameFromButtonID(buttonElem) {
  const buttonID = buttonElem.id;
  const stateName = NameSanitizer.convertButtonIDToStateName(buttonID);
  return stateName;
}

function addHighlightOnButton(btn) {
  btn.classList.add('btn--selected');
}

function resetHighlightOnAllButtons(scaleController) {
  scaleController.buttons.forEach((btn) => {
    btn.classList.remove('btn--selected');
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

function addButtonListeners(scaleController) {
  scaleController.buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      scaleState = getStateNameFromButtonID(btn);
      resetHighlightOnAllButtons(scaleController);
      addHighlightOnButton(btn);
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
    this.buttons = [...document.getElementsByClassName('btn')];
    this.categories = getScaleListCategories();
    this.enableVisibilityForAllCategories();
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
