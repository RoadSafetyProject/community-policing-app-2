import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SilentPage } from './silent';

@NgModule({
  declarations: [
    SilentPage,
  ],
  imports: [
    IonicPageModule.forChild(SilentPage),
  ],
})
export class SilentPageModule {}
