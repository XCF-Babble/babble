'use strict';

import { Website } from '../website';
import { documentObserver, sendEnterEvent } from '../../utils/webutils';

export class Discord extends Website {
  private targetElement: HTMLTextAreaElement | null;
  constructor() {
    super();
    this.domain = 'discordapp.com';
    this.targetElement = null;
  }

  register(): void {
    documentObserver((mutationsList: MutationRecord[], observer: MutationObserver) => {
      const inputBoxes: HTMLCollectionOf<HTMLTextAreaElement> = document.getElementsByTagName('textarea');
      if (inputBoxes.length > 0) {
        this.targetElement = inputBoxes[0];
      }
    });
  };

  tunnelInput(s: string): boolean {
    if (!this.targetElement) {
      return false;
    }
    this.targetElement.value = s;
    // React tracks DOMNode.value changes, so we also need to fire an 'input' event.
    // https://github.com/facebook/react/issues/10135#issuecomment-314441175
    this.targetElement.dispatchEvent(new KeyboardEvent('input', { bubbles: true}));
    return true;
  }

  submitInput(): boolean {
    if (!this.targetElement) {
      return false;
    }
    sendEnterEvent('keypress', this.targetElement);
    return true;
  }

  clearInput(): boolean {
    if (!this.targetElement) {
      return false;
    }
    this.targetElement.value = '';
    return true;
  }
}
