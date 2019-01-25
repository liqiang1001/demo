import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyUserComponent } from './add-company-user.component';

describe('AddCompanyUserComponent', () => {
  let component: AddCompanyUserComponent;
  let fixture: ComponentFixture<AddCompanyUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
