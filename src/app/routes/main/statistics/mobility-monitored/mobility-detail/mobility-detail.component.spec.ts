import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilityDetailComponent } from './mobility-detail.component';

describe('MobilityDetailComponent', () => {
  let component: MobilityDetailComponent;
  let fixture: ComponentFixture<MobilityDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilityDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
