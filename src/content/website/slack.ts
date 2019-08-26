'use strict';

import { Website } from '../website';
import { sendEnterEvent } from '../../utils/webutils';

export class Slack extends Website {
  constructor() {
    super();
    this.domain = 'app.slack.com';
  }

  register(): void {
    setTimeout(():void => {
      const inputBoxes: NodeListOf<Element> = document.querySelectorAll(
        'div.ql-editor'
      );
      if (inputBoxes.length > 0) {
        this.targetElement = inputBoxes[0] as HTMLElement;
      }
    }, 3000);
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
    sendEnterEvent(this.targetElement);
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
