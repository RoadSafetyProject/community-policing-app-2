import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HttpClientProvider } from "../providers/http-client/http-client";
import { HttpModule } from "@angular/http";
import { MediaCapture } from "@ionic-native/media-capture";
import { Camera } from "@ionic-native/camera";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { Geolocation } from "@ionic-native/geolocation";
import { GoogleMaps } from "@ionic-native/google-maps";

@NgModule({
  declarations: [MyApp, HomePage],
  imports: [BrowserModule, HttpModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage],
  providers: [
    StatusBar,
    MediaCapture,
    Camera,
    GoogleMaps,
    SplashScreen,
    FileTransfer,
    File,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpClientProvider
  ]
})
export class AppModule {}
