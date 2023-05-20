import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Subject, takeUntil, tap } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: "encompass-root",
  templateUrl: "core.shell.html",
  styleUrls: ["core.shell.scss"],
})

export class CoreShell {
  constructor() {}

//   ngOnInit() {}

//   ngOnDestroy() {}
}