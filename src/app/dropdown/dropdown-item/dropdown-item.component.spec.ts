import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownItemComponent } from './dropdown-item.component';

describe('DropdownItemComponent', () => {
  let component: DropdownItemComponent<string>;
  let fixture: ComponentFixture<DropdownItemComponent<string>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DropdownItemComponent]
    });
    fixture = TestBed.createComponent(DropdownItemComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
