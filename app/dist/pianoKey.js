'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function determineColor(name) {
  return name.indexOf('sharp') !== -1 ? 'black' : 'white';
}

var PianoKey =
/*#__PURE__*/
function () {
  function PianoKey(domID) {
    _classCallCheck(this, PianoKey);

    this.domNode = document.getElementById(domID);
    this.id = domID;
    this.color = determineColor(domID);
  }

  _createClass(PianoKey, [{
    key: "toggleHighlighted",
    value: function toggleHighlighted() {
      if (this.color === 'white') {
        this.domNode.classList.toggle('piano-key-highlight--white');
      } else {
        this.domNode.classList.toggle('piano-key-highlight--black');
      }
    }
  }]);

  return PianoKey;
}();

module.exports = PianoKey;