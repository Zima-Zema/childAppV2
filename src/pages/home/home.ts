import { Component } from '@angular/core';
import { NavController, LoadingController, Events, ToastController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import * as io from 'socket.io-client';
import { Storage } from '@ionic/Storage';
import { ChildProfilePage } from '../child-profile/child-profile';
import { BackgroundGeolocation } from "@ionic-native/background-geolocation";
import { BackgroundMode } from "@ionic-native/background-mode";
import { TrackApi } from "../shared/track-api.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // historyObj:IHistory={
  // serviceProvider: "",
  // debug: true,
  // time: 0,
  // accuracy: 0,
  // speed: 0,
  // longitude: 0,
  // latitude: 0,
  // altitude: 0,
  // altitudeAccuracy: 0,
  // bearing: 0,
  // timestamp: 0,
  // child_Id: 0,
  // coords: {
  //   latitude: 0,
  //   longitude: 0,
  //   altitude: 0,
  //   speed: 0,
  //   accuracy: 0,
  //   altitudeAccuracy: 0,
  //   heading: 0
  // },
  // viewFlag: true,
  // }
  selectedChild: any = {};
  socket: any;
  messages: Array<string> = [];
  public lat: number = 0;
  public lng: number = 0;
  public speed:number=0;

  constructor(
    public navCtrl: NavController,
    public locationTracker: LocationTracker,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public backgroundGeolocation: BackgroundGeolocation,
    public events: Events,
    public toasteCtrl:ToastController,
    private backgroundMode: BackgroundMode,
    private trackApi:TrackApi
  ) {
       this.backgroundMode.enable();
    
    console.log("constructor")
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
      duration: 10000,
      dismissOnPageChange: true
    });

    loader.present().then(() => {
      storage.get('child').then((val) => {
        // console.log('Your name is', val);
        this.selectedChild = val;
        console.log(this.selectedChild);
        loader.dismiss();

      });

    })
  }
  /////////////////////////////////////////////////////////////////////////
  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
      duration: 10000,
      dismissOnPageChange: true
    });
    let toaster =this.toasteCtrl.create({
      message:'Sending Data',
      duration:2000,
      position:'top'
    })
    loader.present().then(() => {
      this.storage.get('child').then((val) => {
        // console.log('Your name is', val);
        this.selectedChild = val;
        console.log(this.selectedChild);
        loader.dismiss();
        this.socket = io.connect("http://realtimetrack.eu-2.evennode.com/");
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
    this.locationTracker.startTracking();

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.events.subscribe('OnlocationChanges',(location=>{
      this.socket.emit("sendToParent", {
              to: this.selectedChild.parent_Id,
              data: location
            });
            toaster.present();
}))


  }

  stop() {
    this.locationTracker.stopTracking();
  }
  ///////////////////////////////////////////////////////////////////////////

 

  profile() {
    this.navCtrl.push(ChildProfilePage);
  }

}

