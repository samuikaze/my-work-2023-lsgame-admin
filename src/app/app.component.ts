import { Component, OnInit } from '@angular/core';
import { AppEnvironmentService } from './services/app-environment-service/app-environment.service';
import { NavigationEnd, Router } from '@angular/router';
import { BaseFooterComponent } from './layouts/base/base-footer/base-footer.component';
import { BaseBodyComponent } from './layouts/base/base-body/base-body.component';
import { BaseHeaderComponent } from './layouts/base/base-header/base-header.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [BaseHeaderComponent, BaseBodyComponent, BaseFooterComponent]
})
export class AppComponent implements OnInit {
  title = 'lsgames-admin';

  constructor(
    private appEnvironmentService: AppEnvironmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        this.appEnvironmentService.retrievingConfigsFromJson();
      }
    });
  }
}
