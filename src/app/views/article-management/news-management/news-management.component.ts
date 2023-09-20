import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigatorService } from 'src/app/layouts/base/base-navigator/services/navigator.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import {
  AddNews,
  News,
  NewsList,
  NewsListResponse,
  NewsType,
} from './news-management';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { BaseResponse, SystemVariable } from 'src/app/commons/abstracts/common';
import { environment } from 'src/environments/environment';
import {
  checkNullAndEmpty,
  handleHttpClientError,
} from 'src/app/commons/functions/common-functions';
import { AppEnvironmentService } from 'src/app/services/app-environment-service/app-environment.service';
import { ApiServiceTypes } from 'src/app/enums/api-service-types';
import { RequestService } from 'src/app/services/request-service/request.service';
import { CommonService } from 'src/app/services/common-service/common.service';

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
    newsType: null,
    newsContent: null,
  };
  @Input() public editNews: News = {
    newsId: 0,
    newsTypeId: 0,
    newsTitle: '',
    newsContent: '',
    createdUserId: 0,
    createdAt: undefined,
    updatedUserId: undefined,
    updatedAt: undefined,
    deletedUserId: undefined,
    deletedAt: undefined,
  };
  public newsTypes: Array<NewsType> = [];
  public newsList: Array<News> = [];
  public page: number = 1;
  public totalPage: number = 0;
  constructor(
    private commonService: CommonService,
    private navigatorService: NavigatorService,
    private requestService: RequestService,
    private appEnvironmentService: AppEnvironmentService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle('最新消息管理');
    this.navigatorService.setBreadcrumbs(['後台首頁', '最新消息']);
    this.getNewsType();
    this.getNews();
  }

  /**
   * 取得消息種類清單
   */
  private async getNewsType(): Promise<void> {
    const baseUri = await this.appEnvironmentService.getConfig(
      ApiServiceTypes.Common
    );
    const url = `${baseUri}/news/types`;
    this.requestService.get<BaseResponse<Array<NewsType>>>(url).subscribe({
      next: (response) => {
        this.newsTypes = response.data;
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
    const params = { page: this.page };
    this.requestService.get<NewsList>(uri, params).subscribe((response) => {
      this.newsList = response.newsList;
      this.totalPage = response.totalPages;
    });
  }

  /**
   * 新增最新消息
   */
  public async createNews(): Promise<void> {
    if (!this.canFireCreateNews()) {
      return;
    }

    const baseUri = await this.appEnvironmentService.getConfig(
      ApiServiceTypes.Common
    );
    const url = `${baseUri}/news/create`;
    const body = this.addNews;
    this.requestService.post<BaseResponse<null>>(url, body).subscribe({
      next: (response) => {},
      error: (errors: HttpErrorResponse) =>
        this.requestService.requestFailedHandler(errors),
    });
  }

  /**
   * 檢查是否可以執行最新消息新增操作
   * @returns 是否可以執行最新消息新增操作
   */
  public canFireCreateNews(): boolean {
    return (
      !checkNullAndEmpty(this.addNews.newsTitle) &&
      !checkNullAndEmpty(this.addNews.newsType) &&
      !checkNullAndEmpty(this.addNews.newsContent)
    );
  }
}
