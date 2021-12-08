import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePersonComponent } from './choose-person.component';

describe('ChoosePersonComponent', () => {
  let component: ChoosePersonComponent;
  let fixture: ComponentFixture<ChoosePersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
