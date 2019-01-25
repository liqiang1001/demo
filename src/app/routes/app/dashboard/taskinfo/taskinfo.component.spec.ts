import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskinfoComponent } from './taskinfo.component';

describe('TaskinfoComponent', () => {
  let component: TaskinfoComponent;
  let fixture: ComponentFixture<TaskinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
