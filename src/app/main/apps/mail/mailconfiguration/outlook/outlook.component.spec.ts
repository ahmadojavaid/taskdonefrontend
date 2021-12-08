import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlookComponent } from './outlook.component';

describe('OutlookComponent', () => {
  let component: OutlookComponent;
  let fixture: ComponentFixture<OutlookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
