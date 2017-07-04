import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

/*
  Generated class for the CommonProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CommonProvider {

  constructor(public storage: Storage) {
    console.log('Hello CommonProvider Provider');
  }

  updateAllNotes = function(){
    var promise = new Promise((resolve,reject)=>{
      firebase.database().ref('/notes/' + firebase.auth().currentUser.uid).once('value').then((snapshot)=>{
        var noteData = snapshot.val();
        var temp = [];
        for(var key in noteData){
          noteData[key].key = key;
          temp.push(noteData[key]);
        }
        this.storage.remove("allNotes");
        this.storage.set("allNotes",temp).then(()=>{
          resolve({
            success: true,
            allNotes: temp
          });
        }).catch((err)=>{
          reject(err);
        });
      }).catch((err)=>{
        reject(err);
      });
    });
    return promise;
  }


}
