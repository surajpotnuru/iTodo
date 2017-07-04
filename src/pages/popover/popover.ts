import { Component } from '@angular/core';
import { NavController, LoadingController, PopoverController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { LoginPage } from '../login/login';
import { GooglePlus } from '@ionic-native/google-plus';
/**
 * Generated class for the PopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})

export class PopoverPage {
user: any;
imageUrl = '';
displayName = '';
constructor(public navCtrl: NavController,public storage: Storage, public googlePlus: GooglePlus, public loadingController: LoadingController,public popoverController: PopoverController) {
    this.storage.get("userData").then((res: any)=>{
        this.user = res;
        this.imageUrl = this.user.imageUrl;
        this.displayName = this.user.displayName;
        console.log(res);
    }).catch((err)=>{
      console.log("Error fetching from Local Storage",err);
    });
  }

  logout = function(){
    let loader = this.loadingController.create({
      content: "Logging out..."
    });
    loader.present();
    this.storage.clear().then(()=>{
      this.googlePlus.login({
        'webClientId': '787181733678-i6iv0bmpgrca5pvk5ie4f1ckoihdt559.apps.googleusercontent.com'
      }).then((res: any)=>{
          this.googlePlus.logout().then(()=>{
                    firebase.auth().signOut().then(()=>{
                      setTimeout(()=>{
                        loader.dismiss();
                        this.navCtrl.setRoot(LoginPage);
                      });
                    }).catch((err)=>{
                      console.log("Error while logging out from firebase",err);
                    });
                  }).catch((err)=>{
                    console.log("Error while logging out form G+",err);
                  });
                  this.navCtrl.setRoot(LoginPage);
              }).catch((err)=>{
                console.log(err);
              });
      });

  };

}
