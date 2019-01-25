import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveManagementComponent } from './approve-management.component';

describe('ApproveManagementComponent', () => {
  let component: ApproveManagementComponent;
  let fixture: ComponentFixture<ApproveManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
