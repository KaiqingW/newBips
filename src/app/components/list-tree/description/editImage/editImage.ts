import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";

@Component({
  selector: "edit-image",
  templateUrl: "./editImage.html",
  styleUrls: ["./editImage.scss"]
})
export class EditImageComponent implements OnInit {
  selectedFiles: FileList;
  imagePath;

  @Input() hasImage: boolean;
  @Output() sendImage = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    const file = this.selectedFiles.item(0);
    this.uploadFile(file);
  }

  async uploadFile(file) {
    const contentType = file.type;
    const bucket = new S3({
      accessKeyId: "AKIARX7CGTDM6LVU6R5A",
      secretAccessKey: "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",
      region: "us-east-2"
    });
    const params = {
      Bucket: "orcasmart",
      Key: "category/" + file.name,
      Body: file,
      ACL: "public-read",
      ContentType: contentType
    };
    this.imagePath = await new Promise((resolve, reject) => {
      bucket.upload(params, function (err, data) {
        if (err) {
          console.log("There was an error uploading your file: ", err);
          reject("something wrong");
        }
        console.log("Successfully uploaded file.", data);
        resolve(data["Location"]);
      });
    });
    this.sendImage.emit(this.imagePath);
    this.hasImage = true;
  }
}
