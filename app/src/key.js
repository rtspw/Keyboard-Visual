'use strict';

class Key {
  constructor(domID, name, octave) {
    this.key = document.getElementById(domID);
    this.name = name;
    this.octave = octave;
  }

  toggleHighlighted() {
    this.key.classList.toggle('highlighted');
  }
}

module.exports = Key;
