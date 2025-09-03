import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChantComponent } from './add-chant.component';

describe('AddChantComponent', () => {
  let component: AddChantComponent;
  let fixture: ComponentFixture<AddChantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddChantComponent]
    });
    fixture = TestBed.createComponent(AddChantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
