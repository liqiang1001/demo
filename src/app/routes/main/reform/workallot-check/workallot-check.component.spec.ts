import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkallotCheckComponent } from './workallot-check.component';

describe('WorkallotCheckComponent', () => {
  let component: WorkallotCheckComponent;
  let fixture: ComponentFixture<WorkallotCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkallotCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkallotCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
