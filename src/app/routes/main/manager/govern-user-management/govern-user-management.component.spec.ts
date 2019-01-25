import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernUserManagementComponent } from './govern-user-management.component';

describe('GovernUserManagementComponent', () => {
  let component: GovernUserManagementComponent;
  let fixture: ComponentFixture<GovernUserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernUserManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
