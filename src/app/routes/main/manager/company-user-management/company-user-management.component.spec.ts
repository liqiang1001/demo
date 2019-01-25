import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUserManagementComponent } from './company-user-management.component';

describe('CompanyUserManagementComponent', () => {
  let component: CompanyUserManagementComponent;
  let fixture: ComponentFixture<CompanyUserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyUserManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
