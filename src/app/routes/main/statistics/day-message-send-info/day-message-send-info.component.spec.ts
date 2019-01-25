import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayMessageSendInfoComponent } from './day-message-send-info.component';

describe('DayMessageSendInfoComponent', () => {
  let component: DayMessageSendInfoComponent;
  let fixture: ComponentFixture<DayMessageSendInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayMessageSendInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayMessageSendInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
