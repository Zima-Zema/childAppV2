import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home'
import { Storage } from '@ionic/Storage';
//import { Storage } from '@ionic/storage';

import { TrackApi, IChild, ILogin } from '../shared/track-api.service';
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

  }


  login: ILogin = {
    email: "",
    password: ""
  }

  ionViewDidLoad() {


  }
  //
  GoToMychild() {
    this.login.email = this.loginForm.value.email
    this.login.password = this.loginForm.value.password
    let loader = this.loadingCtrl.create({
      content: 'Logging In...',
      duration: 10000,
      //dismissOnPageChange:true
    });

    loader.present().then(() => {
      this.trackApi.loginChild(this.login).subscribe((data) => {
        // if(data){

        this.selectedChild = data
        if (this.selectedChild) {
          //this.store.set('userId', this.selectedParent.id);
          this.storage.clear();
          this.storage.set('child', this.selectedChild);
          console.log("selectedChild", this.selectedChild);
          this.navCtrl.setRoot(HomePage);
          this.navCtrl.popToRoot();
          loader.dismiss();


        }


      }, (err) => {
        switch (err.status) {
          // case 0:
          //   this.msg = "Check Your Internet.";
          //   loader.dismiss();
          //   break;
          case 408:
            this.msg = "Connection TimeOut.";
            loader.dismiss();
            break;
          case 400:
            this.msg = "Bad Request.";
            loader.dismiss();
            break;
          case 404:
            this.msg = "Wrong Email Or Password.";
            loader.dismiss();
            break;
          case 403:
            this.msg = "FORBIDDEN.";
            loader.dismiss();
            break;
          default:
            this.msg = "Somting Went Wrong. Please Check Your Connection.";
            loader.dismiss();
            break;
        }




      })
    })


  }

}
