import { Component } from '@angular/core';
import { NavController, LoadingController, PopoverController, ToastController, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { LoginPage } from '../login/login';
import { GooglePlus } from '@ionic-native/google-plus';
import { PopoverPage } from '../popover/popover';
import { AddNotePage } from '../add-note/add-note';
import { CommonProvider } from '../../providers/common/common';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: any;
  allNotes = [];
  firedata = firebase.database();
  constructor(public toastController: ToastController,public alertController: AlertController,public commonService: CommonProvider,public navCtrl: NavController,public storage: Storage, public googlePlus: GooglePlus, public loadingController: LoadingController,public popoverController: PopoverController) {

    this.storage.get("userData").then((res: any)=>{
        this.user = res;
        this.storage.get("allNotes").then((res: any)=>{
          this.allNotes = res;
        });
    }).catch((err)=>{
      console.log("Error fetching from Local Storage",err);
    });
    
  }

  

  presentPopover = function($event){
    let popover = this.popoverController.create(PopoverPage);
      popover.present({
        ev: $event
      });
      console.log(this.allNotes);
  };

  deleteAllNotes = ()=>{
    let prompt = this.alertController.create({
      title: "Do you want to delete all Notes ?",
      buttons: [
        {
          text: 'No',
          handler: data=>{
            console.log(data);
          }
        },
        {
          text: 'Yes',
          handler: data=>{
            firebase.database().ref('/notes/' + firebase.auth().currentUser.uid).remove().then(()=>{
              this.commonService.updateAllNotes().then((res: any)=>{
                if(res.success){
                  let toast = this.toastController.create({
                    message: 'All Notes Deleted',
                    duration: 2000
                  });
                  toast.present();
                  this.allNotes = [];
                }
              }).catch((err)=>{
                console.log(err);
              });
            }).catch((err)=>{
              console.log(err);
            });
          } 
        }
      ]
    });
    prompt.present();

  };

  deleteNote = function(noteId,index){
    console.log(noteId,index);
    firebase.database().ref('/notes/' + firebase.auth().currentUser.uid + '/' + noteId).remove().then(()=>{
      let toast = this.toastController.create({
        message: "Note Deleted",
        duration: 2000
      });
      this.allNotes.splice(index,1);
      toast.present();
    }).catch((err)=>{
      console.log("Error");
    })
  }

  addNewNoteCallback = (_params)=>{
      return new Promise((resolve,reject)=>{
        this.allNotes.push(_params);
        resolve();
      });
  };

  addNote = function(){
    this.navCtrl.push(AddNotePage,{
      callBack: this.addNewNoteCallback
    });
  };

  editNoteCallBack = (_params)=>{
    return new Promise((resolve,reject)=>{
      this.allNotes = _params;
      resolve();
    });
  };

  editNote = function(note,index){
    this.navCtrl.push(AddNotePage,{
      callBack: this.editNoteCallBack,
      note: note,
      index: index,
      editMode: true
    });
  }

  


}
