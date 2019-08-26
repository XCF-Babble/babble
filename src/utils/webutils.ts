'use strict';

// Send <ENTER>
// TODO: keyCode is deprecated and thus not supported by typescript. Unwilling
// to spend more time trying to get this working with `key` and `code`.
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
export const sendEnterEvent = (target: Element): void => {
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      // @ts-ignore
      keyCode: 10
    })
  );
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      // @ts-ignore
      keyCode: 13
    })
  );
};
