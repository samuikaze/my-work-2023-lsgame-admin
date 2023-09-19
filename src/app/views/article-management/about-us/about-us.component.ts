import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigatorService } from 'src/app/layouts/base/base-navigator/services/navigator.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(private navigatorService: NavigatorService) {}

  ngOnInit(): void {
    this.navigatorService.setBreadcrumbs(["後台首頁", "關於我們"])
  }
}
