import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {
    displayName: '',
    imageUrl: '',
    email: '',
    userId: '',
    idToken: ''
  }
  isLoggedIn = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public googlePlus: GooglePlus, public loadingController: LoadingController) {
      this.storage.get('isLoggedIn').then((val)=>{
          if(val){
              firebase.auth().onAuthStateChanged((user)=>{
                if(user){
                    firebase.database().ref('/notes/' + firebase.auth().currentUser.uid).once('value').then((snapshot)=>{
                      var noteData = snapshot.val();
                      var temp = [];
                      for(var key in noteData){
                        noteData[key].key = key;
                        temp.push(noteData[key]);
                      }
                      this.storage.remove("allNotes");
                      this.storage.set("allNotes",temp).then(()=>{
                        this.navCtrl.setRoot(HomePage);
                      }).catch((err)=>{
                        console.log(err);
                      });
                  }).catch(err=>{
                      console.log(err);
                  });
                }
              });
          }else{
            this.isLoggedIn = false; 
          }
      }).catch((err)=>{

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  signInWithGoogle = function(){
      this.googlePlus.login({
        'webClientId': '787181733678-i6iv0bmpgrca5pvk5ie4f1ckoihdt559.apps.googleusercontent.com'
      }).then((res: any)=>{
        let loader = this.loadingController.create({
          content: "Please wait..."
        });
        loader.present();
        console.log("Google Plus Obj",res);
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken)).then((result)=>{
          console.log(result);
          this.storage.set("isLoggedIn",true);
          this.user.displayName = res.displayName;
          this.user.imageUrl = res.imageUrl;
          this.user.email = res.email;
          this.user.userId = res.userId;
          this.user.idToken = res.idToken;
          this.storage.set("userData",this.user);
           firebase.database().ref('/notes/' + firebase.auth().currentUser.uid).once('value').then((snapshot)=>{
              var noteData = snapshot.val();
              var temp = [];
              for(var key in noteData){
                noteData[key].key = key;
                temp.push(noteData[key]);
              }
              this.storage.set("allNotes",temp).then(()=>{
                loader.dismiss();
                this.navCtrl.setRoot(HomePage);
              }).catch((err)=>{
                console.log(err);
              });
          }).catch(err=>{
              console.log(err);
          });
        }).catch((err)=>{
          console.log("Firebase Login Error",err);
        });
      }).catch((err)=>{
        console.log("Google Plus Login Error",err);
      });



  };

}
