import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Events } from 'ionic-angular';

import 'rxjs/add/operator/filter';

@Injectable()
export class LocationTracker {
  
  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
  public speed:number=0;

  constructor(public zone: NgZone, 
    public backgroundGeolocation: BackgroundGeolocation, 
    public geolocation: Geolocation,
    public event:Events
    ) {

  }

  startTracking() {

  	// Background Tracking

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 5,
      distanceFilter: 1, 
      debug: true,
      interval: 2000,
      stopOnTerminate:false,
      startOnBoot:true,
      url:'https://childappv2-8fdff.firebaseio.com/Locations/-KmrkaAgaxbDSpL0eaV4.json',
      httpHeaders:{'Content-Type':'application/json; charset=utf-8'}
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        this.speed=location.speed;
        this.event.publish('OnlocationChanges',location);
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking

	// let options = {
	// 	frequency: 3000, 
	// 	enableHighAccuracy: true
	// };

	// this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

	// 	console.log(position);

	// 	// Run update inside of Angular's zone
	// 	this.zone.run(() => {
	// 		this.lat = position.coords.latitude;
	// 		this.lng = position.coords.longitude;
  //     this.speed=position.coords.speed;
	// 	});

	// });

  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    //this.watch.unsubscribe();

  }

}