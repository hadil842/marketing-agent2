import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Indispensable pour [(ngModel)]
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  selectedFile: File | null = null;
  isUploading: boolean = false;
  isCancelling: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  cancelEmail: string = ''; 

  constructor(private apiService: ApiService, private router: Router) {}

  // Détecte le fichier sélectionné (gère l'input HTML classique et les composants tiers)
  onFileSelected(event: any): void {
    const file = event.target?.files?.[0] || event.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  // Envoie le fichier Excel à FastAPI
  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez d’abord choisir un fichier Excel.';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.uploadExcel(this.selectedFile).subscribe({
      next: (response: string) => {
        this.isUploading = false;
        this.successMessage = "Fichier traité avec succès par l'agent !";
        this.selectedFile = null;
        
        // Redirection automatique vers le dashboard après 2 secondes
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = "Erreur lors de l'envoi ou du traitement du fichier.";
        console.error(err);
      }
    });
  }

  // Annule une campagne pour un client spécifique
  onCancelJob(): void {
    if (!this.cancelEmail.trim()) {
      this.errorMessage = 'Veuillez saisir une adresse email valide.';
      return;
    }

    this.isCancelling = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.cancelJob(this.cancelEmail.trim()).subscribe({
      next: (response: string) => {
        this.isCancelling = false;
        this.successMessage = response || `Campagne annulée pour ${this.cancelEmail}.`;
        this.cancelEmail = '';
      },
      error: (err) => {
        this.isCancelling = false;
        this.errorMessage = "Une erreur est survenue lors de la tentative d'annulation.";
        console.error(err);
      }
    });
  }
}