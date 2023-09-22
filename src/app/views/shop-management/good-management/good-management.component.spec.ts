import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodManagementComponent } from './good-management.component';

describe('GoodManagementComponent', () => {
  let component: GoodManagementComponent;
  let fixture: ComponentFixture<GoodManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GoodManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
