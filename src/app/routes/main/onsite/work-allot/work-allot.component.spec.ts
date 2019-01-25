import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAllotComponent } from './work-allot.component';

describe('WorkAllotComponent', () => {
  let component: WorkAllotComponent;
  let fixture: ComponentFixture<WorkAllotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkAllotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkAllotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
