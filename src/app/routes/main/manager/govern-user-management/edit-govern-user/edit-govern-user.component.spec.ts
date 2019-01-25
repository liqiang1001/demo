import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGovernUserComponent } from './edit-govern-user.component';

describe('EditGovernUserComponent', () => {
  let component: EditGovernUserComponent;
  let fixture: ComponentFixture<EditGovernUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGovernUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGovernUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
