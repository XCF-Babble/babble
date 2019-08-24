'use strict';

export class ElementPicker {
  private hoverColor: string;
  private hoverCb: (event: Element) => void;
  private lastElem: HTMLElement | null;
  private lastBackgroundColor: string | null;
  private isActive: boolean;
  constructor(
    hoverCb: (elem: Element) => void,
    hoverColor: string = 'rgba(195, 63, 182, 0.3)'
  ) {
    this.hoverColor = hoverColor;
    this.hoverCb = hoverCb;
    this.lastElem = null;
    this.lastBackgroundColor = null;
    this.isActive = false;
  }

  resetColor = (): void => {
    if (this.lastElem) {
      this.lastElem.style.backgroundColor = this.lastBackgroundColor;
    }
  };

  onMouseEvent = (event: Event): void => {
    const e: Event = event || window.event;
    const target: EventTarget | null = e.target || e.srcElement;
    if (target && target instanceof HTMLElement) {
      if (target === this.lastElem) {
        return;
      }
      this.resetColor();
      this.hoverCb(target);
      this.lastElem = target;
      this.lastBackgroundColor = target.style.backgroundColor;
      target.style.backgroundColor = this.hoverColor;
    }
  };

  toggle = (): void => {
    if (this.isActive) {
      this.deactivate();
      this.isActive = false;
    } else {
      this.activate();
      this.isActive = true;
    }
  };

  activate = (): void => {
    document.addEventListener('click', () => {}, false);
    document.addEventListener('mousemove', this.onMouseEvent, false);
    document.body.style.cursor = 'crosshair';
    this.isActive = true;
  };

  deactivate = (): void => {
    document.removeEventListener('click', () => {}, false);
    document.removeEventListener('mousemove', this.onMouseEvent, false);
    this.resetColor();
    this.lastElem = null;
    this.lastBackgroundColor = null;
    document.body.style.cursor = 'auto';
    this.isActive = false;
  };
}
