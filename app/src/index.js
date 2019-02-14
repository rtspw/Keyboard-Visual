'use strict';

const Keyboard = require('./keyboard');
const DegreeDisplay = require('./degree-display');
const ScaleController = require('./scale-controller');
const ScaleDisplay = require('./scale-display');
const PianoAudioController = require('./piano-audio-controller');

ScaleController.init();
ScaleDisplay.init();
PianoAudioController.init();

const mainKeyboard = new Keyboard();
mainKeyboard.setDisplayNameForAllKeysOfType('standard');

const degreeDisplay = new DegreeDisplay();
degreeDisplay.enableHiddenForAllTiles();
