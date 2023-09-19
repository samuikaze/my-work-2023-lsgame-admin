import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RequestService } from '../request-service/request.service';
import { SecureLocalStorageService } from '../secure-local-storage/secure-local-storage.service';
import { AppEnvironmentService } from '../app-environment-service/app-environment.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private titleService: Title,
    private secureLocalStorageService: SecureLocalStorageService,
    private requestService: RequestService,
    private appEnvironmentService: AppEnvironmentService
  ) { }

  /**
   * 設定頁面標題
   * @param newTitle 新標題
   */
  public async setTitle(newTitle: string): Promise<void> {
    const siteTitle = await this.appEnvironmentService.getConfig('siteTitle');
    if (newTitle.length > 0) {
      this.titleService.setTitle(`${newTitle} - ${siteTitle}`);
    } else {
      this.titleService.setTitle(siteTitle);
    }
  }

  /**
   * 處理日期時間
   *
   * @param raw 原始值
   * @param num 要返回的個數
   * @returns 處理後的值
   */
  public processDateTime(raw: string | Date, num: number): string {
    if (num > 6) {
      num = 6;
    } else if (num < 0) {
      num = 0;
    }

    const rawDate = new Date(raw);
    const year = rawDate.getFullYear();
    const month = rawDate.getMonth() + 1;
    const date = rawDate.getDate();
    const hour = rawDate.getHours();
    const minute = rawDate.getMinutes();
    const seconds = rawDate.getSeconds();

    const dateArray = [year, month, date, hour, minute, seconds];
    const separator = ["-", "-", " ", ":", ":"];
    let result = "";
    for (let i = 0; i < num; i++) {
      if (i != 0) {
        result += `${separator[i - 1]}`;
      }

      result += (dateArray[i].toString().length < 2) ? `0${dateArray[i]}` : `${dateArray[i]}`;
    }

    return result;
  }

  /**
   * 確認目前登入狀態 (離線驗證)
   * @returns 是否為登入狀態
   */
  public checkAuthenticateStateOffline(): boolean {
    // 請自行實作離線登入狀態驗證

    return true;
  }

  /**
   * 確認目前登入狀態
   * @returns 是否為登入狀態
   */
  public async checkAuthenticateState(): Promise<boolean> {
    // 請自行實作線上登入狀態驗證

    return true;
  }

  /**
   * 以重整權杖取得新的存取權杖
   * @returns 是否成功重新取得存取權杖
   */
  public async reactiveAccessToken(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // 請自行實作以重整權杖取得新的存取權杖
    });
  }

  /**
   * 清除登入相關的資料 (等同於登出)
   */
  public clearAuthenticateData() {
    // 請自行實作登出時要清除哪些資料
  }

  /**
   * 登入相關資料
   * @returns 登入帳號相關資料
   */
  public getUserData(): any {
    // 請自行實作取得帳號資料邏輯
  }

  /**
   * 複製物件
   * @param original 原始物件
   * @returns 複製的物件
   */
  public deepCloneObject(original: any): any {
    return JSON.parse(JSON.stringify(original));
  }
}
