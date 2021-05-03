import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'zip-selector',
  templateUrl: './zipSelector.component.html',
  styleUrls: ['./zipSelector.component.scss']
})
export class ZipSelectorComponent implements OnInit {
  selectLocations: { [key: string]: string | object; }[] = [
    {
      'position': {
        lat: '40.7143',
        lon: '-74.006'
      },
      'name': 'New York City'
    },
    {
      'position': {
        lat: '34.0522',
        lon: '-118.2437'
      },
      'name': 'Los Angeles'
    },
    {
      'position': {
        lat: '36.0443',
        lon: '14.2512'
      },
      'name': 'Gozo'
    }
  ];
  @ViewChild('zipcodeSearch', {static: false}) zipcodeSearch: ElementRef;
  @ViewChild('searchBtn', {static: false}) searchBtn: ElementRef;
  @Output() selectedWeather: EventEmitter<{[key: string]: string | object}> = new EventEmitter();
  error;
  incorrectZipcode: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  getZipcode() {
    // https://app.zipcodebase.com/home
    // API KEY: ca6833e0-aacb-11eb-a418-53385852a3e7
    // https://app.zipcodebase.com/api/v1/search?apikey=ca6833e0-aacb-11eb-a418-53385852a3e7&country=us&codes=10005

    const searchCode = this.zipcodeSearch.nativeElement.value;
    const zipApi = 'https://app.zipcodebase.com/api/v1/search?apikey=ca6833e0-aacb-11eb-a418-53385852a3e7&country=us&codes='+searchCode;

    this.http.get(zipApi)
    .subscribe(zipData => {

      if (zipData['results'][searchCode] === undefined) {
        this.incorrectZipcode = true;
      } else {
        this.incorrectZipcode = false;

        const zipLookUp = {
          'position': {
            lat: zipData['results'][searchCode][0].latitude,
            lon: zipData['results'][searchCode][0].longitude
          },
          'name': zipData['results'][searchCode][0].city + ', ' + zipData['results'][searchCode][0].state_en
        }
        this.selectedWeather.emit(zipLookUp);
      }

    },
    error => {
      console.log('zipData ERROR: ', error);
    });
  }

  selectZip(selectOption: number) {
    this.selectedWeather.emit(this.selectLocations[selectOption]);
  }

  inputValidation() {
    const searchCode = this.zipcodeSearch.nativeElement.value;
    const isNumber = typeof +searchCode === 'number' && !isNaN(+searchCode) ? true : false;
    const isLength = searchCode.length === 5;
    this.searchBtn.nativeElement.disabled = true;

    if (isNumber && isLength) this.searchBtn.nativeElement.disabled = false;
  }
}
