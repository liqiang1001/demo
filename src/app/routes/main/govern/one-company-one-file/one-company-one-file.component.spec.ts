import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneCompanyOneFileComponent } from './one-company-one-file.component';

describe('OneCompanyOneFileComponent', () => {
  let component: OneCompanyOneFileComponent;
  let fixture: ComponentFixture<OneCompanyOneFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneCompanyOneFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneCompanyOneFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
