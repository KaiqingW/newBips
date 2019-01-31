import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  
  Url;
  newsList;
  openUrl: boolean = false;
  
  constructor() {
    this.getNewsList();
  }

  ngOnInit() {
  }

  getNewsList(){

   var url = 'https://newsapi.org/v2/top-headlines?' + 'country=us&' + 'apiKey=714c639bc4f946de8d74ec4a9ee3a3fc';
   var req = new Request(url);
   fetch(req)
   .then((response) => {
    //  this.temp = response.json();
    //  console.log(response.body);
    //  console.log(this.temp);

     response.json().then((data) => {
       this.newsList = data.articles;
      //  console.log(this.newsList);
     }); 
   });
  }
  

  onOpenUrl(news) {
    this.openUrl = true;
    this.Url=news.url;
    // console.log(this.Url);
    
  }
 
  closeModal(){
    this.openUrl = false;
  }

}
