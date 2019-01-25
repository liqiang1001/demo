import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TackManagementsComponent } from './tack-managements.component';

describe('TackManagementsComponent', () => {
  let component: TackManagementsComponent;
  let fixture: ComponentFixture<TackManagementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TackManagementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TackManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
