import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterballComponent } from './waterball.component';

describe('WaterballComponent', () => {
  let component: WaterballComponent;
  let fixture: ComponentFixture<WaterballComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterballComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
