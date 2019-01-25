import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyUserComponent } from './edit-company-user.component';

describe('EditCompanyUserComponent', () => {
  let component: EditCompanyUserComponent;
  let fixture: ComponentFixture<EditCompanyUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompanyUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
