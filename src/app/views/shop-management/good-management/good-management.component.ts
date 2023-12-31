import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/services/common-service/common.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';
import { AppEnvironmentService } from 'src/app/services/app-environment-service/app-environment.service';
import { RequestService } from 'src/app/services/request-service/request.service';
import Modal from 'bootstrap/js/dist/modal';
import { AddGood, AsGoodType, Good, GoodManagementStatuses } from './good-management';
import { ApiServiceTypes } from 'src/app/enums/api-service-types';
import { HttpErrorResponse } from '@angular/common/http';
import { CKEditorModule } from 'ckeditor4-angular';
import { Modals, PageInformation, SelectedImage } from 'src/app/commons/abstracts/common';

@Component({
  selector: 'app-good-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CKEditorModule],
  templateUrl: './good-management.component.html',
  styleUrls: ['./good-management.component.scss']
})
export class GoodManagementComponent implements OnInit {

  @ViewChild('addGoodImage')
  public addGoodImage?: ElementRef;
  @ViewChild('editGoodImage')
  public editGoodImage?: ElementRef;
  public fssUrl?: string = '';
  public selectedImage: SelectedImage = {
    dataurl: '',
    filename: '',
    size: 0
  };
  public addGood: AddGood = {
    name: '',
    price: undefined,
    quantity: undefined,
    description: '',
    previewImagee: '',
  };
  public editGood: Good = {
    goodId: 0,
    name: '',
    price: undefined,
    quantity: undefined,
    description: '',
    previewImagee: '',
    status: 1,
  };
  public deleteGood: Good = {
    goodId: 0,
    name: '',
    price: undefined,
    quantity: undefined,
    description: '',
    previewImagee: '',
    status: 1,
  };
  public goodList: Array<Good> = [];
  public modals: Modals = {};
  public pageInfo: PageInformation = {
    currentPage: 1,
    totalPage: 0,
  };
  public statuses: GoodManagementStatuses = {
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
    this.commonService.setTitle('商品管理');
    this.breadcrumbService.setBreadcrumb({
      title: '商品管理',
      uri: '/shop/good',
    });
    this.initialModals();
    this.fssUrl = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.FileStorageService);
    await this.getGoodList();

  }

  /**
   * 初始化所有彈出視窗
   */
  private initialModals(): void {
    this.modals['addGoodModal'] = new Modal('#addGood');
    this.modals['editGoodModal'] = new Modal('#editGood');
    this.modals['confirmDelete']  = new Modal('#confirmDelete');
  }

  /**
   * 取得商品清單
   */
  private async getGoodList(): Promise<void> {
    this.goodList = [];

    this.statuses.retrieving = true;

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Shop);
    const uri = `${baseUri}/shop/goods`;
    const params = { page: this.pageInfo.currentPage };
    this.requestService.get<Array<Good>>(uri, params)
      .subscribe({
        next: (response) => {
          this.goodList = response;
          this.statuses.retrieving = false;
        },
        error: (errors: HttpErrorResponse) => {
          this.requestService.requestFailedHandler(errors);
          this.statuses.retrieving = false;
        }
      });
  }

  /**
   * 新增商品
   */
  public async fireCreateGood(): Promise<void> {
    if (!this.canFireCreateGood()) {
      return;
    }

    this.statuses.creating = true;

    const goodImage = await this.uploadGoodImage();
    this.addGood.previewImagee = goodImage!;

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Shop)
    const url = `${baseUri}/shop/good`;
    const body = this.addGood;
    this.requestService.post<Good>(url, body).subscribe({
      next: () => {
        this.getGoodList();
        this.clearAddGoodForm();
        this.operationModal('addNewsModal', 'close');
        this.statuses.creating = false;
      },
      error: (errors: HttpErrorResponse) => {
        this.requestService.requestFailedHandler(errors);
        this.statuses.creating = false;
      }
    });
  }

  /**
   * 編輯商品
   */
  public async fireEditGood(): Promise<void> {
    if (!this.canFireEditGood()) {
      return;
    }

    this.statuses.updating = true;

    if (
      this.editGood.previewImagee != null &&
      this.selectedImage.dataurl.length > 0
    ) {
      try {
        await this.deleteGoodImage(this.editGood.previewImagee);
        const goodImage = await this.uploadGoodImage();
        this.editGood.previewImagee = goodImage!;
      } catch (error) {
        alert('刪除圖檔失敗，請再試一次');
        this.statuses.updating = false;
        return;
      }
    }

    this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Shop)
      .then((baseUri) => {
        const uri = `${baseUri}/shop/good`;
        this.requestService.patch<Good>(uri, this.editGood)
          .subscribe({
            next: () => {
              this.getGoodList();
              this.clearEditGoodForm();
              this.operationModal('editGoodModal', 'close');
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
   * 刪除商品
   */
  public async fireDeleteGood(): Promise<void> {
    this.statuses.deleting = true;

    if (this.deleteGood.previewImagee != null) {
      try {
        await this.deleteGoodImage(this.deleteGood.previewImagee);
      } catch (error) {
        alert('刪除圖檔失敗，請再試一次');
        this.statuses.deleting = false;
        return;
      }
    }

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Shop)
    const uri = `${baseUri}/shop/good`;
    this.requestService.delete<number>(uri, this.deleteGood)
      .subscribe({
        next: () => {
          this.getGoodList();
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
   * 上傳商品圖片
   * @returns 商品圖檔路徑
   */
  private async uploadGoodImage(): Promise<string> {
    try {
      const goodImage = this.commonService.convertDataUrlToBlob(this.selectedImage.dataurl);

      return await this.commonService.uploadFile(this.selectedImage.filename, goodImage);
    } catch (error) {
      console.error(error);
      alert(error);
      throw error;
    }
  }

  /**
   * 刪除商品圖片
   * @param imagePath 商品圖片路徑
   */
  private async deleteGoodImage(imagePath: string): Promise<void> {
    const uri = `${this.fssUrl}/api/v1/file/${imagePath}`;
    return new Promise<void>((resolve, reject) => {
      this.requestService.delete<number>(uri)
        .subscribe({
          next: () => {
            resolve();
          },
          error: (errors: HttpErrorResponse) => {
            this.requestService.requestFailedHandler(errors);
            reject('刪除商品圖片失敗');
          }
        })
    });
  }

  /**
   * 檢查是否可以執行商品新增操作
   * @returns 是否可以執行商品新增操作
   */
  public canFireCreateGood(): boolean {
    return !this.statuses.creating &&
      this.addGood.name != null &&
      this.addGood.name.length > 0 &&
      this.addGood.price != null &&
      this.addGood.price > 0 &&
      this.addGood.quantity != null &&
      this.addGood.quantity > 0 &&
      this.addGood.description != null &&
      this.addGood.description.length > 0 &&
      this.selectedImage.dataurl.length > 0;
  }

  /**
   * 檢查是否可以編輯商品
   * @returns 是否可以編輯商品
   */
  public canFireEditGood(): boolean {
    return !this.statuses.updating &&
      this.editGood.goodId != null &&
      this.editGood.goodId > 0 &&
      this.editGood.name != null &&
      this.editGood.name.length > 0 &&
      this.editGood.price != null &&
      this.editGood.price > 0 &&
      this.editGood.quantity != null &&
      this.editGood.quantity > 0 &&
      this.editGood.description != null &&
      this.editGood.description.length > 0 &&
      this.editGood.status != null &&
      [0, 1].includes(this.editGood.status) && (
        this.selectedImage.dataurl.length > 0 ||
        (
          this.editGood.previewImagee != null &&
          this.editGood.previewImagee.length > 0
        )
      )
  }

  /**
   * 將指定的商品設定到編輯表單中
   * @param goodId 商品 PK
   */
  public setSpecificGoodData(goodId: number, as: AsGoodType): void {
    const news = this.goodList.filter(good => good.goodId === goodId);
    if (news.length === 0) {
      alert('找不到該筆商品');
    }

    switch (as) {
      case 'update':
        this.editGood = this.commonService.deepCloneObject(news[0]);
        this.operationModal('editGoodModal', 'open');
        break;
      case 'delete':
        this.deleteGood = this.commonService.deepCloneObject(news[0]);
        this.operationModal('confirmDelete', 'open');
        break;
    }
  }

  /**
   * 清除新增商品的表單資料
   */
  public clearAddGoodForm(): void {
    this.addGood.name = '';
    this.addGood.previewImagee = undefined;
    this.addGood.description = '';
    this.addGood.price = undefined;
    this.addGood.quantity = undefined;

    if (this.addGoodImage != null) {
      this.addGoodImage.nativeElement.value = null;
    }

    this.resetSelectedImage();

    this.operationModal('addGoodModal', 'close');
  }

  /**
   * 清除編輯商品的表單資料
   */
  public clearEditGoodForm(): void {
    this.editGood.goodId = 0;
    this.editGood.name = '';
    this.editGood.price = undefined;
    this.editGood.quantity = undefined;
    this.editGood.description = '';
    this.editGood.previewImagee = '';
    this.editGood.status = 1;

    if (this.editGoodImage != null) {
      this.editGoodImage.nativeElement.value = null;
    }

    this.resetSelectedImage();
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

  /**
   * 將選擇的圖片顯示到網頁上
   * @param event 選擇檔案事件
   */
  public readImageUrl(event: Event): void {
    if (event == null || event.target == null) {
      return;
    }

    const target = (event.target as HTMLInputElement)
    if (target.files && target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.selectedImage.dataurl = (fileReader.result as string);
        this.selectedImage.filename = file.name;
        this.selectedImage.size = file.size;
      }

      const file = target.files[0];

      fileReader.readAsDataURL(file);
    }
  }

  /**
   * 取得圖片完整網址
   * @returns 完整網址
   */
  public getImageUrl(): string | undefined {
    let url = undefined;
    if (
      this.editGood.previewImagee != null &&
      this.editGood.previewImagee.length > 0
    ) {
      url = `${this.fssUrl}/api/v1/file/${this.editGood.previewImagee}`;
    }

    if (this.selectedImage.dataurl.length > 0) {
      url = this.selectedImage.dataurl;
    }

    return url;
  }

  /**
   * 清除選擇的圖片
   */
  public resetSelectedImage(): void {
    this.selectedImage = {
      dataurl: '',
      filename: '',
      size: 0
    };
  }
}
