import { Component } from '@angular/core';
import { NavController,MenuController,LoadingController,ToastController } from 'ionic-angular';
import { HttpClient } from '../../services/httpclient';
import { Observable }     from 'rxjs/Rx';
import {Transfer,Camera, MediaCapture, CaptureVideoOptions,MediaFile,CaptureError,Geolocation} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/report/report.html',
  providers: [HttpClient]
})
export class ReportPage {
  programStageDataElements = [];
  program:String;
  dataValues:any = {};
  loader;
  constructor(private http:HttpClient, private loadingCtrl:LoadingController, public toastCtrl: ToastController) {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
  }

  ngOnInit() {
    this.loader.present();
    this.loadData();
  }
  loadData(refresher?):any{
    return this.http.get("programs.json?fields=id,name,programStages[programStageDataElements[:all,dataElement[id,name,valueType,optionSet[:all,options[:all]]]]]&filter=name:eq:Community%20Police")
      .subscribe(data => {

        if (!this.program) {
          let programResults = data.json();
          this.program = programResults.programs[0].id;
          programResults.programs[0].programStages[0].programStageDataElements.forEach((programStageDataElement) =>{
            this.programStageDataElements.push(programStageDataElement);
          })
          this.initiateDataValues();

        }
        if(refresher){
          refresher.complete();
        }
        this.loader.dismiss();
      }, error => {
        if(refresher){
          refresher.complete();
        }
        let toast = this.toastCtrl.create({
          message: 'Error loading data please reload.',
          duration: 3000
        });
        toast.present();

        this.loader.dismiss();
      });
  }
  doRefresh(refresher) {
    this.loadData(refresher);
  }
  initiateDataValues() {
    this.programStageDataElements.forEach(programStageDataElement => {
      this.dataValues[programStageDataElement.dataElement.id] = "";
    })
  }

  private takeShot(dataElement) {
    if (dataElement.name.indexOf('Image') > -1) {
      this.takePicture(dataElement);
    } else {
      this.takeVideo(dataElement);
    }
  }

  private takePicture(dataElement) {
    //noinspection TypeScriptUnresolvedVariable
    Camera.getPicture({
      //destinationType: Camera.DestinationType.DATA_URL,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA
    }).then((imageData) => {
      //alert(imageData);
      //this.base64Image = "data:image/jpeg;base64," + imageData;
      this.dataValues[dataElement.id] = imageData;
    }, (err) => {
      alert(err);
      console.log(err);
    });
  }

  private takeVideo(dataElement) {
    let options:CaptureVideoOptions = {limit: 1};
    MediaCapture.captureVideo(options)
      .then(
        (data) => {
          // imageData is a base64 encoded string
          this.dataValues[dataElement.id] = data[0].fullPath;
        },
        (err:CaptureError) => alert(JSON.stringify(err))
      );
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
          program: this.program,
          user: userJSON.username,
          status: "COMPLETED",
          orgUnit: "zs9X8YYBOnK",
          eventDate: new Date(),
          dataValues: [],
          coordinate: {longitude: 0, latitude: 0}
        }
        let promises = [];
        this.programStageDataElements.forEach(programStageDataElement => {
          if(this.dataValues[programStageDataElement.dataElement.id] != ""){
            if(programStageDataElement.dataElement.valueType == 'FILE_RESOURCE'){
              let fullFilePath = this.dataValues[programStageDataElement.dataElement.id];
              let filename = fullFilePath.replace(/^.*[\\\/]/, '');
              //alert(filename);
              //alert(fullFilePath.replace(filename, ''));
              promises.push(this.upload(fullFilePath).then(fileID =>{
                event.dataValues.push({dataElement: programStageDataElement.dataElement.id, value: fileID});
              }));
            }else{
              event.dataValues.push({dataElement: programStageDataElement.dataElement.id, value: this.dataValues[programStageDataElement.dataElement.id]});
            }
          }
        })
        promises.push(Geolocation.getCurrentPosition().then(data => {
          event.coordinate.latitude = data.coords.latitude;
          event.coordinate.longitude = data.coords.longitude

        },error => {
          loader.dismiss();
        }));
        Promise.all(promises)
          .then(data => {
            this.http.post("events", event)
              .subscribe(data => {
                this.initiateDataValues();
                let toast = this.toastCtrl.create({
                  message: 'Report Sent Successfully.',
                  duration: 3000
                });
                toast.present();
                loader.dismiss();
              },error => {
                loader.dismiss();
              });
          },error => {
            alert("Promises Errors:" + JSON.stringify(error));
          });
      },error => {
        loader.dismiss();
        alert(error)
      });
  }
  upload(fullFilePath: string){
    return new Promise((resolve, reject) => {
      let ft = new Transfer();
      let fileName = fullFilePath.replace(/^.*[\\\/]/, '');
      let options = {
        fileKey: 'file',
        fileName: fileName,
        mimeType: 'image/jpeg',
        chunkedMode: false,
        headers: {
          'Content-Type' : undefined
        },
        params: {
          fileName: fileName
        }
      };

      ft.upload(fullFilePath, this.http.IROADURL + "fileResources", options, false)
        .then((result: any) => {
          let resultJSON = JSON.parse(result.response);

          resolve(resultJSON.response.fileResource.id);
        }).catch((error: any) => {
        reject(error);
      });
    });
  }
}
