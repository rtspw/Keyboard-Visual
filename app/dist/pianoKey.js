'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PianoKey =
/*#__PURE__*/
function () {
  function PianoKey(domID) {
    _classCallCheck(this, PianoKey);

    this.domNode = document.getElementById(domID);
    this.pianoKeyName = domID;
  }

  _createClass(PianoKey, [{
    key: "toggleHighlighted",
    value: function toggleHighlighted() {
      this.domNode.classList.toggle('highlighted');
    }
  }]);

  return PianoKey;
}();

module.exports = PianoKey;