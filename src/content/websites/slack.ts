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
      this.targetElement = document.querySelector('div.ql-editor');
    });
  };

  tunnelInput(s: string): boolean {
    if (!this.targetElement) {
      return false;
    }
    this.targetElement.innerText = s;
    return true;
  }

  submitInput(): boolean {
    if (!this.targetElement) {
      return false;
    }
    (this.targetElement.parentElement as HTMLElement).click();
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
