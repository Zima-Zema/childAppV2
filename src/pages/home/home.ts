import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import * as io from 'socket.io-client';
import { Storage } from '@ionic/Storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedChild: any = {};
  socket: any;
  messages: Array<string> = [];
  constructor(
    public navCtrl: NavController,
    public locationTracker: LocationTracker,
    private storage: Storage,
    private loadingCtrl: LoadingController
  ) {

    console.log("constructor")
let loader = this.loadingCtrl.create({
      content: 'Loading...',
      duration: 10000,
      dismissOnPageChange:true
    });

    loader.present().then(()=>{
      storage.get('child').then((val) => {
      // console.log('Your name is', val);
      this.selectedChild = val;
      console.log(this.selectedChild);
      loader.dismiss();

    });

    })


  }
  ionViewWillEnter() {
let loader = this.loadingCtrl.create({
      content: 'Loading...',
      duration: 10000,
      dismissOnPageChange:true
    });

    loader.present().then(()=>{
      this.storage.get('child').then((val) => {
      // console.log('Your name is', val);
      this.selectedChild = val;
      console.log(this.selectedChild);
      loader.dismiss();
      this.socket = io.connect("http://realtimetrack.eu-2.evennode.com/");
    console.log("ionViewWillEnter");
    this.socket.on('connect', () => {
      console.log("from child app", this.selectedChild.id);
      console.log("from child app>>Obj", this.selectedChild);

      // write on stream !! Event "JOIN"
      this.socket.emit('joinChild', this.selectedChild.id);
    })
    this.socket.on('message', data => {
      this.messages.push(data);
    })

    });

    })
    


  }

  send($event, data) {
    this.socket.emit("sendToParent", {
      to: this.selectedChild.parent_Id,
      data: data
    })
  }

  start() {
    this.locationTracker.startTracking();
  }

  stop() {
    this.locationTracker.stopTracking();
  }

}
