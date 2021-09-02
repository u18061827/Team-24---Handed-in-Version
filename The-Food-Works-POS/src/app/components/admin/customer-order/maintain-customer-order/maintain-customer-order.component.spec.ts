import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainCustomerOrderComponent } from './maintain-customer-order.component';

describe('MaintainCustomerOrderComponent', () => {
  let component: MaintainCustomerOrderComponent;
  let fixture: ComponentFixture<MaintainCustomerOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainCustomerOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainCustomerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
