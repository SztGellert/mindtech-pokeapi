import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PokemonDetailPage } from './pokemon-detail.page';
import { CreateCatchComponent } from '../../../catches/create-catch/create-catch.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PokemonDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [PokemonDetailPage, CreateCatchComponent],
  entryComponents: [CreateCatchComponent]
})
export class PokemonDetailPageModule {}
