import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonsPage } from './pokemons.page';

describe('PlacesPage', () => {
  let component: PokemonsPage;
  let fixture: ComponentFixture<PokemonsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokemonsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
