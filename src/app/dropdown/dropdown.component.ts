import {
  Component,
  ElementRef, forwardRef, HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, filter, fromEvent, Subscription} from "rxjs";
import {HighlightPipe} from "../highlight.pipe";


export interface IDisplayable{
  id:number|string;
  label:string;
}
export type DropdownOption<T> = T & IDisplayable;

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HighlightPipe],
  providers:[
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


  // Un changement est défini par un clic sur un des éléments de la liste, ou null si l'utilisateur est en train d'écrire
  private _onChange = (_: any) => { };
  private _onTouched = () => { };
  private _disabled = false;

  @ViewChild('optionContainer') optionContainer!: ElementRef;
  @ViewChild('input') inputContainer!: ElementRef;

  selectedOption?: DropdownOption<T>;

  isOpen = false;

  // FIXME check if we can avoid null for async inputs
  @Input()
  options: DropdownOption<T>[] | null = []
  filteredOptions: DropdownOption<T>[] = []
  searchControl = new FormControl();
  searchControlSubs: Subscription | undefined;
  term: string | undefined;

  ngOnInit(): void {

    this.searchControlSubs = this.searchControl.valueChanges.pipe(
      debounceTime(250))
      .subscribe(value => this.valueChanged(value))

    // TODO remember subscription pour destroy
    fromEvent(document, 'click')
      .pipe(
        filter(e =>
          // TODO extract method
          this.optionContainer !== undefined && !this.optionContainer.nativeElement.contains(e.target) &&
          this.inputContainer !== undefined && !this.inputContainer.nativeElement.contains(e.target)
        )
      )
      .subscribe(() => this.close());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filteredOptions = [...this.options ?? []]
    }
  }

  ngOnDestroy(): void {
    if (this.searchControlSubs) {
      this.searchControlSubs.unsubscribe()
    }
  }

  /**
   * Se déclenche à chaque changement de valeur de l'input
   * @param value
   */
  valueChanged(value: string): void {
    // Un changement implique la suppression de la sélection déjà faite
    if(this.selectedOption){
      this.selectedOption = undefined;
      this._onChange(null)
    }

    // TODO Faire en sorte que la fonction de tri soit définir par l'appelant ??
    this.term = value
    value === null || value === undefined || value.length === 0 ?
      this.resetOptions() :
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

  select(option: DropdownOption<T>) {
    this.selectedOption = option;
    this.searchControl.setValue(option.label, {emitEvent:false, onlySelf:true})
    this.term = option.label
    this.close()
    this._onChange(option)
  }

  trackById(index:number, item:DropdownOption<T>) {
    return item.id;
  }

  /**
   * ControlValueAccessor implementation
   */

  registerOnChange(fn: any): void {
    // https://angular.io/api/forms/ControlValueAccessor#registeronchange
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // https://angular.io/api/forms/ControlValueAccessor#registerontouched
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // https://angular.io/api/forms/ControlValueAccessor#setdisabledstate
    this._disabled = isDisabled;
    // TODO disable feature
    console.error("Should disable the dropdown:",isDisabled)
  }

  writeValue(obj: any): void {
    // TODO better implementation with more checks
    if(obj === undefined || obj === null){
      this.selectedOption = undefined
    }else{
      this.selectedOption = this.options?.find(e => e.id === obj['id'])
    }
  }

  /**
   * Gestion des touches du clavier
   * https://www.w3.org/TR/DOM-Level-3-Events-key/#named-key-attribute-values
   */
  @HostListener('keydown.arrowdown', ['$event'])
  handleArrowDownKey($event: KeyboardEvent) {
    console.error($event)
  }

  @HostListener('keydown.arrowup', ['$event'])
  handleArrowUpKey($event: KeyboardEvent) {
    console.error("up")
  }

  @HostListener('keydown.enter', ['$event'])
  handleEnterKey($event: KeyboardEvent) {
    console.error("up")
  }

}
