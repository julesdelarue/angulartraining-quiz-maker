import {Component, ElementRef,  Input,} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IOption {
  id: number | string;
  selected?: boolean;
  active?: boolean;
  label: string;
}

export type DropdownOption<T> = T & IOption;

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [CommonModule],
  template : `<ng-content></ng-content>`
})
export class DropdownItemComponent<T> {

  @Input() value:DropdownOption<T> | undefined

  element: HTMLElement;

  constructor(el: ElementRef) {
    this.element = el.nativeElement;
  }

  /**
   * Center the selected item to the view
   */
  scroll() {
    this.element.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "start"
    })
  }
}
