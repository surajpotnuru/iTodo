import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { config } from './app.firebase-config';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PopoverPage } from '../pages/popover/popover';
import { IonicStorageModule } from '@ionic/storage';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import { GooglePlus } from '@ionic-native/google-plus';
import { AddNotePage } from '../pages/add-note/add-note';
import { RichTextComponent } from '../components/rich-text/rich-text';
import { CommonProvider } from '../providers/common/common';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    PopoverPage,
    AddNotePage,
    RichTextComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    PopoverPage,
    AddNotePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireModule,
    AngularFireAuth,
    GooglePlus,
    CommonProvider
  ]
})
export class AppModule {}
