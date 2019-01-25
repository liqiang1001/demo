import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGovernUserComponent } from './add-govern-user.component';

describe('AddGovernUserComponent', () => {
  let component: AddGovernUserComponent;
  let fixture: ComponentFixture<AddGovernUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGovernUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGovernUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
