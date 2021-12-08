import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScratchboardComponent } from './scratchboard.component';

describe('ScratchboardComponent', () => {
  let component: ScratchboardComponent;
  let fixture: ComponentFixture<ScratchboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScratchboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScratchboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
