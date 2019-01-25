import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDailyComponent } from './complaint-daily.component';

describe('ComplaintDailyComponent', () => {
  let component: ComplaintDailyComponent;
  let fixture: ComponentFixture<ComplaintDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
