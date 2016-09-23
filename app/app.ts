import { Component,ViewChild  } from '@angular/core';
import { ionicBootstrap, Platform,MenuController ,NavController,Nav,Events} from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { HomePage } from './pages/home/home';
import { ReportPage } from './pages/report/report';
import { FacilitiesPage } from './pages/facilities/facilities';
import { SilentPage } from './pages/silent/silent';


@Component({
  //template: '<ion-nav [root]="rootPage"></ion-nav>'
  templateUrl:'build/pages/index.html'
})
export class MyApp {

  @ViewChild(Nav,undefined) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Report', component: ReportPage},
      { title: 'Facilities', component: FacilitiesPage },
      { title: 'Silent', component: SilentPage}
    ];
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  menuClosed() {
    this.events.publish('menu:closed', '');
  }

  menuOpened() {
    this.events.publish('menu:opened', '');
  }
}

ionicBootstrap(MyApp);
