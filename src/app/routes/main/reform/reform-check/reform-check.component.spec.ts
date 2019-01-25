import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReformCheckComponent } from './reform-check.component';

describe('ReformCheckComponent', () => {
  let component: ReformCheckComponent;
  let fixture: ComponentFixture<ReformCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReformCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReformCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
