import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckRedultDetailComponent } from './check-redult-detail.component';

describe('CheckRedultDetailComponent', () => {
  let component: CheckRedultDetailComponent;
  let fixture: ComponentFixture<CheckRedultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckRedultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckRedultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
