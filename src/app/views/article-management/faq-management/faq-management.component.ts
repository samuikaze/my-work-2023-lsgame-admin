import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';
import { CommonService } from 'src/app/services/common-service/common.service';
import { AddFaqRequest, AsFaqType, Faq, FaqManagementStatuses, GetFaqListResponse, Modals, PageInformation } from './faq-management';
import { AppEnvironmentService } from 'src/app/services/app-environment-service/app-environment.service';
import { ApiServiceTypes } from 'src/app/enums/api-service-types';
import { RequestService } from 'src/app/services/request-service/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-faq-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './faq-management.component.html',
  styleUrls: ['./faq-management.component.scss']
})
export class FaqManagementComponent implements OnInit {

  public faqList: Array<Faq> = [];
  public addFaq: AddFaqRequest = {
    faqQuestion: "",
    faqAnswer: "",
  };
  public editFaq: AddFaqRequest = {
    faqQuestion: "",
    faqAnswer: "",
  }
  public deleteFaq:  Faq = {
    faqId: 0,
    faqQuestion: '',
    faqAnswer: ''
  };
  public pageInfo: PageInformation = {
    currentPage: 1,
    totalPage: 0,
  };
  public statuses: FaqManagementStatuses = {
    retrieving: false,
    creating: false,
    updating: false,
    deleting: false
  };
  private modals: Modals = {};
  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private appEnvironmentService: AppEnvironmentService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle('常見問題管理');
    this.breadcrumbService.setBreadcrumb({
      title: '常見問題管理',
      uri: '/article/faq',
    });
    this.initialModals();
    this.getFaqList();
  }

  /**
   * 初始化所有彈出視窗
   */
  private initialModals(): void {
    this.modals['addFaqModal'] = new Modal('#addFaq');
    this.modals['editFaqModal'] = new Modal('#editFaq');
    this.modals['confirmDelete']  = new Modal('#confirmDeleteFaq');
  }

  /**
   * 取得常見問題清單
   */
  private async getFaqList(): Promise<void> {
    this.statuses.retrieving = true;

    const baseUri = await this.appEnvironmentService.getConfig(ApiServiceTypes.Common);
    const uri = `${baseUri}/faq`;
    this.requestService.get<GetFaqListResponse>(uri)
      .subscribe({
        next: response => {
          this.faqList = response.faqList;
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
   * 新增常見問題
   */
  public fireCreateFaq(): void {
    if (!this.canFireCreateFaq()) {
      return;
    }

    this.statuses.creating = true;

    this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common)
      .then((baseUri) => {
        const uri = `${baseUri}/faq`;
        this.requestService.post<number>(uri, this.addFaq)
          .subscribe({
            next: () => {
              this.getFaqList();
              this.clearAddFaqForm();
              this.statuses.creating = false;
            },
            error: (errors: HttpErrorResponse) => {
              this.requestService.requestFailedHandler(errors);
              this.statuses.creating = false;
            }
          });
      });
  }

  /**
   * 編輯常見問題
   */
  public fireEditFaq(): void {
    if (!this.canFireEditFaq()) {
      return;
    }

    this.statuses.updating = true;

    this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common)
      .then((baseUri) => {
        const uri = `${baseUri}/faq`;
        this.requestService.patch<number>(uri, this.editFaq)
          .subscribe({
            next: () => {
              this.getFaqList();
              this.clearEditFaqForm();
              this.operationModal('editFaqModal', 'close');
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
   * 刪除常見問題
   */
  public fireDeleteFaq(): void {
    this.statuses.deleting = true;

    this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common)
      .then((baseUri) => {
        const uri = `${baseUri}/faq`;
        this.requestService.delete<number>(uri, this.deleteFaq)
          .subscribe({
            next: () => {
              this.getFaqList();
              this.operationModal('confirmDelete', 'close');
              this.statuses.deleting = false;

            },
            error: (errors: HttpErrorResponse) => {
              this.requestService.requestFailedHandler(errors);
              this.statuses.deleting = false;
            }
          });
      });
  }

  /**
   * 將指定的常見問題設定到編輯表單中
   * @param fadId 常見問題 PK
   */
  public setSpecificFaqData(fadId: number, as: AsFaqType): void {
    const faq = this.faqList.filter(faq => faq.faqId === fadId);
    if (faq.length === 0) {
      alert('找不到該筆常見問題');
    }

    switch (as) {
      case 'update':
        this.editFaq = this.commonService.deepCloneObject(faq[0]);
        this.operationModal('editFaqModal', 'open');
        break;
      case 'delete':
        this.deleteFaq = this.commonService.deepCloneObject(faq[0]);
        this.operationModal('confirmDelete', 'open');
        break;
    }
  }

  /**
   * 檢查是否可以新增常見問題
   * @returns 是否可以新增常見問題
   */
  public canFireCreateFaq(): boolean {
    return !this.statuses.creating &&
      this.addFaq.faqQuestion != null &&
      this.addFaq.faqQuestion.length > 0 &&
      this.addFaq.faqAnswer != null &&
      this.addFaq.faqAnswer.length > 0
  }

  /**
   * 檢查是否可以編輯常見問題
   * @returns 是否可以編輯常見問題
   */
  public canFireEditFaq(): boolean {
    return !this.statuses.updating &&
      this.editFaq.faqQuestion != null &&
      this.editFaq.faqQuestion.length > 0 &&
      this.editFaq.faqAnswer != null &&
      this.editFaq.faqAnswer.length > 0
  }

  /**
   * 清除新增常見問題的表單資料
   */
  private clearAddFaqForm(): void {
    this.addFaq.faqQuestion = "";
    this.addFaq.faqAnswer = "";

    this.operationModal('addFaqModal', 'close');
  }

  /**
   * 清除新增常見問題的表單資料
   */
  private clearEditFaqForm(): void {
    this.addFaq.faqQuestion = "";
    this.addFaq.faqAnswer = "";
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
