import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCustomerOrderComponent } from './update-customer-order.component';

describe('UpdateCustomerOrderComponent', () => {
  let component: UpdateCustomerOrderComponent;
  let fixture: ComponentFixture<UpdateCustomerOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCustomerOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCustomerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
