import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatWorkallotComponent } from './creat-workallot.component';

describe('CreatWorkallotComponent', () => {
  let component: CreatWorkallotComponent;
  let fixture: ComponentFixture<CreatWorkallotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatWorkallotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatWorkallotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
