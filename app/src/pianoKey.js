'use strict';

function determineColor(name) {
  return (name.indexOf('sharp') !== -1) ? 'black' : 'white';
}

class PianoKey {
  constructor(domID) {
    this.domNode = document.getElementById(domID);
    this.id = domID;
    this.color = determineColor(domID);
  }

  toggleHighlighted() {
    if (this.color === 'white') {
      this.domNode.classList.toggle('piano-key-highlight--white');
    } else {
      this.domNode.classList.toggle('piano-key-highlight--black');
    }
  }
}

module.exports = PianoKey;
