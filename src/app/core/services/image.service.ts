import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class ImageService {

  constructor(private http: HttpClient) { }

  // url to formData
  public urltoFormData(url): FormData {
    if (!url) {
      return new FormData();
    }
    const block = url.split(';');
    // Get the content type of the image
    const contentType = block[0].split(':')[1]; // In this case "image/png"
    // get the real base64 content of the file
    const realData = block[1].split(',')[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."
    // Convert it to a blob to upload
    const blob = this.b64toBlob(realData, contentType, 512);
    const formData = new FormData();
    formData.append('image', blob);
    return formData;
  }

  // convert base64 to blob
  private b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const binary_string =  window.atob(b64Data);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return new Blob([bytes.buffer], {type: contentType});
  }

  // upload image using formData
  public uploadImage(formData): Observable<any> {
    return this.http.post(environment.ORCA_API + 'uploaded_images', formData);
  }

}
