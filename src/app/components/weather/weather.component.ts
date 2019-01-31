import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { WeatherService } from '../../core/services/weather.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  @Input() compzipcode;
  lat;
  lng;
  zipcode;
  zipcode2;
  weatherLocation;
  weatherCode;
  weatherList: any = [];
  weatherItem: any = {};


  constructor(
    private weatherService: WeatherService,
    private authService: AuthService,
  ) {

  }

  ngOnInit() {
    // this.getCurrentUser();
    console.log( this.compzipcode );
    this.zipcode2 = this.compzipcode;
    this.getLocation();
    setTimeout(() => {
    // console.log( this.compzipcode );
      
      this.getWeatherList();
    }, 5000);

  }

  // getCurrentUser(){

  //   this.authService.getCurrentUser().subscribe(
  //     res => {
  //       this.zipcode = res.user.address.zipcode;
  //       // console.log(this.zipcode);
  //       this.zipcode2 = this.zipcode;
  //     }
  //   )

  // }

  getWeatherList(){
    this.weatherService.getWeather(this.zipcode2)
    .subscribe(
      res => {
        if(res.query.results){
          this.weatherItem = res.query.results.channel.item;
          this.weatherLocation = res.query.results.channel.location;
          this.weatherList = res.query.results.channel.item.forecast;
          this.weatherCode = 'assets/images/weather/'+this.weatherItem.condition.code+'.png';
        }
        let forecastList = [];
        for (var i = 0; i < this.weatherList.length; i++) {
          this.weatherList[i].code = 'assets/images/weather/'+this.weatherList[i].code+'.png';
          this.weatherList[i].date = this.weatherList[i].date.split(" ")[0];
          forecastList.push(
            this.weatherList[i]
          )
        }
      }
    )
  }

  getLocation(){
    if (window.location.protocol != "https:") {
      // console.log(window.location.protocol);
      if (navigator.geolocation) {
        // console.log( navigator.geolocation );
      return  navigator.geolocation.getCurrentPosition(
          position => {
                  // console.log(position);
                  this.lat = position.coords.latitude;
                  this.lng = position.coords.longitude;
                  // console.log(this.lat);
                  this.weatherService.getZip(this.lat,this.lng)
                  .subscribe(
                    res => {
                      console.log(res);
                      this.zipcode2 = res.results[0].formatted_address.split(", ").reverse()[1].split(" ")[1];
                      console.log(res.results[0].formatted_address.split(", "));
                      console.log(this.zipcode2);
                    }
                  )
          },
          error => {
              switch (error.code) {
                  case 1:
                      console.log('Get Location Permission Denied');
                      break;
                  case 2:
                      console.log('Position Unavailable');
                      break;
                  case 3:
                      console.log('Timeout');
                      break;
              }
              if(this.zipcode2){this.getWeatherList()}else{this.zipcode2=11801;this.getWeatherList()}
          }

        );
      } else {
          alert('Position Unavailable');
          if(this.zipcode2){this.getWeatherList()}else{this.zipcode2=11801;this.getWeatherList()}
          // console.log(this);
          // this.getCurrentUser();
      }
    }
  }

}
