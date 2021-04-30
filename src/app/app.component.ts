import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  private apiSettings: { [key: string]: string; } = {
    apiUrl: 'https://api.openweathermap.org/data/2.5/onecall?',
    lat: '40.7143',
    lon: '-74.006',
    weatherApiKey: '3cbe8bdccbb1230783f543771d3d3386'
  };
  currentWeather: { [key: string]: string; };
  forecasts: Array<{ [key: string]: string }[]>;
  @ViewChild('attachSticky', {static: false}) attachSticky: ElementRef;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData() {
    const apiUrl = this.apiSettings.apiUrl + 'lat=' + this.apiSettings.lat + '&lon=' + this.apiSettings.lon + '&units=imperial' + '&appid=' + this.apiSettings.weatherApiKey;

    this.http.get(apiUrl)
    .subscribe(weatherData => {
      this.currentWeather = weatherData['current'];
      this.forecasts = weatherData['daily'].slice(1, 6);
    });
  }

  ngAfterViewInit() {
    const navElem = this.attachSticky.nativeElement;
    const elemWidth = navElem.offsetWidth;
    navElem.setAttribute('style', 'width: '+elemWidth+'px');
    navElem.classList.add('sticky-nav');
  }
}
