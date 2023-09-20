import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavigatorService } from './services/navigator.service';

@Component({
  selector: 'app-base-navigator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-navigator.component.html',
  styleUrls: ['./base-navigator.component.scss']
})
export class BaseNavigatorComponent implements OnInit, OnDestroy {
  public breadcrumbs: Array<string> = [];
  private eventSubscriptor: Subscription;

  constructor(navigatorService: NavigatorService) {
    this.eventSubscriptor = navigatorService.getEvent().subscribe({
      next: (breadcrumbs: Array<string>) => this.breadcrumbs = breadcrumbs,
      error: errors => console.error(errors),
    });
  }

  ngOnInit(): void {
    if (this.breadcrumbs.length === 0) {
      this.breadcrumbs = ["後台首頁"];
    }
  }

  ngOnDestroy(): void {
    this.eventSubscriptor.unsubscribe();
  }
}
