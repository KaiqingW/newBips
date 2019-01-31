import { Component, OnInit, Input } from '@angular/core';
import { WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'weather-full',
  templateUrl: './weatherFull.component.html',
  styleUrls: ['./weatherFull.component.scss']
})
export class WeatherFullComponent implements OnInit {

  @Input() compzipcode;
  lat;
  lng;
  zipcode;
  zipcode2;
  weatherLocation;
  weatherCode;
  weatherList: any = [];
  weatherItem: any = {};
  isLoading = false;

  constructor(
    private weatherService: WeatherService,
  ) {

  }

  ngOnInit() {
    // this.getCurrentUser();
    console.log( this.compzipcode );
    this.zipcode2 = this.compzipcode;
    this.getLocation();
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

  getWeatherList() {
    this.weatherService.getWeather(this.zipcode2)
      .subscribe(
        res => {
          this.isLoading = false;
          if (res.query.results) {
            this.weatherItem = res.query.results.channel.item;
            this.weatherLocation = res.query.results.channel.location;
            this.weatherList = res.query.results.channel.item.forecast;
            // console.log(res.query.results.channel);
            this.weatherCode = 'assets/images/weather/' + this.weatherItem.condition.code + '.png';
          }
          let forecastList = [];
          for (var i = 0; i < this.weatherList.length; i++) {
            this.weatherList[i].code = 'assets/images/weather/' + this.weatherList[i].code + '.png';
            this.weatherList[i].date = this.weatherList[i].date.split(" ")[0];
            forecastList.push(
              this.weatherList[i]
            )
          }
        }
      )
  }

  getLocation() {
    this.isLoading = true;
    if (window.location.protocol != "https:") {
      // console.log(window.location.protocol);
      if (navigator.geolocation) {
        // console.log( navigator.geolocation );
        return navigator.geolocation.getCurrentPosition(
          position => {
            // console.log(position);
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            // console.log(this.lat);
            this.weatherService.getZip(this.lat, this.lng)
              .subscribe(
                res => {
                  // console.log(res);
                  this.zipcode2 = res.results[0].formatted_address.split(", ").reverse()[1].split(" ")[1];
                  // console.log(res.results[0].formatted_address.split(", "));
                  // console.log(this.zipcode2);
                  this.getWeatherList();
                }
              )
          },
          error => {
            this.isLoading = false;
            console.log(this.zipcode2);
            switch (error.code) {
              case 1:
                console.log('Permission Denied');
                alert('Get Location Permission Denied');
                break;
              case 2:
                console.log('Position Unavailable');
                alert('Position Unavailable');
                break;
              case 3:
                console.log('Timeout');
                alert('Timeout');
                break;
            }
            if(this.zipcode2){this.getWeatherList()}else{this.zipcode2=11801;this.getWeatherList()}
          }

        );
      } else {
        this.isLoading = false;
        alert('Position Unavailable');
            if(this.zipcode2){this.getWeatherList()}else{this.zipcode2=11801;this.getWeatherList()}
            // console.log(this);
        // this.getCurrentUser();
      }
    }
  }

}
