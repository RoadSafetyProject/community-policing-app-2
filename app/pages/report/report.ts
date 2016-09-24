import { Component } from '@angular/core';
import { NavController,MenuController,LoadingController,AlertController } from 'ionic-angular';
import { HttpClient } from '../../services/httpclient';
import { Observable }     from 'rxjs/Observable';
import {Camera, MediaCapture, CaptureVideoOptions,MediaFile,CaptureError} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/report/report.html',
  providers: [HttpClient]
})
export class ReportPage {
  public programStages:Array<any>;
  public program:String;
  public dataValues:any = {};
  public base64Image:any = {};

  constructor(private http:HttpClient,private loadingCtrl: LoadingController,public alertCtrl: AlertController) {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.http.get("programs.json?fields=id,name,programStages[programStageDataElements[:all,dataElement[id,name,valueType]]]&filter=name:eq:Community%20Police")
      .subscribe(data => {
        let programResults = data.json();
        this.initiateDataValues(programResults.programs[0].programStages[0].programStageDataElements);
        this.program = programResults.programs[0].id;
        this.programStages = programResults.programs[0].programStages[0].programStageDataElements;
        /*this.programStages.forEach(function(programStage){
          this.base64Image[programStage.dataElement.id]
        })*/
        loader.destroy();
      },error =>{
        loader.destroy();
      });
    //.catch(this.handleError);
  }
  initiateDataValues(programStageDataElements){
    programStageDataElements.forEach(programStageDataElement => {
      this.dataValues[programStageDataElement.dataElement.id] = "";
    })
  }
  private takeShot(dataElement){
    if(dataElement.name.indexOf('Image') > -1){
      this.takePicture(dataElement);
    }else{
      this.takeVideo(dataElement);
    }
  }
  private takePicture(dataElement) {
    alert("IROADLOG:2");
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA
    }).then((imageData) => {
      alert("IROADLOG:SUCCESS");
      // imageData is a base64 encoded string
      this.base64Image[dataElement.id] = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      alert("IROADLOG:ERR:" + err);
      console.log(err);
    });
  }
  private takeVideo(dataElement) {
    let options: CaptureVideoOptions = { limit: 1 };
    MediaCapture.captureVideo(options)
      .then(
        (data) => {
          // imageData is a base64 encoded string
          this.base64Image[dataElement.id] = data[0].fullPath;
        },
        (err: CaptureError) => alert(err)
      );
    /*Camera.getPicture({
      mediaType: Camera.MediaType.VIDEO,
      sourceType: Camera.PictureSourceType.CAMERA
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image[dataElement.id] = "data:video/mp4;base64," + imageData;
    }, (err) => {
      console.log(err);
    });*/
  }

  private onSubmit() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    // let's log our findings
    this.http.get("me.json")
      .subscribe(user => {
        console.log(user.json());
        let userJSON = user.json();
        let event = {
          program:this.program,
          user:userJSON.username,
          status:"COMPLETED",
          orgUnit: "zs9X8YYBOnK",
          eventDate: new Date(),
          dataValues: []
        }
        for (let dataElement in this.dataValues) {
          event.dataValues.push({dataElement: dataElement, value: this.dataValues[dataElement]});
        }
        console.log('Form submission is ', event);
        this.http.post("events", event)
          .subscribe(data => {
            this.initiateDataValues(this.programStages);
            loader.destroy();
          });
      });


  }
}
