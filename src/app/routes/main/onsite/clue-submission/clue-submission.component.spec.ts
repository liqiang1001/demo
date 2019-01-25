import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClueSubmissionComponent } from './clue-submission.component';

describe('ClueSubmissionComponent', () => {
  let component: ClueSubmissionComponent;
  let fixture: ComponentFixture<ClueSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClueSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClueSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
