import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkallotDetailComponent } from './workallot-detail.component';

describe('WorkallotDetailComponent', () => {
  let component: WorkallotDetailComponent;
  let fixture: ComponentFixture<WorkallotDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkallotDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkallotDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
