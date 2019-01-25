import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFootComponent } from './login-foot.component';

describe('LoginFootComponent', () => {
  let component: LoginFootComponent;
  let fixture: ComponentFixture<LoginFootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginFootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
