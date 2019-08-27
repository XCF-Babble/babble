'use strict';

import { Website } from '../website';
import { documentObserver, sendEnterEvent } from '../../utils/webutils';

export class Slack extends Website {
  private targetElement: HTMLElement | null;
  constructor() {
    super();
    this.domain = 'app.slack.com';
    this.targetElement = null;
  }

  register(): void {
    documentObserver((mutationsList: MutationRecord[], observer: MutationObserver) => {
      const inputBoxes: NodeListOf<Element> = document.querySelectorAll(
        'div.ql-editor'
      );
      if (inputBoxes.length > 0) {
        this.targetElement = inputBoxes[0] as HTMLElement;
      }
    });
  };

  tunnelInput(s: string): boolean {
    if (!this.targetElement) {
      return false;
    }
    this.targetElement.innerHTML = s;
    return true;
  }

  submitInput(): boolean {
    if (!this.targetElement) {
      return false;
    }
    sendEnterEvent('keydown', this.targetElement);
    return true;
  }

  clearInput(): boolean {
    if (!this.targetElement) {
      return false;
    }
    this.targetElement.innerHTML = '';
    return true;
  }
}
