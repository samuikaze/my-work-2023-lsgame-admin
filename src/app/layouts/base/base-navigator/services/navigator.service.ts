import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {
  private breadcrumbs: Array<string> = [];
  private breadcrumbEvent: Subject<Array<string>> = new Subject<Array<string>>();

  constructor() { }

  /**
   * 清除麵包屑
   */
  public clearBreadcrumbs(): void {
    this.breadcrumbs = [];
    this.commitChange();
  }

  /**
   * 新增麵包屑
   * @param breadcrumb 新的麵包屑
   */
  public pushBreadcrumb(breadcrumb: string): void {
    this.breadcrumbs.push(breadcrumb);
    this.commitChange();
  }

  /**
   * 從麵包屑陣列中移除指定索引的資料
   * @param index 索引
   */
  public removeBreadcrumb(index: number): void {
    this.breadcrumbs.splice(index, 1);
    this.commitChange();
  }

  /**
   * 移除並返回最後一個麵包屑資料
   * @returns 最後一個麵包屑資料
   */
  public popBreadcrumb(): string | undefined {
    const last = this.breadcrumbs.pop();
    this.commitChange();

    return last;
  }

  /**
   * 設定麵包屑
   * @param breadcrumbs 麵包屑
   */
  public setBreadcrumbs(breadcrumbs: Array<string>): void {
    this.breadcrumbs = breadcrumbs;
    this.commitChange();
  }

  /**
   * 送出變更給組件
   */
  private commitChange(): void {
    this.breadcrumbEvent.next(this.breadcrumbs);
  }

  /**
   * 訂閱麵包屑變更
   * @returns 麵包屑訂閱流
   */
  public getEvent(): Subject<Array<string>> {
    return this.breadcrumbEvent;
  }
}
