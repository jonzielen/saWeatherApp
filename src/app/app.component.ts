import { Component, OnInit, HostListener, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
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
  currentWeather: { [key: string]: string | number; };
  forecasts: Array<{ [key: string]: string | number }>;
  @ViewChild('attachSticky', {static: false}) attachSticky: ElementRef;
  @ViewChild('stickyNavOffset', {static: false}) stickyNavOffset: ElementRef;

  @HostListener('window:resize', ['$event'])
  onScroll(event) {
    console.log('window resize event');
    this.navResize();
  }

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
    this.navResize();
  }

  navResize() {
    const navClass = 'sticky-nav';
    const snOffset = this.stickyNavOffset.nativeElement.offsetWidth;
    const navElem = this.attachSticky.nativeElement;
    navElem.setAttribute('style', 'width: '+snOffset+'px');
    if (!navElem.classList.contains(navClass)) navElem.classList.add(navClass);
  }
}
