import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { RichTextComponent } from './rich-text';

@NgModule({
  declarations: [
    RichTextComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    RichTextComponent
  ]
})
export class RichTextComponentModule {}
