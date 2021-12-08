import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBoardNameComponent } from './edit-board-name.component';

describe('EditBoardNameComponent', () => {
  let component: EditBoardNameComponent;
  let fixture: ComponentFixture<EditBoardNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBoardNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBoardNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
