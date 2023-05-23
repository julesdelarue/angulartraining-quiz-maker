import {
  Component,
  ElementRef, forwardRef, HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, QueryList,
  SimpleChanges,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, filter, fromEvent, Subscription} from "rxjs";
import {HighlightPipe} from "../highlight.pipe";
import {DropdownItemComponent} from "./dropdown-item/dropdown-item.component";

export interface IOption {
  id: number | string;
  active?: boolean;
  label: string;
}

export type DropdownOption<T> = T & IOption;

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HighlightPipe, DropdownItemComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    }
  ],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownComponent<T> implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {

  @Input() options: DropdownOption<T>[] = []
  @ViewChildren(DropdownItemComponent) items?: QueryList<DropdownItemComponent<T>>;

  dropdownContainer: ElementRef;

  // Un changement est défini par un clic sur un des éléments de la liste, ou null si l'utilisateur est en train d'écrire
  private _onChange!: (_: any) => void;
  private _onTouched!: () => void;
  private _disabled = false;

  selectedOption?: DropdownOption<T>;
  activeOption?: DropdownOption<T>;
  filteredOptions: DropdownOption<T>[] = []

  isOpen = false;

  searchControl:FormControl<string> = new FormControl();
  term: string | undefined;

  sink:Subscription[] = []

  constructor(el: ElementRef) {
    this.dropdownContainer = el;
  }

  ngOnInit(): void {

    const searchControlSubs = this.searchControl.valueChanges.pipe(
      debounceTime(150), filter(e => e !== null))
      .subscribe(value => this.inputChanged(value))

    const clickEventSubs = fromEvent(document, 'click')
      .pipe(filter(e => !this.dropdownContainer.nativeElement.contains(e.target)))
      .subscribe(() => this.close());

    this.sink.push(clickEventSubs)
    this.sink.push(searchControlSubs)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filteredOptions = [...this.options]
    }
  }

  ngOnDestroy(): void {
    this.sink.forEach(subs => subs.unsubscribe())
  }

  select(option: DropdownOption<T>) {
    this.selectedOption = option;
    this.searchControl.setValue(option.label, {emitEvent: false})
    this.term = undefined
    this._onChange(option)
    this.close()
  }

  /**
   * Se déclenche à chaque changement de valeur de l'input
   * @param value
   */
  inputChanged(value: string): void {
    if (!this.isOpen) this.open()
    // Un changement implique la suppression de la sélection déjà faite
    this.selectedOption = undefined;
    this._onChange(null)

    this.term = value
    value ? this.updateOptions(value) : this.resetOptions()
  }
  updateOptions(value:string):void{
    this.filteredOptions = this.options?.filter(option => option.label.toLowerCase().includes(value.toLowerCase())) ?? []
  }

  resetOptions() {
    this.filteredOptions = this.options?.slice() ?? [];
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false
  }

  trackById(index: number, item: DropdownOption<T>) {
    return item.id;
  }

  /**
   * ControlValueAccessor mapping
   */
  registerOnChange(fn: any): void {
    this._onChange = fn
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    // FIXME add disable feature
    this._disabled = isDisabled
  }

  writeValue = (obj: DropdownOption<T> | null): void => {
    this.selectedOption = this.options?.find(e => e.id === obj?.id)
    if(this.selectedOption === undefined) this.searchControl.reset()
  }

  /**
   * Minimal keyboard interactions
   * https://www.w3.org/TR/DOM-Level-3-Events-key/#named-key-attribute-values
   */
  @HostListener('keydown.arrowdown', ['$event'])
  handleArrowDownKey($event: KeyboardEvent) {
    $event.preventDefault()
    if (this.activeOption) {
      const currentIndex = this.filteredOptions.indexOf(this.activeOption ?? this.filteredOptions[0])
      this.active(this.filteredOptions[(currentIndex + 1) % this.filteredOptions.length], true)
    } else {
      this.active(this.filteredOptions[0], true)
    }
  }

  @HostListener('keydown.arrowup', ['$event'])
  handleArrowUpKey($event: KeyboardEvent) {
    $event.preventDefault()
    if (this.activeOption) {
      const currentIndex = this.filteredOptions.indexOf(this.activeOption)
      this.active(this.filteredOptions[(currentIndex - 1 + this.filteredOptions.length) % (this.filteredOptions.length)], true)
    } else {
      this.active(this.filteredOptions[this.filteredOptions.length - 1], true)
    }
  }

  @HostListener('keydown.enter', ['$event'])
  handleEnterKey($event: KeyboardEvent) {
    $event.preventDefault()
    if (this.activeOption)
      this.select(this.activeOption)
  }

  active(option: T & IOption, scrollTo = false) {
    const previousAction = this.activeOption;
    if(previousAction) previousAction.active = false

    this.activeOption = option
    this.activeOption.active = true

    if (scrollTo)
      this.items?.find(e => e.value === this.activeOption)?.scroll()
  }
}
