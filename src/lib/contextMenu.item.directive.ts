import { ContextMenuComponent } from './contextMenu.component';
import { Directive, Input, Output, EventEmitter, TemplateRef, ElementRef } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';

@Directive({
  /* tslint:disable:directive-selector-type */
  selector: '[contextMenuItem]',
  /* tslint:enable:directive-selector-type */
})
export class ContextMenuItemDirective implements Highlightable {
  @Input() public subMenu: ContextMenuComponent;
  @Input() public divider = false;
  @Input() public enabled: boolean | ((item: any) => boolean) = true;
  @Input() public passive = false;
  @Input() public visible: boolean | ((item: any) => boolean) = true;
  @Output() public execute: EventEmitter<{ event: Event, item: any }> = new EventEmitter();

  public currentItem: any;
  public isActive = false;
  public get disabled() {
    return this.passive ||
      this.divider ||
      !this.evaluateIfFunction(this.enabled, this.currentItem);
  }

  constructor(public template: TemplateRef<{ item: any }>, public elementRef: ElementRef) { }

  public evaluateIfFunction(value: any, item: any): any {
    if (value instanceof Function) {
      return value(item);
    }
    return value;
  }

  public setActiveStyles(): void {
    this.isActive = true;
  }
  public setInactiveStyles(): void {
    this.isActive = false;
  }

  public triggerExecute(item: any, $event?: MouseEvent): void {
    if (!this.evaluateIfFunction(this.enabled, item)) {
      return;
    }
    this.execute.emit({ event: $event, item });
  }
}