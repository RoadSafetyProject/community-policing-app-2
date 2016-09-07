import { Component } from '@angular/core';
import { NavController,MenuController,LoadingController,AlertController } from 'ionic-angular';
import { HttpClient } from '../../services/httpclient';
import { Observable }     from 'rxjs/Observable';
import {Camera} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/report/report.html',
  providers: [HttpClient]
})
export class ReportPage {
  public programStages:Array<any>;
  public program:String;
  public dataValues:any = {};
  public base64Image:string;

  constructor(private http:HttpClient,private loadingCtrl: LoadingController,public alertCtrl: AlertController) {
    //alert("Herer");
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    console.log("IROADLOG SENDING REQUEST");
    this.http.get("programs.json?fields=id,name,programStages[programStageDataElements[:all,dataElement[id,name,valueType]]]&filter=name:eq:Community%20Police")
      .subscribe(data => {
        //alert("SUCCESS");
        console.log("IROADLOG SUCCESS:" + data.json());
        let programResults = data.json();
        this.initiateDataValues(programResults.programs[0].programStages[0].programStageDataElements);
        this.program = programResults.programs[0].id;
        this.programStages = programResults.programs[0].programStages[0].programStageDataElements;
        loader.destroy();
        //alert("SUCCESS FINISHED");
      },error =>{
        //alert("ERROR:" + error);
        console.log("IROADLOG SUCCESS:" + error);
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
      this.takePicture();
    }else{
      this.takeVideo();
    }
  }
  private takePicture() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }
  private takeVideo() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      mediaType:Camera.MediaType.VIDEO,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
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
