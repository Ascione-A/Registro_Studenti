import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentiService } from '../services/studenti-service';

@Component({
  selector: 'app-modifica-studente',
  imports: [FormsModule],
  templateUrl: './modifica-studente.html',
  styleUrl: './modifica-studente.css',
})
export class ModificaStudente implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly studentiService = inject(StudentiService);

  private idStudente = 0;
  readonly nome = signal('');
  readonly classe = signal('');
  readonly media = signal(6);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const studente = this.studentiService.trova(id);

    if (studente) {
      this.idStudente = studente.id;
      this.nome.set(studente.nome);
      this.classe.set(studente.classe);
      this.media.set(studente.mediaVoti);
    } else {
      this.router.navigate(['/elenco']);
    }
  }

  salva(): void {
    this.studentiService.aggiorna({
      id: this.idStudente,
      nome: this.nome().trim(),
      classe: this.classe().trim().toUpperCase(),
      mediaVoti: Number(this.media()),
    });
    this.router.navigate(['/elenco', this.idStudente]);
  }
}