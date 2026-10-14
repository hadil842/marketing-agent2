import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

interface CampaignPost {
  id: number;
  emailclient: string;
  nomClient: string;
  date: string;
  description: string;
  etat: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  campaigns: CampaignPost[] = [];
  clientsCount: number = 0;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadCampaigns();
    this.loadClientsCount();
  }

  loadCampaigns(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getCampaigns().subscribe({
      next: (data: CampaignPost[]) => {
        this.campaigns = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Impossible de charger les données du tableau de bord.";
        console.error(err);
      }
    });
  }

  loadClientsCount(): void {
    this.apiService.getClientsCount().subscribe({
      next: (data) => this.clientsCount = data.count,
      error: (err) => console.error(err)
    });
  }

  goToUpload(): void {
    this.router.navigate(['/upload']);
  }
   goToDash(): void {
    this.router.navigate(['/dashboard']);
  }
 // Annule TOUT le planning du client (ex: bouton global en haut de la campagne)
cancelCampaign(emailclient: string): void {
  this.apiService.cancelJob(emailclient).subscribe({
    next: () => this.loadCampaigns(),
    error: (err) => console.error(err)
  });
}

// Annule UN SEUL post (bouton dans la ligne du tableau)
cancelPost(postId: number): void {
  this.apiService.cancelPost(postId).subscribe({
    next: () => this.loadCampaigns(),
    error: (err) => console.error(err)
  });
}
}
