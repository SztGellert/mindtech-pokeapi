import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';

import { Catch } from './catch.model';
import { AuthService } from '../auth/auth.service';

interface CatchData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class CatchService {
  private _catches = new BehaviorSubject<Catch[]>([]);

  get catches() {
    return this._catches.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  addCatch(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    let newCatch: Catch;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        newCatch = new Catch(
          Math.random().toString(),
          placeId,
          fetchedUserId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo
        );
        return this.http.post<{ name: string }>(
          `https://mindtech-pokeapi-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?auth=${token}`,
          { ...newCatch, id: null }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.catches;
      }),
      take(1),
      tap(catches => {
        newCatch.id = generatedId;
        this._catches.next(catches.concat(newCatch));
      })
    );
  }

  removeCatch(catchId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.delete(
          `https://https://mindtech-pokeapi-default-rtdb.europe-west1.firebasedatabase.app/bookings/${catchId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.catches;
      }),
      take(1),
      tap(bookings => {
        this._catches.next(bookings.filter(c => c.id !== catchId));
      })
    );
  }

  fetchCatches() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: CatchData }>(
          `https://mindtech-pokeapi-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
        );
      }),
      map(catchData => {
        const catches = [];
        for (const key in catchData) {
          if (catchData.hasOwnProperty(key)) {
            catches.push(
              new Catch(
                key,
                catchData[key].placeId,
                catchData[key].userId,
                catchData[key].placeTitle,
                catchData[key].placeImage,
                catchData[key].firstName,
                catchData[key].lastName,
                catchData[key].guestNumber,
                new Date(catchData[key].bookedFrom),
                new Date(catchData[key].bookedTo)
              )
            );
          }
        }
        return catches;
      }),
      tap(catches => {
        this._catches.next(catches);
      })
    );
  }
}
