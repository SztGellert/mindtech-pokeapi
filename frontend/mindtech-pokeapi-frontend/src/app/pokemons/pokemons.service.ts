import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Pokemon } from './pokemon.model';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';
import {PokemonsPageModule} from "./pokemons.module";
import {environment} from "../../environments/environment";

// [
//   new Place(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of New York City.',
//     'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p2',
//     "L'Amour Toujours",
//     'A romantic place in Paris!',
//     'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
//     189.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p3',
//     'The Foggy Palace',
//     'Not your average city trip!',
//     'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
//     99.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   )
// ]

interface PokemonData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {
  private _pokemons = new BehaviorSubject<Pokemon[]>([]);

  get pokemons() {
    return this._pokemons.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPokemons() {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: PokemonData }>(
            environment.backendURI + "/pokemons"
        );
      }),
      map(resData => {
        const pokemons = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            pokemons.push(
              new Pokemon(
                key,
                resData["results"][key].title,
                resData["results"][key].description,
                resData["results"][key].imageUrl,
                resData["results"][key].price,
                new Date(resData["results"][key].availableFrom),
                new Date(resData["results"][key].availableTo),
                resData["results"][key].userId,
                resData["results"][key].location
              )
            );
          }
        }
        return pokemons;
        // return [];
      }),
      tap(pokemons => {
        this._pokemons.next(pokemons);
      })
    );
  }

  getPokemon(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<PokemonData>(
          environment.backendURI + "/pokemons"
        );
      }),
      map(pokemonData => {
        return new Pokemon(
          id,
          pokemonData.title,
          pokemonData.description,
          pokemonData.imageUrl,
          pokemonData.price,
          new Date(pokemonData.availableFrom),
          new Date(pokemonData.availableTo),
          pokemonData.userId,
          pokemonData.location
        );
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{ imageUrl: string; imagePath: string }>(
          'https://us-central1-mindtech-pokeapi.cloudfunctions.net/storeImage',
          uploadData,
          { headers: { Authorization: 'Bearer ' + token } }
        );
      })
    );
  }

  addPokemon(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let fetchedUserId: string;
    let newPokemon: Pokemon;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        if (!fetchedUserId) {
          throw new Error('No user found!');
        }
        newPokemon = new Pokemon(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          dateFrom,
          dateTo,
          fetchedUserId,
          location
        );
        return this.http.post<{ name: string }>(
          `https://mindtech-pokeapi-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json?auth=${token}`,
          {
            ...newPokemon,
            id: null
          }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.pokemons;
      }),
      take(1),
      tap(pokemons => {
        newPokemon.id = generatedId;
        this._pokemons.next(pokemons.concat(newPokemon));
      })
    );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePokemon(placeId: string, title: string, description: string) {
    let updatePokemons: Pokemon[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.pokemons;
      }),
      take(1),
      switchMap(pokemons => {
        if (!pokemons || pokemons.length <= 0) {
          return this.fetchPokemons();
        } else {
          return of(pokemons);
        }
      }),
      switchMap(pokemons => {
        const updatedPokemonIndex = pokemons.findIndex(pl => pl.id === placeId);
        updatePokemons = [...pokemons];
        const oldPokemon = updatePokemons[updatedPokemonIndex];
        updatePokemons[updatedPokemonIndex] = new Pokemon(
            oldPokemon.id,
          title,
          description,
          oldPokemon.imageUrl,
          oldPokemon.price,
          oldPokemon.availableFrom,
          oldPokemon.availableTo,
          oldPokemon.userId,
          oldPokemon.location
        );
        return this.http.put(
          `https://mindtech-pokeapi-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${placeId}.json?auth=${fetchedToken}`,
          { ...updatePokemons[updatedPokemonIndex], id: null }
        );
      }),
      tap(() => {
        this._pokemons.next(updatePokemons);
      })
    );
  }
}
