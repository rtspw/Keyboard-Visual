'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ScaleDisplay =
/*#__PURE__*/
function () {
  function ScaleDisplay() {
    _classCallCheck(this, ScaleDisplay);
  }

  _createClass(ScaleDisplay, null, [{
    key: "init",
    value: function init() {
      this.domElem = document.querySelector('.scale-display__text-panel');
      this.domElem.textContent = '';
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this.domElem.textContent = text;
    }
  }]);

  return ScaleDisplay;
}();

module.exports = ScaleDisplay;