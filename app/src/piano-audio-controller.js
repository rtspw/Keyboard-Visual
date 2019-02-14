'use strict';

const pianoKeyBaseIDs = require('./data/piano-key-base-ids');
const { range } = require('./util');

function generateAudioFileNames() {
  const audioFileNames = [];
  const NUM_OF_OCTAVES = 3;
  range(1, NUM_OF_OCTAVES).forEach((octave) => {
    pianoKeyBaseIDs.forEach((baseID) => {
      const audioFileName = `./audio/${baseID}${octave}.ogg`;
      audioFileNames.push(audioFileName);
    });
  });
  return audioFileNames;
}

function createAudioElements(filenames) {
  const audioElements = [];
  filenames.forEach((filename) => {
    const audioElement = new Audio(filename);
    audioElements.push(audioElement);
  });
  return audioElements;
}

function getAudioElements() {
  const filenames = generateAudioFileNames();
  const audioElements = createAudioElements(filenames);
  return audioElements;
}


class PianoAudioController {
  static init(options = {}) {
    const { volume = 0.2 } = options;
    this.masterVolume = volume;
    this.audioElements = getAudioElements();
  }

  static setMasterVolume(volume = this.masterVolume) {
    if (volume < 0 || volume > 1.0) return;
    this.masterVolume = volume;
  }

  static playKeyAtIndex(index) {
    const audioElement = this.audioElements[index];
    if (audioElement === undefined) return;
    const audioClone = audioElement.cloneNode();
    audioClone.volume = this.masterVolume;
    audioClone.play();
  }
}

module.exports = PianoAudioController;
