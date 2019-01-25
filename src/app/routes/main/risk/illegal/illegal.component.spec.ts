import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllegalComponent } from './illegal.component';

describe('IllegalComponent', () => {
  let component: IllegalComponent;
  let fixture: ComponentFixture<IllegalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IllegalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IllegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
