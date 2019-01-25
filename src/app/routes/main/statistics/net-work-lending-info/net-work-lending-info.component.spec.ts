import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetWorkLendingInfoComponent } from './net-work-lending-info.component';

describe('NetWorkLendingInfoComponent', () => {
  let component: NetWorkLendingInfoComponent;
  let fixture: ComponentFixture<NetWorkLendingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetWorkLendingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetWorkLendingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
