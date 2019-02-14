'use strict';

/**
 * @param {number} start
 * @param {number} end This number is included
 * @returns {number[]}
 */
function range(start, end) {
  return [...Array(end - start + 1).fill().map((_, i) => i + 1)];
}

/**
 * Sets the first letter of each word in a string to uppercase
 * @param {string} str
 */
function toTitleCase(str) {
  const strInTitleCase = str.split(' ').map((word) => {
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }).join(' ');
  return strInTitleCase;
}

/**
 * Runs a callback for each item of items, iterating using increments from the patternArray
 * @param {Array} patternArray
 * @param {Array} items
 * @param {number} index Applies callback starting from index + the first increment of the pattern
 * @param {TimerManager} timerManager Optional manager for timeouts between each callback
 * @param {Function} firstItemCallback
 * @param {Function} callbackForEachItem
 */
function usePattern(patternArray) {
  return {
    forItems(items) {
      this.items = items;
      return this;
    },
    fromIndex(index) {
      this.index = index;
      return this;
    },
    withTimer(timerManager) {
      this.timerManager = timerManager;
      return this;
    },
    runForFirstItem(firstItemCallback) {
      this.firstItemCallback = firstItemCallback;
      return this;
    },
    run(callbackForEachItem) {
      if (this.firstItemCallback !== undefined) {
        const firstItem = this.items[this.index];
        this.firstItemCallback(firstItem);
      }

      let offset = 0;
      patternArray.forEach((increment, idx) => {
        this.index += increment;
        offset += increment;
        const closureOffset = offset;

        const nextItem = this.items[this.index];
        if (nextItem === undefined) return;

        if (this.timerManager === undefined) {
          callbackForEachItem(nextItem, offset);
        } else {
          this.timerManager.addTimer(() => {
            callbackForEachItem(nextItem, closureOffset);
          }, idx + 1);
        }
      });
    },
  };
}

module.exports = { range, toTitleCase, usePattern };
