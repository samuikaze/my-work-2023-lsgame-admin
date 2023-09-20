import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitManagementComponent } from './recruit-management.component';

describe('RecruitManagementComponent', () => {
  let component: RecruitManagementComponent;
  let fixture: ComponentFixture<RecruitManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RecruitManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
