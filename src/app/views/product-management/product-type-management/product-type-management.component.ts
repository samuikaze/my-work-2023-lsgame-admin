import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductType, AsProductTypeType, ProductType, ProductTypeManagementStatuses } from './product-type-management';
import { Modals } from 'src/app/commons/abstracts/common';
import { CommonService } from 'src/app/services/common-service/common.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';
import { AppEnvironmentService } from 'src/app/services/app-environment-service/app-environment.service';
import { RequestService } from 'src/app/services/request-service/request.service';
import Modal from 'bootstrap/js/dist/modal';
import { ApiServiceTypes } from 'src/app/enums/api-service-types';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-type-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-type-management.component.html',
  styleUrls: ['./product-type-management.component.scss']
})
export class ProductTypeManagementComponent implements OnInit {

  public addProductType: AddProductType = {
    productTypeName: '',
  };
  public editProductType: ProductType = {
    productTypeId: 0,
    productTypeName: ''
  };
  public deleteProductType: ProductType = {
    productTypeId: 0,
    productTypeName: ''
  };
  public productTypeList: Array<ProductType> = [];
  public modals: Modals = {};
  public statuses: ProductTypeManagementStatuses = {
    retrieving: false,
    creating: false,
    updating: false,
    deleting: false
  };
  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private appEnvironmentService: AppEnvironmentService,
    private requestService: RequestService
  ) {}

  async ngOnInit(): Promise<void> {
    this.commonService.setTitle('作品分類管理');
    this.breadcrumbService.setBreadcrumb({
      title: '作品分類管理',
      uri: '/product/type',
    });
    this.initialModals();
    await this.getProductTypeList();
  }

  /**
   * 初始化所有彈出視窗
   */
  private initialModals(): void {
    this.modals['addProductTypeModal'] = new Modal('#addProductType');
    this.modals['editProductTypeModal'] = new Modal('#editProductType');
    this.modals['confirmDelete']  = new Modal('#confirmDelete');
  }

  /**
   * 取得作品分類清單
   */
  private async getProductTypeList(): Promise<void> {
    this.productTypeList = [];

    this.statuses.retrieving = true;

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common);
    const uri = `${baseUri}/product/types`;
    this.requestService.get<Array<ProductType>>(uri)
      .subscribe({
        next: (response) => {
          this.productTypeList = response;
          this.statuses.retrieving = false;
        },
        error: (errors: HttpErrorResponse) => {
          this.requestService.requestFailedHandler(errors);
          this.statuses.retrieving = false;
        }
      });
  }

  /**
   * 新增作品分類
   */
  public async fireCreateProductType(): Promise<void> {
    if (!this.canFireCreateProductType()) {
      return;
    }

    this.statuses.creating = true;

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common);
    const url = `${baseUri}/product/type`;
    const body = this.addProductType;
    this.requestService.post<ProductType>(url, body).subscribe({
      next: () => {
        this.getProductTypeList();
        this.clearAddProductTypeForm();
        this.operationModal('addProductTypeModal', 'close');
        this.statuses.creating = false;
      },
      error: (errors: HttpErrorResponse) => {
        this.requestService.requestFailedHandler(errors);
        this.statuses.creating = false;
      }
    });
  }

  /**
   * 編輯作品分類
   */
  public async fireEditProductType(): Promise<void> {
    if (!this.canFireEditProductType()) {
      return;
    }

    this.statuses.updating = true;

    this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common)
      .then((baseUri) => {
        const uri = `${baseUri}/product/type`;
        this.requestService.patch<ProductType>(uri, this.editProductType)
          .subscribe({
            next: () => {
              this.getProductTypeList();
              this.clearEditProductTypeForm();
              this.operationModal('editProductTypeModal', 'close');
              this.statuses.updating = false;

            },
            error: (errors: HttpErrorResponse) => {
              this.requestService.requestFailedHandler(errors);
              this.statuses.updating = false;
            }
          });
      });
  }

  /**
   * 刪除作品分類
   */
  public async fireDeleteProductType(): Promise<void> {
    this.statuses.deleting = true;

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common)
    const uri = `${baseUri}/product/type`;
    this.requestService.delete<number>(uri, this.deleteProductType)
      .subscribe({
        next: () => {
          this.getProductTypeList();
          this.operationModal('confirmDelete', 'close');
          this.statuses.deleting = false;

        },
        error: (errors: HttpErrorResponse) => {
          this.requestService.requestFailedHandler(errors);
          this.statuses.deleting = false;
        }
      });
  }

  /**
   * 檢查是否可以執行作品分類新增操作
   * @returns 是否可以執行作品分類新增操作
   */
  public canFireCreateProductType(): boolean {
    return !this.statuses.creating &&
      this.addProductType.productTypeName != null &&
      this.addProductType.productTypeName.length > 0;
  }

  /**
   * 檢查是否可以編輯作品分類
   * @returns 是否可以編輯作品分類
   */
  public canFireEditProductType(): boolean {
    return !this.statuses.updating &&
      this.editProductType.productTypeId != null &&
      this.editProductType.productTypeId > 0 &&
      this.editProductType.productTypeName != null &&
      this.editProductType.productTypeName.length > 0;
  }

  /**
   * 將指定的作品分類設定到編輯表單中
   * @param productTypeId 作品分類 PK
   */
  public setSpecificProductTypeData(productTypeId: number, as: AsProductTypeType): void {
    const productType = this.productTypeList.filter(productType => productType.productTypeId === productTypeId);
    if (productType.length === 0) {
      alert('找不到該筆作品分類');
    }

    switch (as) {
      case 'update':
        this.editProductType = this.commonService.deepCloneObject(productType[0]);
        this.operationModal('editProductTypeModal', 'open');
        break;
      case 'delete':
        this.deleteProductType = this.commonService.deepCloneObject(productType[0]);
        this.operationModal('confirmDelete', 'open');
        break;
    }
  }

  /**
   * 清除新增作品分類的表單資料
   */
  public clearAddProductTypeForm(): void {
    this.addProductType.productTypeName = '';

    this.operationModal('addProductTypeModal', 'close');
  }

  /**
   * 清除編輯作品分類的表單資料
   */
  public clearEditProductTypeForm(): void {
    this.editProductType.productTypeId = 0;
    this.editProductType.productTypeName = '';
  }

  /**
   * 操作指定 Modal
   * @param modal 目標 Modal 名稱
   * @param action 操作
   */
  public operationModal(modal: string, action: 'open' | 'close'): void {
    if (this.modals[modal] !== undefined) {
      switch (action) {
        case 'open':
          this.modals[modal].show();
          break;
        case 'close':
          this.modals[modal].hide();
          break;
      }
    }
  }
}
