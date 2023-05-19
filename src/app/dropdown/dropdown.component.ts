import {
  Component,
  ElementRef, forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Category} from "../data.models";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, filter, fromEvent, Subscription, tap} from "rxjs";
import {HighlightPipe} from "../highlight.pipe";

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
export class DropdownComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {

  // Un changement est défini par un clic sur un des éléments de la liste, ou null si l'utilisateur est en train d'écrire
  private _onChange = (_: any) => { };
  private _onTouched = () => { };
  private _disabled = false;

  @ViewChild('optionContainer') optionContainer!: ElementRef;
  @ViewChild('input') inputContainer!: ElementRef;

  selectedOption?: Category;

  isOpen = false;

  // FIXME check if we can avoid null for async inputs
  // TODO Generic input type
  @Input()
  options: Category[] | null = []
  filteredOptions: Category[] = []
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
    this.term = value
    value === null || value === undefined || value.length === 0 ?
      this.resetOptions() :
      this.filteredOptions = this.options?.filter(option => option.name.toLowerCase().includes(value.toLowerCase())) ?? []
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

  select(option: Category) {
    this.selectedOption = option;
    this.searchControl.setValue(option.name, {emitEvent:false, onlySelf:true})
    this.term = option.name
    this.close()
    this._onChange(option)
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
}
