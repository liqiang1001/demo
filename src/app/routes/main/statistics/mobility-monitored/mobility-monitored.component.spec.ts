import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilityMonitoredComponent } from './mobility-monitored.component';

describe('MobilityMonitoredComponent', () => {
  let component: MobilityMonitoredComponent;
  let fixture: ComponentFixture<MobilityMonitoredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilityMonitoredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilityMonitoredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
