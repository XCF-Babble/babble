'use strict';

export class ElementPicker {
  private hoverColor: string;
  private hoverCb: (event: Element) => void;
  private lastElem: HTMLElement | null;
  private lastBackgroundColor: string | null;
  constructor(
    hoverCb: (elem: Element) => void,
    hoverColor: string = 'rgba(195, 63, 182, 0.3)'
  ) {
    this.hoverColor = hoverColor;
    this.hoverCb = hoverCb;
    this.lastElem = null;
    this.lastBackgroundColor = null;
  }

  resetColor = (): void => {
    if (this.lastElem) {
      this.lastElem.style.backgroundColor = this.lastBackgroundColor;
    }
  };

  onMouseEvent = (event: Event): void => {
    const e: Event = event || window.event;
    const target: EventTarget | null = e.target || e.srcElement;
    this.resetColor();
    if (target && target instanceof HTMLElement) {
      this.hoverCb(target);
      this.lastElem = target;
      this.lastBackgroundColor = target.style.backgroundColor;
      target.style.backgroundColor = this.hoverColor;
    }
  };

  activate = (): void => {
    document.addEventListener('click', () => {}, false);
    document.addEventListener('mousemove', this.onMouseEvent, false);
    document.body.style.cursor = 'crosshair';
  };

  deactivate = (): void => {
    document.removeEventListener('click', () => {}, false);
    document.removeEventListener('mousemove', this.onMouseEvent, false);
    this.resetColor();
    this.lastElem = null;
    this.lastBackgroundColor = null;
    document.body.style.cursor = 'auto';
  };
}
