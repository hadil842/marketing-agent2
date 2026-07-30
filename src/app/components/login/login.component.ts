import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  mdp: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onLogin(): void {
    if (!this.email || !this.mdp) {
      this.errorMessage = "Veuillez remplir tous les champs.";
      return;
    }

    this.apiService.connectAdmin(this.email, this.mdp).subscribe({
      next: (response) => {
        if (response.connected) {
          this.router.navigate(['/upload']);
        } else {
          this.errorMessage = "Email ou mot de passe incorrect.";
        }
      },
      error: (err) => {
        this.errorMessage = "Une erreur est survenue lors de la connexion au serveur.";
        console.error(err);
      }
    });
  }
}