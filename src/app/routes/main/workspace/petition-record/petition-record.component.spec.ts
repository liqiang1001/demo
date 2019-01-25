import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetitionRecordComponent } from './petition-record.component';

describe('PetitionRecordComponent', () => {
  let component: PetitionRecordComponent;
  let fixture: ComponentFixture<PetitionRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetitionRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetitionRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
