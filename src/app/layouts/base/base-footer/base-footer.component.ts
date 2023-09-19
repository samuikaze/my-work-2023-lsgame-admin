import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-base-footer',
    templateUrl: './base-footer.component.html',
    styleUrls: ['./base-footer.component.scss'],
    standalone: true
})
export class BaseFooterComponent {
constructor(private viewportService: ViewportScroller) {}

  /**
   * 返回頁面頂部
   */
  public returnToTop() {
    this.viewportService.scrollToPosition([0, 0]);
  }
}
