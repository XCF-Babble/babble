'use strict';

// Send <ENTER>
// TODO: keyCode is deprecated and thus not supported by typescript. Unwilling
// to spend more time trying to get this working with `key` and `code`.
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
export const sendEnterEvent = (kevent: string, target: Node): void => {
  target.dispatchEvent(
    new KeyboardEvent(kevent, {
      bubbles: true,
      cancelable: true,
      // @ts-ignore
      keyCode: 10
    })
  );
  target.dispatchEvent(
    new KeyboardEvent(kevent, {
      bubbles: true,
      cancelable: true,
      // @ts-ignore
      keyCode: 13
    })
  );
};

export const documentObserver = (
  callback: (
    mutationsList: MutationRecord[],
    observer: MutationObserver
  ) => void
) => {
  const observer: MutationObserver = new MutationObserver(callback);
  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
};
