import { Component, OnInit, Input } from '@angular/core';

import { Pokemon } from '../../pokemon.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss']
})
export class OfferItemComponent implements OnInit {
  @Input() offer: Pokemon;

  constructor() { }

  ngOnInit() {
  }
}
