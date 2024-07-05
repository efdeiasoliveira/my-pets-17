import { ProAppConfigService } from '@totvs/protheus-lib-core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', action: () => this.router.navigate(['']), icon: 'po-icon-home', shortLabel: 'Home' },
    { label: 'Tutores', action: () => this.router.navigate(['owners']), icon: 'po-icon-users', shortLabel: 'Tutores'},
    { label: 'Pets', icon: 'po-icon-eye', shortLabel: 'Pets' },
    { label: 'Sair', action: this.closeApp.bind(this), icon: 'po-icon-exit', shortLabel: 'Sair' }
  ];

  constructor(
    private proAppConfigService: ProAppConfigService,
    private router: Router
  ){
    this.proAppConfigService.loadAppConfig();
  }

  closeApp(): void {
    this.proAppConfigService.callAppClose(false);
  }
}
