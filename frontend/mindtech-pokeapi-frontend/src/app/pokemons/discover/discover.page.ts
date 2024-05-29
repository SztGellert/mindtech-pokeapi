import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { PokemonsService } from '../pokemons.service';
import { Pokemon } from '../pokemon.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPokemons: Pokemon[];
  listedLoadedPokemons: Pokemon[];
  relevantPokemons: Pokemon[];
  isLoading = false;
  private pokemonsSub: Subscription;

  constructor(
    private pokemonsService: PokemonsService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.pokemonsSub = this.pokemonsService.pokemons.subscribe(pokemons => {
      this.loadedPokemons = pokemons;
      this.relevantPokemons = this.loadedPokemons;
      this.listedLoadedPokemons = this.relevantPokemons.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.pokemonsService.fetchPokemons().subscribe(() => {
      this.isLoading = false;
    });
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (event.detail.value === 'all') {
        this.relevantPokemons = this.loadedPokemons;
        this.listedLoadedPokemons = this.relevantPokemons.slice(1);
      } else {
        this.relevantPokemons = this.loadedPokemons.filter(
          place => place.userId !== userId
        );
        this.listedLoadedPokemons = this.relevantPokemons.slice(1);
      }
    });
  }

  ngOnDestroy() {
    if (this.pokemonsSub) {
      this.pokemonsSub.unsubscribe();
    }
  }
}
