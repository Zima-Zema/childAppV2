import { Component } from '@angular/core';
import { NavController, NavParams , LoadingController} from 'ionic-angular';
import { TrackApi } from '../shared/track-api.service'
import { Storage } from '@ionic/Storage';
import{ EditProfilePage} from '../edit-profile/edit-profile';

@Component({
  selector: 'page-child-profile',
  templateUrl: 'child-profile.html',
})
export class ChildProfilePage {
  fname: string = '';
  lname: string = '';
  email: string = ''
  password: string = '';
  telephone: string = '';
  street: string = '';
  city: string = '';
  country: string = '';
selectedchild:any=[];
 private captureDataUrl: string = '';

  constructor(public navCtrl: NavController,
   public navParams: NavParams, 
   private storage: Storage, 
   private loadingCtrl: LoadingController) {
storage.get('child').then((val) => {
      console.log('child profile ', val);
      this.selectedchild = val;
    });  
}
  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loader.present().then(() => {
      this.storage.get('child').then((val) => {
        if(val.imageUrl!="")
        {
        this.fname = val.fname;
        this.lname = val.lname;
        this.email = val.email;
        this.password = val.password;
        this.telephone = val.telephone;
        this.street = val.address.street;
        this.city = val.address.city;
        this.country = val.address.country;
        this.captureDataUrl=val.imageUrl;
        loader.dismiss();
      }
      else{
  this.fname = val.fname;
        this.lname = val.lname;
        this.email = val.email;
        this.password = val.password;
        this.telephone = val.telephone;
        this.street = val.address.street;
        this.city = val.address.city;
        this.country = val.address.country;
        loader.dismiss();
      }
      });
    })
  }

  EditProfile(){
    this.navCtrl.push(EditProfilePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChildProfilePage');
  }

}
