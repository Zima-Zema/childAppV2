import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TrackApi, IChild, Role } from '../shared/track-api.service'
import { Storage } from '@ionic/Storage';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ChildProfilePage } from '../child-profile/child-profile';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})

export class EditProfilePage {

  childObj: IChild = {
    id: 0,
    parent_Id: 0,
    fname: "",
    lname: "",
    email: "",
    address: {
      city: "",
      country: "",
      street: "",
    },
    password: "",
    imageUrl: "",
    telephone: "",
    userRole: Role.Child,
    viewFlag: true
  };

  profileForm: FormGroup;

  fname: string = '';
  lname: string = '';
  email: string = ''
  password: string = '';
  telephone: string = '';
  address: string = '';
  street: string = '';
  city: string = '';
  country: string = '';
  selectedchild: any = [];
  private captureDataUrl: string = "";
  ////////////////////////////////////
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private trackApi: TrackApi,
    private toastCtrl: ToastController,
    public cam: Camera,
    private formBuilder: FormBuilder) {
    ////////////////////////////
    storage.get('child').then((val) => {
      console.log('child profileeeeeee ', val);
      this.selectedchild = val;
    });
    ////////////////////////////////
    this.profileForm = this.formBuilder.group({
      fname: ['', Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[a-zA-Z ]*')])],
      lname: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
      telephone: ['', Validators.compose([Validators.required, Validators.pattern('^01([0-9]*)$'), Validators.minLength(11), Validators.maxLength(11)])],
      street: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(11)])],
      city: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')])],
      country: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')])]
    });
  }
  /////////////////
  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loader.present().then(() => {
      this.storage.get('child').then((val) => {
        console.log("inside ionViewWillEnter", val);
        this.childObj.id = val.id;
        this.fname = val.fname;
        this.lname = val.lname;
        this.email = val.email;
        this.password = val.password;
        this.telephone = val.telephone;
        this.street = val.address.street;
        this.city = val.address.city;
        this.country = val.address.country;
        loader.dismiss();
      });
    })
  }
  ///////////////////////////////////////////
  openGallery(): void {
    let cameraOptions = {
      sourceType: this.cam.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.cam.DestinationType.DATA_URL,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.cam.EncodingType.JPEG,
      correctOrientation: true
    }
    this.cam.getPicture(cameraOptions).then(file_uri => {
      this.captureDataUrl = 'data:image/jpeg;base64,' + file_uri;
    }
      , (err) => {
        console.log(err)
      });
  }
  /////////////////////////////////////////
  openCamera() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.cam.DestinationType.DATA_URL,
      encodingType: this.cam.EncodingType.JPEG,
      mediaType: this.cam.MediaType.PICTURE,
    };

    this.cam.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      // Handle error
    });
  }
  /////////////////////////////////////////

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }
  DoneEditProfile() {

    console.log("inside DoneEditProfile method");
    let loader = this.loadingCtrl.create({
      content: 'Loading ...',
      duration: 5000,
      dismissOnPageChange: true
    });

    loader.present().then(() => {
      if (this.captureDataUrl != "") {
        let storageRef = firebase.storage().ref();
        const filename = Math.floor(Date.now() / 1000);
        const imageRef = storageRef.child(`images/${filename}.jpg`);
        console.log("storageRef  ", storageRef);
        console.log("this.captureDataUrl ", this.captureDataUrl);
        imageRef.putString(this.captureDataUrl).then((snapshot) => {
          this.childObj.fname = this.profileForm.value.fname;
          this.childObj.lname = this.profileForm.value.lname;
          this.childObj.email = this.profileForm.value.email;
          this.childObj.password = this.profileForm.value.password;
          this.childObj.telephone = this.profileForm.value.telephone;
          this.childObj.userRole = Role.Child;
          this.childObj.viewFlag = true;
          this.childObj.address.city = this.profileForm.value.city;
          this.childObj.address.street = this.profileForm.value.street;
          this.childObj.address.country = this.profileForm.value.country;
          if (storageRef.fullPath != "") {
            this.childObj.imageUrl = snapshot.downloadURL;
          }
          else {
            this.childObj.imageUrl = this.captureDataUrl;
          }
          this.ApiMethod(loader)
        });
      }//if
      else {

        this.childObj.lname = this.profileForm.value.lname;
        this.childObj.email = this.profileForm.value.email;
        this.childObj.password = this.profileForm.value.password;
        this.childObj.telephone = this.profileForm.value.telephone;
        this.childObj.userRole = Role.Child;
        this.childObj.viewFlag = true;
        this.childObj.address.city = this.profileForm.value.city;
        this.childObj.address.street = this.profileForm.value.street;
        this.childObj.address.country = this.profileForm.value.country;
        this.childObj.imageUrl = this.captureDataUrl;

this.ApiMethod(loader)
      }
    })
  }


  ApiMethod(loader) {

    this.trackApi.UpdateChild(this.childObj).subscribe(data => {
      if (data) {
        console.log("inside update child function", data);
        this.storage.clear();
        this.storage.set('child', data);
        loader.dismiss();
        this.navCtrl.push(ChildProfilePage);

        let toast = this.toastCtrl.create({
          message: 'Your data is updated successfully',
          duration: 2500,
          position: 'middle'
        });
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();

      }
    }, (err => {
      loader.dismiss();
      let toast;
      switch (err.status) {
        case 400:
          toast = this.toastCtrl.create({
            message: 'Invalid Data',
            duration: 2000,
            position: 'middle'
          });
          toast.present();
          break;
        case 404:
          toast = this.toastCtrl.create({
            message: 'Not Found',
            duration: 2500,
            position: 'middle'
          });
          toast.present();
          break;

        default:
          toast = this.toastCtrl.create({
            message: 'Connection TimeOut',
            duration: 2500,
            position: 'middle'
          });
          toast.present();
          break;
      }

    }));
  }

}
