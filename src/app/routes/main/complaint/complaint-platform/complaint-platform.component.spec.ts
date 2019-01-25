import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintPlatformComponent } from './complaint-platform.component';

describe('ComplaintPlatformComponent', () => {
  let component: ComplaintPlatformComponent;
  let fixture: ComponentFixture<ComplaintPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
