'use strict';

const Keyboard = require('./keyboard');
const ScaleController = require('./scale-controller');
const ScaleDisplay = require('./scale-display');

ScaleController.init();
ScaleDisplay.init();

const mainKeyboard = new Keyboard();
mainKeyboard.setDisplayNameForAllKeysOfType('standard');
