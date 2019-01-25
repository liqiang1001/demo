import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsginfoComponent } from './msginfo.component';

describe('MsginfoComponent', () => {
  let component: MsginfoComponent;
  let fixture: ComponentFixture<MsginfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsginfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsginfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
