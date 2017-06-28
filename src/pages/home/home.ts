import { Component } from '@angular/core';
import { NavController, LoadingController, Events, ToastController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import * as io from 'socket.io-client';
import { Storage } from '@ionic/Storage';
import { ChildProfilePage } from '../child-profile/child-profile';
import { BackgroundGeolocation } from "@ionic-native/background-geolocation";
import { BackgroundMode } from "@ionic-native/background-mode";
import { TrackApi, IHistory } from "../shared/track-api.service";
import { Geolocation } from '@ionic-native/geolocation';
import { LoginPage } from "../login/login";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedChild: any = {};
  socket: any;
  messages: Array<string> = [];
  public lat: number = 0;
  public lng: number = 0;
  public speed: number = 0;

  constructor(
    public navCtrl: NavController,
    public locationTracker: LocationTracker,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public backgroundGeolocation: BackgroundGeolocation,
    public events: Events,
    public toasteCtrl: ToastController,
    private backgroundMode: BackgroundMode,
    private trackApi: TrackApi,
    private geolocation: Geolocation
  ) {
    this.backgroundMode.enable();
  }
  historyObj: IHistory = {
    serviceProvider: "",
    debug: true,
    time: 0,
    accuracy: 0,
    speed: 0,
    longitude: 0,
    latitude: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    bearing: 0,
    timestamp: 0,
    child_Id: 0,
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      speed: 0,
      accuracy: 0,
      altitudeAccuracy: 0,
      heading: 0
    },
    viewFlag: true,
  }
  /////////////////////////////////////////////////////////////////////////
  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Loading...',

    });
    let toaster = this.toasteCtrl.create({
      message: 'Sending Data',
      duration: 2000,
      position: 'bottom'
    })
    loader.present().then(() => {
      this.storage.get('child').then((val) => {
        // console.log('Your name is', val);
        this.selectedChild = val;
        console.log(this.selectedChild);

        this.socket = io.connect("https://realtimetrackservice.herokuapp.com/");
        this.socket.on('connect', () => {
          console.log("from child app", this.selectedChild.id);
          console.log("from child app>>Obj", this.selectedChild);
          this.socket.emit('joinChild', this.selectedChild.id);
        })


      });
      this.locationTracker.startTracking();
      this.events.subscribe('OnlocationChanges', (location => {
        this.socket.emit("sendToParent", {
          to: this.selectedChild.parent_Id,
          data: location
        });
        
        this.historyObj.child_Id = this.selectedChild.id;
        this.historyObj.longitude = location.longitude;
        this.historyObj.latitude = location.latitude;
        this.historyObj.speed = location.speed;
        this.historyObj.time = location.time;
        this.historyObj.serviceProvider = location.serviceProvider;
        this.historyObj.timestamp = location.timestamp;
        this.historyObj.viewFlag = true;

        this.trackApi.addHistory(this.historyObj).subscribe(data => {
          console.log(data);
        });


        toaster.present();
      }));

      loader.dismiss();
    })

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>




  }

  stop() {
    this.locationTracker.stopTracking();
  }
  ///////////////////////////////////////////////////////////////////////////

  SOS() {
    this.socket.emit("sendNotification", {
      message: `Your child ${this.selectedChild.fname}`,
      title:'S.O.S',
      to: this.selectedChild.parent_Id
      
    })
    this.geolocation.getCurrentPosition().then((resp)=>{
      console.log("geolocation>>>",resp);
      this.historyObj.child_Id = this.selectedChild.id;
      this.historyObj.latitude=resp.coords.latitude;
      this.historyObj.longitude=resp.coords.longitude;
      this.historyObj.speed=resp.coords.speed;
      this.historyObj.viewFlag = true;
      this.historyObj.timestamp=resp.timestamp;
      this.trackApi.addHistory(this.historyObj).subscribe((data)=>{
        console.log("After Post>>>",data);
      })


    })



  }
  logout(){
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

}

