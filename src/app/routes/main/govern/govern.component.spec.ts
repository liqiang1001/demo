import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernComponent } from './govern.component';

describe('GovernComponent', () => {
  let component: GovernComponent;
  let fixture: ComponentFixture<GovernComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
