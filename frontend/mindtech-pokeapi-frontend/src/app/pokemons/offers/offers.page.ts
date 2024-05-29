import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PokemonsService } from '../pokemons.service';
import { Pokemon } from '../pokemon.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Pokemon[];
  isLoading = false;
  private pokemonsSub: Subscription;

  constructor(private pokemonsService: PokemonsService, private router: Router) {}

  ngOnInit() {
    this.pokemonsSub = this.pokemonsService.pokemons.subscribe(places => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.pokemonsService.fetchPokemons().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
    console.log('Editing item', offerId);
  }

  ngOnDestroy() {
    if (this.pokemonsSub) {
      this.pokemonsSub.unsubscribe();
    }
  }
}
