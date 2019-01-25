import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterinfoComponent } from './enterinfo.component';

describe('EnterinfoComponent', () => {
  let component: EnterinfoComponent;
  let fixture: ComponentFixture<EnterinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
