import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRegistrationComponent } from './guest-registration.component';

describe('GuestRegistrationComponent', () => {
  let component: GuestRegistrationComponent;
  let fixture: ComponentFixture<GuestRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
