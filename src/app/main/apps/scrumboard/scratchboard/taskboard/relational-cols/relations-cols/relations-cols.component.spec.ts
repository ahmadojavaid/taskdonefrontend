import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationsColsComponent } from './relations-cols.component';

describe('RelationsColsComponent', () => {
  let component: RelationsColsComponent;
  let fixture: ComponentFixture<RelationsColsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationsColsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationsColsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
