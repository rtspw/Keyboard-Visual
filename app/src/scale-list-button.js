'use strict';

const NameSanitizer = require('./name-sanitizer');

function getStateNameFromButtonID(buttonElem) {
  const buttonID = buttonElem.id;
  const stateName = NameSanitizer.convertButtonIDToStateName(buttonID);
  return stateName;
}

class ScaleListButton {
  constructor(buttonNode) {
    this.node = buttonNode;
    this.stateName = getStateNameFromButtonID(buttonNode);
  }

  enableHighlighting() {
    this.node.classList.add('btn--selected');
  }

  disableHighlighting() {
    this.node.classList.remove('btn--selected');
  }

  getStateName() {
    return this.stateName;
  }

  addClickListener(callback) {
    this.node.addEventListener('click', callback);
  }
}

module.exports = ScaleListButton;
