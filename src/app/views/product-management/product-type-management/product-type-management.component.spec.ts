import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeManagementComponent } from './product-type-management.component';

describe('ProductTypeManagementComponent', () => {
  let component: ProductTypeManagementComponent;
  let fixture: ComponentFixture<ProductTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ProductTypeManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
