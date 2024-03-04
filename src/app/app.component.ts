import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'recipe-sharing-application';

  constructor(private authService: AuthService) {
    this.authService.getCurrentUser();
  }
}
