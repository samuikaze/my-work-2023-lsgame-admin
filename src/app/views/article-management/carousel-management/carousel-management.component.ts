import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/services/common-service/common.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';
import { AddCarousel, AsCarouselType, Carousel, CarouselManagementStatuses, GetCarouselListResponse } from './carousel-management';
import { Modals, PageInformation, SelectedImage } from 'src/app/commons/abstracts/common';
import { RequestService } from 'src/app/services/request-service/request.service';
import { AppEnvironmentService } from 'src/app/services/app-environment-service/app-environment.service';
import { ApiServiceTypes } from 'src/app/enums/api-service-types';
import Modal from 'bootstrap/js/dist/modal';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-carousel-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carousel-management.component.html',
  styleUrls: ['./carousel-management.component.scss']
})
export class CarouselManagementComponent implements OnInit, AfterViewInit {

  @ViewChild('addCarouselImage')
  public addCarouselImage?: ElementRef;
  @ViewChild('editCarouselImage')
  public editCarouselImage?: ElementRef;
  public fssUrl?: string = '';
  public selectedImage: SelectedImage = {
    dataurl: '',
    filename: '',
    size: 0
  };
  public addCarousel: AddCarousel = {
    carouselTitle: undefined,
    carouselImagePath: '',
    description: '',
    link: undefined
  };
  public editCarousel: Carousel = {
    carouselId: 0,
    carouselTitle: undefined,
    carouselImagePath: '',
    description: '',
    link: undefined
  };
  public deleteCarousel: Carousel = {
    carouselId: 0,
    carouselTitle: undefined,
    carouselImagePath: '',
    description: '',
    link: undefined
  };
  public pageInfo: PageInformation = {
    currentPage: 1,
    totalPage: 0,
  };
  public statuses: CarouselManagementStatuses = {
    retrieving: false,
    creating: false,
    updating: false,
    deleting: false
  };
  public carouselList: Array<Carousel> = [];
  public modals: Modals = {};
  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private appEnvironmentService: AppEnvironmentService,
    private requestService: RequestService
  ) {}

  async ngOnInit(): Promise<void> {
    this.commonService.setTitle('輪播管理');
    this.breadcrumbService.setBreadcrumb({
      title: '輪播管理',
      uri: '/article/carousel',
    });

    this.fssUrl = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.FileStorageService);
    await this.getCarouselList();
  }

  ngAfterViewInit(): void {
    this.initialModals();
  }

  /**
   * 初始化所有彈出視窗
   */
  private initialModals(): void {
    this.modals['addCarouselModal'] = new Modal('#addCarousel');
    this.modals['editCarouselModal'] = new Modal('#editCarousel');
    this.modals['confirmDelete']  = new Modal('#confirmDelete');
  }

  /**
   * 取得輪播圖片清單
   */
  private async getCarouselList(): Promise<void> {
    this.carouselList = [];

    this.statuses.retrieving = true;

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common);
    const uri = `${baseUri}/carousel`;
    this.requestService.get<GetCarouselListResponse>(uri)
      .subscribe({
        next: response => {
          this.carouselList = response.carouselList;
          this.pageInfo.totalPage = response.totalPages;
          this.statuses.retrieving = false;
        },
        error: (errors: HttpErrorResponse) => {
          this.requestService.requestFailedHandler(errors);
          this.statuses.retrieving = false;
        }
      });
  }

  /**
   * 新增輪播
   */
  public async fireCreateCarousel(): Promise<void> {
    if (!this.canFireCreateCarousel()) {
      return;
    }

    this.statuses.creating = true;

    const carouselImage = await this.uploadCarouselImage();
    this.addCarousel.carouselImagePath = carouselImage;

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common);
    const uri = `${baseUri}/carousel`;
    const body = this.addCarousel;
    this.requestService.post<Carousel>(uri, body)
      .subscribe({
        next: () => {
          this.getCarouselList();
          this.clearAddCarouselForm();
          this.operationModal('addCarouselModal', 'close');
          this.statuses.creating = false;
        },
        error: (errors: HttpErrorResponse) => {
          this.requestService.requestFailedHandler(errors);
          this.statuses.creating = false;
        }
      });
  }

  /**
   * 更新輪播
   */
  public async fireEditCarousel(): Promise<void> {
    if (!this.canFireEditCarousel()) {
      return;
    }

    this.statuses.updating = true;

    if (
      this.editCarousel.carouselImagePath != null &&
      this.selectedImage.dataurl.length > 0
    ) {
      try {
        await this.deleteCarouselImage(this.editCarousel.carouselImagePath);
        const carouselImage = await this.uploadCarouselImage();
        this.editCarousel.carouselImagePath = carouselImage;
      } catch (error) {
        alert('刪除圖檔失敗，請再試一次');
        this.statuses.updating = false;
        return;
      }
    }

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common);
    const uri = `${baseUri}/carousel`;
    this.requestService.patch<Carousel>(uri, this.editCarousel)
      .subscribe({
        next: () => {
          this.getCarouselList();
          this.clearEditCarouselForm();
          this.operationModal('editCarouselModal', 'close');
          this.statuses.updating = false;
        },
        error: (errors: HttpErrorResponse) => {
          this.requestService.requestFailedHandler(errors);
          this.statuses.updating = false;
        }
      });
  }

  /**
   * 刪除輪播
   */
  public async fireDeleteCarousel(): Promise<void> {
    this.statuses.deleting = true;

    if (this.deleteCarousel.carouselImagePath != null) {
      try {
        await this.deleteCarouselImage(this.deleteCarousel.carouselImagePath);
      } catch (error) {
        alert('刪除圖檔失敗');
        this.statuses.deleting = false;
        return;
      }
    }

    const baseUri = await this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common);
    const uri = `${baseUri}/carousel`;
    this.requestService.delete<number>(uri, this.deleteCarousel)
      .subscribe({
        next: () => {
          this.getCarouselList();
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
   * 上傳輪播圖片
   * @returns 輪播圖檔路徑
   */
  private async uploadCarouselImage(): Promise<string> {
    try {
      const carouselImage = this.commonService.convertDataUrlToBlob(this.selectedImage.dataurl);
      return await this.commonService.uploadFile(this.selectedImage.filename, carouselImage);
    } catch (error) {
      console.error(error);
      throw new Error('圖檔的檔案類型無法辨別');
    }
  }

  /**
   * 刪除輪播圖片
   * @param imagePath 輪播圖檔路徑
   */
  private async deleteCarouselImage(imagePath: string): Promise<void> {
    try {
      await this.commonService.deleteFile(imagePath);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  /**
   * 檢查是否可以執行輪播新增操作
   * @returns 是否可以執行輪播新增操作
   */
  public canFireCreateCarousel(): boolean {
    return !this.statuses.creating &&
      this.addCarousel.description != null &&
      this.addCarousel.description.length > 0 &&
      this.selectedImage.dataurl.length > 0;
  }

  /**
   * 檢查是否可以編輯輪播
   * @returns 是否可以編輯輪播
   */
  public canFireEditCarousel(): boolean {
    return !this.statuses.updating &&
      this.editCarousel.carouselId != null &&
      this.editCarousel.carouselId > 0 &&
      this.editCarousel.description != null &&
      this.editCarousel.description.length > 0 && (
        this.selectedImage.dataurl.length > 0 ||
        (
          this.editCarousel.carouselImagePath != null &&
          this.editCarousel.carouselImagePath.length > 0
        )
      )
  }

  /**
   * 將指定的輪播設定到編輯表單中
   * @param carouselId 輪播 PK
   * @param as 更新或刪除表單
   */
  public setSpecificGoodData(carouselId: number, as: AsCarouselType): void {
    const carousel = this.carouselList.filter(carousel => carousel.carouselId === carouselId);
    if (carousel.length === 0) {
      alert('找不到該筆圖片輪播');
    }

    switch (as) {
      case 'update':
        this.editCarousel = this.commonService.deepCloneObject(carousel[0]);
        this.operationModal('editCarouselModal', 'open');
        break;
      case 'delete':
        this.deleteCarousel = this.commonService.deepCloneObject(carousel[0]);
        this.operationModal('confirmDelete', 'open');
        break;
    }
  }

  /**
   * 清除新增輪播的表單資料
   */
  public clearAddCarouselForm(): void {
    this.addCarousel.carouselTitle = undefined;
    this.addCarousel.carouselImagePath = '';
    this.addCarousel.description = '';
    this.addCarousel.link = undefined;

    if (this.addCarouselImage != null) {
      this.addCarouselImage.nativeElement.value = null;
    }

    this.resetSelectedImage();

    this.operationModal('addCarouselModal', 'close');
  }

  /**
   * 清除編輯輪播的表單資料
   */
  public clearEditCarouselForm(): void {
    this.editCarousel.carouselId = 0;
    this.editCarousel.carouselTitle = undefined;
    this.editCarousel.carouselImagePath = '';
    this.editCarousel.description = '';
    this.editCarousel.link = undefined;

    if (this.editCarouselImage != null) {
      this.editCarouselImage.nativeElement.value = null;
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
      this.editCarousel.carouselImagePath != null &&
      this.editCarousel.carouselImagePath.length > 0
    ) {
      url = `${this.fssUrl}/api/v1/file/${this.editCarousel.carouselImagePath}`;
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
