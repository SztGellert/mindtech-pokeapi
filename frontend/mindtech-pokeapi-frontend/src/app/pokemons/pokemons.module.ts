import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PokemonsPage } from './pokemons.page';
import { PokemonsRoutingModule } from './pokemons-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PokemonsRoutingModule
  ],
  declarations: [PokemonsPage]
})
export class PokemonsPageModule {}
