import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClueSubmissionDetailComponent } from './clue-submission-detail.component';

describe('ClueSubmissionDetailComponent', () => {
  let component: ClueSubmissionDetailComponent;
  let fixture: ComponentFixture<ClueSubmissionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClueSubmissionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClueSubmissionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
