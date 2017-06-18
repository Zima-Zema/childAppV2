import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home'
import { Storage } from '@ionic/Storage';
//import { Storage } from '@ionic/storage';

import { TrackApi, IChild } from '../shared/track-api.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  childs: Array<IChild> = [];
  selectedChild: IChild;
  msg: string = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private trackApi: TrackApi,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private menuCtrl: MenuController
  ) {
    this.menuCtrl.swipeEnable(false);
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
      password: ['', Validators.required],
    });
    //this.menuCtrl.enable(false, 'myMenu');
    //Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
      duration: 5000,
    });

    loader.present().then(() => {
      storage.get('child').then((val) => {
        // console.log('Your name is', val);
        this.selectedChild = val;
        console.log(this.selectedChild);
        if (this.selectedChild != undefined) {
          this.navCtrl.setRoot(HomePage);
          this.navCtrl.popToRoot();
          loader.dismiss();
        }

      });

    })
  }

  ionViewDidLoad() {


  }
  //
  GoToMychild() {
    let email = this.loginForm.value.email;
    let pass = this.loginForm.value.password;
    console.log(email + " - " + pass)
    let loader = this.loadingCtrl.create({
      content: 'Logging In...',
      duration: 10000,
      //dismissOnPageChange:true
    });

    loader.present().then(() => {
      this.trackApi.getChilds().subscribe(data => {
        // if(data){
        this.childs = data;
        this.selectedChild = this.childs.find(p => p.email.toLowerCase() == email.toLowerCase() && p.password == pass)
        if (this.selectedChild != undefined) {
          //this.store.set('userId', this.selectedParent.id);
          this.storage.clear();
          this.storage.set('child', this.selectedChild);
          console.log("selectedChild", this.selectedChild);
          this.navCtrl.setRoot(HomePage);
          this.navCtrl.popToRoot();
          loader.dismiss();
        }
        else {
          this.msg = "Wrong Email Or Password";
          loader.dismiss();
        }
        // }
        // else{
        //   this.msg = "Connection TimeOut Try Again Later.";
        //   loader.dismiss();
        // }

      })
    })

    // loader.onDidDismiss(()=>{
    //    this.msg = "Connection TimeOut Try Again Later.";
    // })


  }

}
