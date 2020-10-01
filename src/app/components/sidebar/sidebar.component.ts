// Angular
import { Component, OnInit } from '@angular/core';
// Services
import { ConfigService } from 'src/app/services/config.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  config: any = {
    logo: null,
    logoLogin: null,
    max: null,
    min: null,
    name_site: null,
    num_users: null,
  };

  constructor(
    private configService: ConfigService,
    private token: TokenStorageService
  ) {}

  getConfig(){
    this.configService.getData().subscribe(data => this.config = data)
  }

  logOut(){
    this.token.signOut();
    window.location.reload()
  }

  ngOnInit(): void {
    this.getConfig()
  }
}
