import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login'
import { BackgroundMode } from '@ionic-native/background-mode';
import { HomePage } from "../pages/home/home";
import { TrackApi } from "../pages/shared/track-api.service";
import { ChildProfilePage } from "../pages/child-profile/child-profile";
import { Storage } from '@ionic/Storage';

//import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  selectedChild: any;
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;

  constructor(
    platform: Platform,
    private storage: Storage,
    statusBar: StatusBar, splashScreen: SplashScreen,
    private backgroundMode: BackgroundMode,
    private trackApi: TrackApi
  ) {
    platform.ready().then(() => {
      this.backgroundMode.enable();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      storage.get('child').then((val) => {
        if (val != null) {
          this.selectedChild = val;

          console.log(this.selectedChild);
          this.trackApi.getChildById(this.selectedChild.id).subscribe((data) => {
            if (data) {
              this.selectedChild=data;
              this.rootPage = HomePage;
              statusBar.styleDefault();
              splashScreen.hide();
            }
            else{
              this.rootPage = LoginPage;
              statusBar.styleDefault();
              splashScreen.hide();
            }
          
           
            
          }, (error) => {
               this.rootPage = LoginPage;
              statusBar.styleDefault();
              splashScreen.hide();
          })

        }
        else {
          this.rootPage = LoginPage;
          statusBar.styleDefault();
          splashScreen.hide();
        }

      });


    });
  }


  logout() {

    this.storage.clear();
    this.nav.setRoot(LoginPage);
    this.nav.popToRoot();

  }
    profile() {
    this.nav.push(ChildProfilePage);
  }
}

