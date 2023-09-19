import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseNavigatorComponent } from './base-navigator.component';

describe('BaseNavigatorComponent', () => {
  let component: BaseNavigatorComponent;
  let fixture: ComponentFixture<BaseNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BaseNavigatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
