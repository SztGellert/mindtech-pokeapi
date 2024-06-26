import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { Pokemon } from '../../pokemons/pokemon.model';

@Component({
  selector: 'app-create-catch',
  templateUrl: './create-catch.component.html',
  styleUrls: ['./create-catch.component.scss']
})
export class CreateCatchComponent implements OnInit {
  @Input() selectedPokemon: Pokemon;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f', { static: true }) form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPokemon.availableFrom);
    const availableTo = new Date(this.selectedPokemon.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onCatchPokemon() {
    if (!this.form.valid || !this.datesValid) {
      return;
    }

    this.modalCtrl.dismiss(
      {
        catchData: {
          firstName: this.form.value['first-name'],
          lastName: this.form.value['last-name'],
          guestNumber: +this.form.value['guest-number'],
          startDate: new Date(this.form.value['date-from']),
          endDate: new Date(this.form.value['date-to'])
        }
      },
      'confirm'
    );
  }

  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }
}
