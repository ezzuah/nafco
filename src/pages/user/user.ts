import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Platform , NavController , LoadingController, AlertController} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

import { TransactionsPage, RoutesPage, DirectionsPage} from '../../pages/pages'

declare var google;

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  get_my_routes: any;
  user_route:any;

  public isLocationEnabled 	: boolean 	= false;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  usermap:any;
  lat:any
  lng:any;
  address:any;

  constructor(
    public navCtrl: NavController, 
    public http: Http, 
    public ngZone: NgZone, 
    public geolocation: Geolocation,
    public LoadingController:LoadingController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public network: Network,
    public storage: Storage) {

      this.storage.get('user_route').then(user_route=>{(user_route);
      this.user_route=user_route});

  }
  
ionViewDidLoad(){

  this.myroutes();


    let loader = this.LoadingController.create({
      content: 'Getting your Location'
      });
    loader.present().then(()=>{
    this.geolocation.getCurrentPosition({
      enableHighAccuracy:true

    }).then((resp) => {
      console.log(resp.coords.latitude)
      console.log(resp.coords.longitude)
      this.lng = resp.coords.longitude;
      this.lat = resp.coords.latitude;
      this.storage.set('user_lng', this.lng);
      this.storage.set('user_lat', this.lat);

      var geocoder;
      geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(this.lat, this.lng);
      
      geocoder.geocode(
          {'latLng': latlng}, 
          function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                      if (results[0]) {
                          this.address= results[0].formatted_address ;
                          //var value=add.split(",");
                          //alert("city name is: " + this.address);
                          //this.storage.set('user_location', this.address);
                          localStorage.setItem('user_location',this.address)

                      }
                      else  {
                          alert("address not found");
                      }
              }
               else {
                  alert("Geocoder failed due to: " + status);
              }
          }
      );

      let latLng = new google.maps.LatLng(this.lat,this.lng);
      
          let mapOptions = {
            center: latLng,
            disableDefaultUI: true,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles:[
              {
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#1d2c4d"
                  }
                ]
              },
              {
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#8ec3b9"
                  }
                ]
              },
              {
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#1a3646"
                  }
                ]
              },
              {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "color": "#4b6878"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#64779e"
                  }
                ]
              },
              {
                "featureType": "administrative.province",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "color": "#4b6878"
                  }
                ]
              },
              {
                "featureType": "landscape.man_made",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "color": "#334e87"
                  }
                ]
              },
              {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#023e58"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#283d6a"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#6f9ba5"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#1d2c4d"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#023e58"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#3C7680"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#304a7d"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#98a5be"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#1d2c4d"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#2c6675"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "color": "#255763"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#b0d5ce"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#023e58"
                  }
                ]
              },
              {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#98a5be"
                  }
                ]
              },
              {
                "featureType": "transit",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#1d2c4d"
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#283d6a"
                  }
                ]
              },
              {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#3a4762"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#0e1626"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#4e6d70"
                  }
                ]
              }
            ]
          }
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      
          this.http.get('assets/locations.json').map(res => res.json()).subscribe(data =>{
            //console.log(JSON.stringify(data));
            this.usermap= data;
      
          let markers= this.usermap;
          console.log(JSON.stringify(this.usermap))


          
          //this is to mark user current position on map
          //var iconBase = 'assets/';

          var mypos_marker = new google.maps.Marker({ position: latLng, map: this.map,title:'My Position',animation: google.maps.Animation.BOUNCE});
          mypos_marker.setMap(this.map);
          this.myposinfo(mypos_marker);
      
          //this is mark user's routes on map
          for(let marker of markers) {
            var position = new google.maps.LatLng(marker.latitude, marker.longitude);
            var myroutes = new google.maps.Marker({position: position, title: marker.title});
            myroutes.setMap(this.map);
      
            this.addInfoWindowToMarker(myroutes);
          }
        });
    })
    
  })
  loader.dismiss();
  }

  addInfoWindowToMarker(marker) {
    var infoWindowContent = marker.title;
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  myposinfo(mypos_marker) {
    var infoWindowContent = mypos_marker.title;
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    mypos_marker.addListener('click', () => {
      infoWindow.open(this.map, mypos_marker);
    });
  }

  goto_transactions(){
    this.navCtrl.push(TransactionsPage);
  }

  goto_all_routes(){
    this.navCtrl.push(RoutesPage);
  }

  get_directions($event, item){
    this.navCtrl.push(DirectionsPage,item);
  }

  myroutes(){

    this.http.post("http://51.140.49.106/bufferstock/app/user_routes.php", { 'route_id': this.user_route }).map(res => res.json()) .subscribe(data => {
      console.log(JSON.stringify(data));
      this.get_my_routes= data;
  });
    
  }
  
  
}