import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEnterUserComponent } from './order-enter-user.component';

describe('OrderEnterUserComponent', () => {
  let component: OrderEnterUserComponent;
  let fixture: ComponentFixture<OrderEnterUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEnterUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEnterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
