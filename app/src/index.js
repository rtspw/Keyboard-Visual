'use strict';

const Keyboard = require('./keyboard');
const ScaleController = require('./scale-controller');
const ScaleDisplay = require('./scale-display');

ScaleController.init();
ScaleDisplay.init();

const test = new Keyboard();
test.setDisplayNameForAllKeysOfType('standard');
