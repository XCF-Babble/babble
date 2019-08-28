'use strict';

export class Website {
  protected domain: string;
  constructor() {
    if (new.target === Website) {
      throw new TypeError('Cannot construct Website (Abstract)');
    }
    this.domain = 'babble.moe';
  }

  // Called on page initialization. This sets up monitoring for the target encryption elements.
  register(): void {
    // TODO: should we setup a MutationListener here?
  }

  // Called when the user wants to display text in the input element.
  // Helper methods may be needed to clear placeholders, set up divs, or perform other site specific actions.
  tunnelInput(s: string) {
    return false;
  }

  // Called when the user hits ctrl+enter in the babble popup window.
  // We want to replicate the event that occurs when pressing enter
  // with that element focused. This may mean doing nothing.
  submitInput() {
    return false;
  }

  // Clear the submission element
  clearInput(): boolean {
    return true;
  }

  getDomain(): string {
    return this.domain;
  }
}
