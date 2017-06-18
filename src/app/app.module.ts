import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http'
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
//import { AgmCoreModule } from '@agm/core';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LocationTracker } from '../providers/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { LoginPage } from '../pages/login/login'
import { IonicStorageModule } from "@ionic/Storage";
import { TrackApi } from '../pages/shared/track-api.service'
import {ChildProfilePage} from '../pages/child-profile/child-profile';
import { EditProfilePage } from '../pages/edit-profile/edit-profile'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ChildProfilePage,
    EditProfilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ChildProfilePage,
    EditProfilePage
  ],
  providers: [
    LocationTracker,
    BackgroundGeolocation,
    Geolocation,
    StatusBar,
    SplashScreen,
    TrackApi,
    GoogleMaps,
    BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
