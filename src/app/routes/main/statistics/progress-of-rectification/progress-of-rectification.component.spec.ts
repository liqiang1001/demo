import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressOfRectificationComponent } from './progress-of-rectification.component';

describe('ProgressOfRectificationComponent', () => {
  let component: ProgressOfRectificationComponent;
  let fixture: ComponentFixture<ProgressOfRectificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressOfRectificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressOfRectificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
