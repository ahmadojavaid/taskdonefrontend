import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeBookingsComponent } from './make-bookings.component';

describe('MakeBookingsComponent', () => {
  let component: MakeBookingsComponent;
  let fixture: ComponentFixture<MakeBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
