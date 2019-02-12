'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NameSanitizer = require('./name-sanitizer');

var ScaleDisplay = require('./scale-display');

var scaleState = 'scale-major';

function getStateNameFromButtonID(buttonElem) {
  var buttonID = buttonElem.id;
  var stateName = NameSanitizer.convertButtonIDToStateName(buttonID);
  return stateName;
}

function addHighlightOnButton(btn) {
  btn.classList.add('btn--selected');
}

function resetHighlightOnAllButtons(scaleController) {
  scaleController.buttons.forEach(function (btn) {
    btn.classList.remove('btn--selected');
  });
}

function registerEventListeners(scaleController) {
  scaleController.buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      scaleState = getStateNameFromButtonID(btn);
      resetHighlightOnAllButtons(scaleController);
      addHighlightOnButton(btn);
      ScaleDisplay.setText(scaleState);
    });
  });
  scaleController.categories.forEach(function (category) {
    var categoryTitle = category.querySelector('.scale-list__category-title');
    var dropdownList = category.querySelector('.scale-list__category-list');
    var dropdownArrow = category.querySelector('.dropdown-arrow');
    categoryTitle.addEventListener('click', function () {
      categoryTitle.classList.toggle('scale-list__category-title--active');
      dropdownList.classList.toggle('scale-list__category-list--hidden');
      dropdownArrow.classList.toggle('dropdown-arrow--active');
    });
  });
}

var scaleController =
/*#__PURE__*/
function () {
  function scaleController() {
    _classCallCheck(this, scaleController);
  }

  _createClass(scaleController, null, [{
    key: "init",
    value: function init() {
      this.buttons = _toConsumableArray(document.getElementsByClassName('btn'));
      this.categories = _toConsumableArray(document.getElementsByClassName('scale-list__category'));
      registerEventListeners(this);
    }
  }, {
    key: "getScaleState",
    value: function getScaleState() {
      return scaleState;
    }
  }]);

  return scaleController;
}();

module.exports = scaleController;