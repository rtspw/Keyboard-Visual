'use strict';

var Keyboard = require('./keyboard');

var ScaleController = require('./scale-controller');

var ScaleDisplay = require('./scale-display');

ScaleController.init();
ScaleDisplay.init();
var test = new Keyboard();
test.test();