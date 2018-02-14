import { Component, OnInit } from "@angular/core";
import { IonicPage, LoadingController, ToastController } from "ionic-angular";
import { HttpClientProvider } from "../../providers/http-client/http-client";
import {
  MediaCapture,
  CaptureError,
  CaptureVideoOptions
} from "@ionic-native/media-capture";
import { Camera } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { Geolocation } from "@ionic-native/geolocation";
import { Observable } from "rxjs/Observable";

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-report",
  templateUrl: "report.html"
})
export class ReportPage implements OnInit {
  programStageDataElements = [];
  program: String;
  dataValues: any = {};
  loader;
  coordinate: any;
  constructor(
    private transfer: FileTransfer,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private httpClient: HttpClientProvider,
    private mediaCapture: MediaCapture,
    private camera: Camera,
    private geolocation: Geolocation
  ) {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
  }

  ngOnInit() {
    this.loader.present();
    this.loadData();
  }
  loadData(refresher?): any {
    this.geolocation.watchPosition({ timeout: 30000 }).subscribe(
      (data: any) => {
        this.coordinate = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude
        };
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );
    return this.httpClient
      .get(
        "programs.json?fields=id,name,programStages[programStageDataElements[:all,dataElement[id,name,valueType,optionSet[:all,options[:all]]]]]&filter=name:eq:Community%20Police"
      )
      .subscribe(
        data => {
          let programResults = data.json();
          this.program = programResults.programs[0].id;
          programResults.programs[0].programStages[0].programStageDataElements.forEach(
            programStageDataElement => {
              this.programStageDataElements.push(programStageDataElement);
            }
          );
          this.initiateDataValues();
          if (refresher) {
            refresher.complete();
          }
          this.loader.dismiss();
        },
        error => {
          if (refresher) {
            refresher.complete();
          }
          let toast = this.toastCtrl.create({
            message: "Error loading data please reload.",
            duration: 3000
          });
          toast.present();
          this.loader.dismiss();
          console.log(JSON.stringify(error));
        }
      );
  }
  doRefresh(refresher) {
    this.loadData(refresher);
  }
  initiateDataValues() {
    this.programStageDataElements.forEach(programStageDataElement => {
      this.dataValues[programStageDataElement.dataElement.id] = "";
    });
  }

  takeShot(dataElement) {
    if (dataElement.name.indexOf("Image") > -1) {
      this.takePicture(dataElement);
    } else {
      this.takeVideo(dataElement);
    }
  }

  takePicture(dataElement) {
    this.camera
      .getPicture({
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA
      })
      .then(
        imageData => {
          this.dataValues[dataElement.id] = imageData;
        },
        err => {
          console.log(err);
        }
      );
  }

  takeVideo(dataElement) {
    let options: CaptureVideoOptions = { limit: 1 };
    this.mediaCapture.captureVideo(options).then(
      data => {
        // imageData is a base64 encoded string
        this.dataValues[dataElement.id] = data[0].fullPath;
      },
      (err: CaptureError) => console.log(JSON.stringify(err))
    );
  }

  onSubmit() {
    let loader = this.loadingCtrl.create({
      content: "Reporting data..."
    });
    loader.present();
    this.httpClient.get("me.json").subscribe(
      user => {
        let userJSON = user.json();
        let event = {
          program: this.program,
          user: userJSON.username,
          status: "COMPLETED",
          orgUnit: "zs9X8YYBOnK",
          eventDate: new Date(),
          dataValues: [],
          coordinate: {
            longitude: this.coordinate.longitude,
            latitude: this.coordinate.latitude
          }
        };
        let numberOfMediaToUpload = this.getNumberOfMediaToUpload();
        if (numberOfMediaToUpload > 0) {
          let uploadedMedia = 0;

          this.programStageDataElements.forEach(programStageDataElement => {
            if (this.dataValues[programStageDataElement.dataElement.id] != "") {
              if (
                programStageDataElement.dataElement.valueType == "FILE_RESOURCE"
              ) {
                let fullFilePath = this.dataValues[
                  programStageDataElement.dataElement.id
                ];
                let filename = fullFilePath.replace(/^.*[\\\/]/, "");
                this.upload(fullFilePath)
                  .then(fileID => {
                    event.dataValues.push({
                      dataElement: programStageDataElement.dataElement.id,
                      value: fileID
                    });
                    uploadedMedia++;
                    if (uploadedMedia == numberOfMediaToUpload) {
                      this.uploadEvent(event, loader);
                    }
                  })
                  .catch(error => {
                    let toast = this.toastCtrl.create({
                      message: "Fail to upload files",
                      duration: 3000
                    });
                    toast.present();
                    loader.dismiss();
                  });
              } else {
                event.dataValues.push({
                  dataElement: programStageDataElement.dataElement.id,
                  value: this.dataValues[programStageDataElement.dataElement.id]
                });
                if (uploadedMedia == numberOfMediaToUpload) {
                  this.uploadEvent(event, loader);
                }
              }
            }
          });
        } else {
          this.programStageDataElements.forEach(
            (programStageDataElement: any) => {
              if (
                this.dataValues[programStageDataElement.dataElement.id] != ""
              ) {
                if (
                  programStageDataElement.dataElement.valueType !=
                  "FILE_RESOURCE"
                ) {
                  event.dataValues.push({
                    dataElement: programStageDataElement.dataElement.id,
                    value: this.dataValues[
                      programStageDataElement.dataElement.id
                    ]
                  });
                }
              }
            }
          );
          this.uploadEvent(event, loader);
        }
      },
      error => {
        loader.dismiss();
        console.log(JSON.stringify(error));
      }
    );
  }

  getNumberOfMediaToUpload() {
    let numberOfMediaToUpload = 0;
    this.programStageDataElements.forEach(programStageDataElement => {
      if (this.dataValues[programStageDataElement.dataElement.id] != "") {
        if (programStageDataElement.dataElement.valueType == "FILE_RESOURCE") {
          numberOfMediaToUpload++;
        }
      }
    });
    return numberOfMediaToUpload;
  }

  uploadEvent(event, loader) {
    this.httpClient.post("events", event).subscribe(
      data => {
        this.initiateDataValues();
        let toast = this.toastCtrl.create({
          message: "Report Sent Successfully.",
          duration: 3000
        });
        toast.present();
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );
  }
  upload(fullFilePath: string) {
    return new Promise((resolve, reject) => {
      let fileTransfer: FileTransferObject = this.transfer.create();
      let fileName = fullFilePath.replace(/^.*[\\\/]/, "");
      let options = {
        fileKey: "file",
        fileName: fileName,
        mimeType: "image/jpeg",
        chunkedMode: false,
        headers: {
          "Content-Type": undefined
        },
        params: {
          fileName: fileName
        }
      };
      fileTransfer
        .upload(
          fullFilePath,
          this.httpClient.user.serverUrl + "fileResources",
          options,
          false
        )
        .then((result: any) => {
          let resultJSON = JSON.parse(result.response);
          resolve(resultJSON.response.fileResource.id);
        })
        .catch((error: any) => {
          console.log("Error" + JSON.stringify(error));
          reject(error);
        });
    });
  }
}
