import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductPlatform, AsProductPlatformType, ProductPlatform, ProductPlatformManagementStatuses } from './product-platform-management';
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
  selector: 'app-product-platform-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-platform-management.component.html',
  styleUrls: ['./product-platform-management.component.scss']
})
export class ProductPlatformManagementComponent implements OnInit {
  public addProductPlatform: AddProductPlatform = {
    productPlatformName: '',
  };
  public editProductPlatform: ProductPlatform = {
    productPlatformId: 0,
    productPlatformName: ''
  };
  public deleteProductPlatform: ProductPlatform = {
    productPlatformId: 0,
    productPlatformName: ''
  };
  public productPlatformList: Array<ProductPlatform> = [];
  public modals: Modals = {};
  public statuses: ProductPlatformManagementStatuses = {
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
    this.commonService.setTitle('作品平台管理');
    this.breadcrumbService.setBreadcrumb({
      title: '作品平台管理',
      uri: '/product/platform',
    });
    this.initialModals();
    await this.getProductPlatformList();
  }

  /**
   * 初始化所有彈出視窗
   */
  private initialModals(): void {
    this.modals['addProductPlatformModal'] = new Modal('#addProductPlatform');
    this.modals['editProductPlatformModal'] = new Modal('#editProductPlatform');
    this.modals['confirmDelete']  = new Modal('#confirmDelete');
  }

  /**
   * 取得作品平台清單
   */
  private async getProductPlatformList(): Promise<void> {
    this.productPlatformList = [];

    this.statuses.retrieving = true;

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common);
    const uri = `${baseUri}/product/platforms`;
    this.requestService.get<Array<ProductPlatform>>(uri)
      .subscribe({
        next: (response) => {
          this.productPlatformList = response;
          this.statuses.retrieving = false;
        },
        error: (errors: HttpErrorResponse) => {
          this.requestService.requestFailedHandler(errors);
          this.statuses.retrieving = false;
        }
      });
  }

  /**
   * 新增作品平台
   */
  public async fireCreateProductPlatform(): Promise<void> {
    if (!this.canFireCreateProductPlatform()) {
      return;
    }

    this.statuses.creating = true;

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common);
    const url = `${baseUri}/product/platform`;
    const body = this.addProductPlatform;
    this.requestService.post<ProductPlatform>(url, body).subscribe({
      next: () => {
        this.getProductPlatformList();
        this.clearAddProductPlatformForm();
        this.operationModal('addProductPlatformModal', 'close');
        this.statuses.creating = false;
      },
      error: (errors: HttpErrorResponse) => {
        this.requestService.requestFailedHandler(errors);
        this.statuses.creating = false;
      }
    });
  }

  /**
   * 編輯作品平台
   */
  public async fireEditProductPlatform(): Promise<void> {
    if (!this.canFireEditProductPlatform()) {
      return;
    }

    this.statuses.updating = true;

    this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common)
      .then((baseUri) => {
        const uri = `${baseUri}/product/platform`;
        this.requestService.patch<ProductPlatform>(uri, this.editProductPlatform)
          .subscribe({
            next: () => {
              this.getProductPlatformList();
              this.clearEditProductPlatformForm();
              this.operationModal('editProductPlatformModal', 'close');
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
   * 刪除作品平台
   */
  public async fireDeleteProductPlatform(): Promise<void> {
    this.statuses.deleting = true;

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common)
    const uri = `${baseUri}/product/platform`;
    this.requestService.delete<number>(uri, this.deleteProductPlatform)
      .subscribe({
        next: () => {
          this.getProductPlatformList();
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
   * 檢查是否可以執行作品平台新增操作
   * @returns 是否可以執行作品平台新增操作
   */
  public canFireCreateProductPlatform(): boolean {
    return !this.statuses.creating &&
      this.addProductPlatform.productPlatformName != null &&
      this.addProductPlatform.productPlatformName.length > 0;
  }

  /**
   * 檢查是否可以編輯作品平台
   * @returns 是否可以編輯作品平台
   */
  public canFireEditProductPlatform(): boolean {
    return !this.statuses.updating &&
      this.editProductPlatform.productPlatformId != null &&
      this.editProductPlatform.productPlatformId > 0 &&
      this.editProductPlatform.productPlatformName != null &&
      this.editProductPlatform.productPlatformName.length > 0;
  }

  /**
   * 將指定的作品平台設定到編輯表單中
   * @param productPlatformId 作品平台 PK
   */
  public setSpecificProductPlatformData(productPlatformId: number, as: AsProductPlatformType): void {
    const productPlatform = this.productPlatformList.filter(productPlatform => productPlatform.productPlatformId === productPlatformId);
    if (productPlatform.length === 0) {
      alert('找不到該筆作品平台');
    }

    switch (as) {
      case 'update':
        this.editProductPlatform = this.commonService.deepCloneObject(productPlatform[0]);
        this.operationModal('editProductPlatformModal', 'open');
        break;
      case 'delete':
        this.deleteProductPlatform = this.commonService.deepCloneObject(productPlatform[0]);
        this.operationModal('confirmDelete', 'open');
        break;
    }
  }

  /**
   * 清除新增作品平台的表單資料
   */
  public clearAddProductPlatformForm(): void {
    this.addProductPlatform.productPlatformName = '';

    this.operationModal('addProductPlatformModal', 'close');
  }

  /**
   * 清除編輯作品平台的表單資料
   */
  public clearEditProductPlatformForm(): void {
    this.editProductPlatform.productPlatformId = 0;
    this.editProductPlatform.productPlatformName = '';
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
