import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent<string>;
  let fixture: ComponentFixture<DropdownComponent<string>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DropdownComponent]
    });
    fixture = TestBed.createComponent(DropdownComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
