import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCookingListComponent } from './generate-cooking-list.component';

describe('GenerateCookingListComponent', () => {
  let component: GenerateCookingListComponent;
  let fixture: ComponentFixture<GenerateCookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateCookingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateCookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
