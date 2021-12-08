import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablularListComponent } from './tablular-list.component';

describe('TablularListComponent', () => {
  let component: TablularListComponent;
  let fixture: ComponentFixture<TablularListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablularListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablularListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
