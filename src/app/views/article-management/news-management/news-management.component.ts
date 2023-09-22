import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import {
  AddNews,
  AsNewsType,
  News,
  NewsList,
  NewsManagementStatuses,
  NewsType,
} from './news-management';
import {
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  checkNullAndEmpty,
} from 'src/app/commons/functions/common-functions';
import { AppEnvironmentService } from 'src/app/services/app-environment-service/app-environment.service';
import { ApiServiceTypes } from 'src/app/enums/api-service-types';
import { RequestService } from 'src/app/services/request-service/request.service';
import { CommonService } from 'src/app/services/common-service/common.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';
import Modal from 'bootstrap/js/dist/modal';
import { Modals, PageInformation } from 'src/app/commons/abstracts/common';

@Component({
  selector: 'app-news-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CKEditorModule,
    HttpClientModule,
  ],
  templateUrl: './news-management.component.html',
  styleUrls: ['./news-management.component.scss'],
})
export class NewsManagementComponent implements OnInit {
  @Input() public addNews: AddNews = {
    newsTitle: null,
    newsTypeId: null,
    newsContent: null,
  };
  @Input() public editNews: News = {
    newsId: 0,
    newsTypeId: 0,
    newsTitle: '',
    newsContent: '',
  };
  public deleteNews: News = {
    newsId: 0,
    newsTypeId: 0,
    newsTitle: '',
    newsContent: '',
  };
  public newsTypes: Array<NewsType> = [];
  public newsList: Array<News> = [];
  public pageInfo: PageInformation = {
    currentPage: 1,
    totalPage: 0
  };
  public statuses: NewsManagementStatuses = {
    retrieving: false,
    creating: false,
    updating: false,
    deleting: false
  };
  public modals: Modals = {};
  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private requestService: RequestService,
    private appEnvironmentService: AppEnvironmentService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle('最新消息管理');
    this.breadcrumbService.setBreadcrumb({
      title: '最新消息管理',
      uri: '/article/news',
    });
    this.initialModals();
    this.getNewsType();
    this.getNews();
  }

  /**
   * 初始化所有彈出視窗
   */
  private initialModals(): void {
    this.modals['addNewsModal'] = new Modal('#addNews');
    this.modals['editNewsModal'] = new Modal('#editNews');
    this.modals['confirmDelete']  = new Modal('#confirmDelete');
  }

  /**
   * 取得消息種類清單
   */
  private async getNewsType(): Promise<void> {
    const baseUri = await this.appEnvironmentService.getConfig(
      ApiServiceTypes.Common
    );
    const url = `${baseUri}/news/types`;
    this.requestService.get<Array<NewsType>>(url).subscribe({
      next: (response) => {
        this.newsTypes = response;
      },
      error: (errors: HttpErrorResponse) => {
        this.requestService.requestFailedHandler(errors);
      },
    });
  }

  /**
   * 取得消息清單
   */
  private async getNews(): Promise<void> {
    this.newsList = [];

    const baseUri = await this.appEnvironmentService.getConfig(
      ApiServiceTypes.Common
    );
    const uri = `${baseUri}/news`;
    const params = { page: this.pageInfo.currentPage };
    this.requestService.get<NewsList>(uri, params).subscribe((response) => {
      this.newsList = response.newsList;
      this.pageInfo.totalPage = response.totalPages;
    });
  }

  /**
   * 新增最新消息
   */
  public createNews(): void {
    if (!this.canFireCreateNews()) {
      return;
    }

    this.statuses.creating = true;

    this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common)
      .then((baseUri) => {
        const url = `${baseUri}/news`;
        const body = this.addNews;
        this.requestService.post<number>(url, body).subscribe({
          next: () => {
            this.getNews();
            this.clearAddNewsForm();
            this.operationModal('addNewsModal', 'close');
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
  public fireEditNews(): void {
    if (!this.canFireEditNews()) {
      return;
    }

    this.statuses.updating = true;

    this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common)
      .then((baseUri) => {
        const uri = `${baseUri}/news`;
        this.requestService.patch<number>(uri, this.editNews)
          .subscribe({
            next: () => {
              this.getNews();
              this.clearEditNewsForm();
              this.operationModal('editNewsModal', 'close');
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
  public fireDeleteNews(): void {
    this.statuses.deleting = true;

    this.appEnvironmentService.getConfig<string>(ApiServiceTypes.Common)
      .then((baseUri) => {
        const uri = `${baseUri}/news`;
        this.requestService.delete<number>(uri, this.deleteNews)
          .subscribe({
            next: () => {
              this.getNews();
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
   * @param newsId 常見問題 PK
   */
  public setSpecificFaqData(newsId: number, as: AsNewsType): void {
    const news = this.newsList.filter(news => news.newsId === newsId);
    if (news.length === 0) {
      alert('找不到該筆常見問題');
    }

    switch (as) {
      case 'update':
        this.editNews = this.commonService.deepCloneObject(news[0]);
        this.operationModal('editNewsModal', 'open');
        break;
      case 'delete':
        this.deleteNews = this.commonService.deepCloneObject(news[0]);
        this.operationModal('confirmDelete', 'open');
        break;
    }
  }

  /**
   * 檢查是否可以執行最新消息新增操作
   * @returns 是否可以執行最新消息新增操作
   */
  public canFireCreateNews(): boolean {
    return !this.statuses.creating &&
      !checkNullAndEmpty(this.addNews.newsTitle) &&
      !checkNullAndEmpty(this.addNews.newsTypeId) &&
      !checkNullAndEmpty(this.addNews.newsContent);
  }

  /**
   * 檢查是否可以編輯常見問題
   * @returns 是否可以編輯常見問題
   */
  public canFireEditNews(): boolean {
    return !this.statuses.updating &&
      this.editNews.newsId != null &&
      this.editNews.newsId > 0 &&
      this.editNews.newsTypeId != null &&
      this.editNews.newsTypeId > 0 &&
      this.editNews.newsTitle != null &&
      this.editNews.newsTitle.length > 0 &&
      this.editNews.newsContent != null &&
      this.editNews.newsContent.length > 0
  }

  /**
   * 清除新增常見問題的表單資料
   */
  private clearAddNewsForm(): void {
    this.addNews.newsTitle = null;
    this.addNews.newsTypeId = null;
    this.addNews.newsContent = null;

    this.operationModal('addFaqModal', 'close');
  }

  /**
   * 清除新增常見問題的表單資料
   */
  private clearEditNewsForm(): void {
    this.editNews.newsId = 0;
    this.editNews.newsTypeId = 0;
    this.editNews.newsTitle = '';
    this.editNews.newsContent = '';
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
