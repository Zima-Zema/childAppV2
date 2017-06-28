import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login'
import { BackgroundMode } from '@ionic-native/background-mode';

//import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private backgroundMode: BackgroundMode) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.backgroundMode.enable();
            let config = {
        apiKey: "AIzaSyDohpBfcMQaDLWsfeYnULxdfSxVzfLy-SI",
        authDomain: "myapp-891c4.firebaseapp.com",
        databaseURL: "https://myapp-891c4.firebaseio.com",
        projectId: "myapp-891c4",
        storageBucket: "myapp-891c4.appspot.com",
        messagingSenderId: "1034732611687"
      };
      firebase.initializeApp(config);
    });
  }
}

