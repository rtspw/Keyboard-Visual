'use strict';

class PianoKey {
  constructor(domID) {
    this.domNode = document.getElementById(domID);
    this.pianoKeyName = domID;
  }

  toggleHighlighted() {
    this.domNode.classList.toggle('highlighted');
  }
}

module.exports = PianoKey;
