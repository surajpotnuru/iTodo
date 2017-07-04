import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import * as firebase from 'firebase';
import { CommonProvider } from '../../providers/common/common';
/**
 * Generated class for the AddNotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-note',
  templateUrl: 'add-note.html',
})
export class AddNotePage {

  firedata = firebase.database();
  note = {
    title: 'Untitled Note',
    text: '',
    key: ''
  };
  item: FormControl;
  mode = "add";
  index;
  callback: any;
  constructor(public commonService: CommonProvider,public navCtrl: NavController, public navParams: NavParams,public toastController: ToastController, private formBuilder: FormBuilder, public alertController: AlertController) {
    if(this.navParams.get('editMode')){
      this.mode = "edit";
      this.note = this.navParams.get('note');
      this.index = this.navParams.get("index");
      console.log(this.note);
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNotePage');
    document.getElementById("preview").innerHTML = this.note.text;
    document.getElementById("maineditor").innerHTML = this.note.text;
  }

  saveNote = (_mode)=>{
    this.note.text = this.item.value;
    if(this.note.text == ''){
      let toast = this.toastController.create({
        message: "Cannot save blank note",
        duration: 2000
      });
      toast.present();
    }else{
      if(_mode == 'add'){
          this.firedata.ref('/notes/'+firebase.auth().currentUser.uid).push({
            title: this.note.title,
            text: this.note.text
          }).then((res: any)=>{
            console.log("Note saved",res.path.o[2]);
            this.note.key = res.path.o[2];
            let toast = this.toastController.create({
              message: "Note Saved",
              duration: 2000
            });
            toast.present();
            this.callback = this.navParams.get("callBack");
            this.callback(this.note).then(()=>{
                this.navCtrl.pop();
            });
          }).catch((err)=>{
            console.log(err);
          });
      }
      if(_mode == 'edit'){
        this.firedata.ref('/notes/' + firebase.auth().currentUser.uid + '/' + this.note.key).set({
          title: this.note.title,
          text: this.note.text
        }).then((res: any)=>{
          this.commonService.updateAllNotes().then((res:any)=>{
            this.callback = this.navParams.get("callBack");
            this.callback(res.allNotes).then(()=>{
              let toast = this.toastController.create({
                message: "Note Saved",
                duration: 2000
              });
              toast.present();
              this.navCtrl.pop();
            });
          }).catch((err)=>{
            console.log(err);
          });
        }).catch((err)=>{
          console.log(err);
        });
      }
    }

  };

  editNoteTitle = function(){
    let prompt = this.alertController.create({ 
      title: 'Edit Note Title',
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.note.title = data.title;
          }
        }
      ]
    });
    prompt.present();
  };



  ionViewWillLoad(){
    this.item = this.formBuilder.control('');
  }

}
