import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSelectProductComponent } from './order-select-product.component';

describe('OrderSelectProductComponent', () => {
  let component: OrderSelectProductComponent;
  let fixture: ComponentFixture<OrderSelectProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSelectProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSelectProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
