'use strict';

export class ElementPicker {
  private hoverColor: string;
  private borderStyle: string;
  private hoverCb: (event: Element) => void;
  private lastElem: HTMLElement | null;
  private lastBackgroundColor: string | null;
  private lastBorder: string | null;
  private isActive: boolean;
  constructor(
    hoverCb: (elem: Element) => void,
    hoverColor: string = 'rgba(195, 63, 182, 0.3)',
    borderStyle: string = 'thin solid rgba(222, 18, 99, 0.8)'
  ) {
    this.hoverColor = hoverColor;
    this.borderStyle = borderStyle;
    this.hoverCb = hoverCb;
    this.lastElem = null;
    this.lastBackgroundColor = null;
    this.lastBorder = null;
    this.isActive = false;
  }

  resetElement = (): void => {
    if (this.lastElem) {
      this.lastElem.style.backgroundColor = this.lastBackgroundColor;
      this.lastElem.style.border = this.lastBorder;
    }
  };

  onMouseEvent = (event: Event): void => {
    const e: Event = event || window.event;
    const target: EventTarget | null = e.target || e.srcElement;
    if (target && target instanceof HTMLElement) {
      if (target === this.lastElem) {
        return;
      }
      this.resetElement();
      this.hoverCb(target);
      this.lastElem = target;
      this.lastBackgroundColor = target.style.backgroundColor;
      this.lastBorder = target.style.border;
      target.style.backgroundColor = this.hoverColor;
      target.style.border = this.borderStyle;
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
    document.addEventListener(
      'click',
      () => {
        this.deactivate();
      },
      false
    );
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.deactivate();
      }
    });
    document.addEventListener('mousemove', this.onMouseEvent, false);
    document.body.style.cursor = 'crosshair';
    this.isActive = true;
  };

  deactivate = (): void => {
    document.removeEventListener('click', () => {}, false);
    document.removeEventListener('mousemove', this.onMouseEvent, false);
    this.resetElement();
    this.lastElem = null;
    this.lastBackgroundColor = null;
    document.body.style.cursor = 'auto';
    this.isActive = false;
  };
}
