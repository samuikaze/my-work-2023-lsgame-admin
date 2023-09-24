import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPlatformManagementComponent } from './product-platform-management.component';

describe('ProductPlatformManagementComponent', () => {
  let component: ProductPlatformManagementComponent;
  let fixture: ComponentFixture<ProductPlatformManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ProductPlatformManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPlatformManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
