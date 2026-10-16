import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StudentiService } from '../services/studenti-service';

@Component({
  selector: 'app-elenco',
  imports: [FormsModule, RouterLink],
  templateUrl: './elenco.html',
  styleUrl: './elenco.css',
})
export class Elenco {
  private readonly studentiService = inject(StudentiService);

  readonly filtroClasse = signal('');
  readonly ordine = signal<'nome' | 'media'>('nome');

  // Filtra la lista per classe in base a quanto digitato nell'input
  readonly filtrati = computed(() => {
    const filtro = this.filtroClasse().trim().toUpperCase();
    const tutti = this.studentiService.studenti();
    if (filtro === '') return tutti;
    return tutti.filter(s => s.classe.toUpperCase() === filtro);
  });

  // Livello 1 (Prova tu): Calcola la media dei voti degli studenti filtrati
  readonly mediaClasse = computed(() => {
    const lista = this.filtrati();
    if (lista.length === 0) return '0.00';
    const somma = lista.reduce((acc, s) => acc + s.mediaVoti, 0);
    return (somma / lista.length).toFixed(2);
  });

  // Livello 2 (Prova tu): Ordina la lista filtrata per nome o per media
  readonly visibili = computed(() => {
    const lista = [...this.filtrati()];
    if (this.ordine() === 'nome') {
      return lista.sort((a, b) => a.nome.localeCompare(b.nome));
    } else {
      return lista.sort((a, b) => b.mediaVoti - a.mediaVoti);
    }
  });

  setOrdine(nuovoOrdine: 'nome' | 'media'): void {
    this.ordine.set(nuovoOrdine);
  }

  rimuovi(id: number): void {
    this.studentiService.rimuovi(id);
  }
}