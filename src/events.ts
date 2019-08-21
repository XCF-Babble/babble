var clickedElem: Element;

document.addEventListener(
  'contextmenu',
  (e: MouseEvent): void => {
    if (e.target instanceof Element) {
      if (e.button && e.button === 2) {
        clickedElem = e.target;
      }
    }
  },
  true
);

chrome.runtime.onMessage.addListener(
  (
    request: string,
    sender: chrome.runtime.MessageSender,
    sendResponse
  ): void => {
    if (request == 'getContextElement') {
      sendResponse({ element: clickedElem });
      console.log(clickedElem);
      // TODO: let's create a mutationobserver
    }
  }
);
