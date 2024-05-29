import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CatchService } from './catch.service';
import { Catch } from './catch.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './catches.page.html',
  styleUrls: ['./catches.page.scss']
})
export class CatchesPage implements OnInit, OnDestroy {
  loadedCatches: Catch[];
  isLoading = false;
  private catchSub: Subscription;

  constructor(
    private catchService: CatchService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.catchSub = this.catchService.catches.subscribe(catches => {
      this.loadedCatches = catches;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.catchService.fetchCatches().subscribe(() => {
      this.isLoading = false;
    });
  }

  onRemoveCatch(catchId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
      loadingEl.present();
      this.catchService.removeCatch(catchId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if (this.catchSub) {
      this.catchSub.unsubscribe();
    }
  }
}
