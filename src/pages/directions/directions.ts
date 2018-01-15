import {  Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage'


@Component({
  selector: 'page-directions',
  templateUrl: 'directions.html'
})
export class DirectionsPage {z
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
map: any;
lng :  any;
lat :any;
data: any;
user_destination: string;
user_location: string;


  constructor(public navCtrl: NavController,
              public navparams: NavParams,
              public LoadingController: LoadingController,
              public geolocation: Geolocation,
              public http: Http,
              public storage: Storage) {
       
  }

  

  ionViewDidLoad(){
  //alert(this.navparams.data.farm_address)
  let loader = this.LoadingController.create({
    content: 'Getting Directions'
    });
    loader.present().then(()=>{
this.geolocation.getCurrentPosition({
enableHighAccuracy:true

}).then((resp) => {
console.log(resp.coords.latitude)
console.log(resp.coords.longitude)
this.lng = resp.coords.longitude;
this.lat = resp.coords.latitude;

let latLng = new google.maps.LatLng(this.lat, this.lng);
let mapOptions = {
  center: latLng,
  zoom: 15,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}

this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


var geocoder;
geocoder = new google.maps.Geocoder();
var latlng = new google.maps.LatLng(this.lat, this.lng);

geocoder.geocode(
    {'latLng': latlng}, 
    function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    this.address= results[0].formatted_address ;
                    localStorage.setItem('user_location',this.address)
                    //alert('this is my location'+ this.address)

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



this.user_location = localStorage.getItem('user_location')

   this.user_location = JSON.stringify(this.user_location);
   this.user_destination = this.navparams.data.farm_address;

     let directionsService = new google.maps.DirectionsService;
     let directionsDisplay = new google.maps.DirectionsRenderer;

     directionsDisplay.setMap(this.map);
     loader.dismiss();
     //directionsDisplay.setPanel(this.directionsPanel.nativeElement);

     directionsService.route({
         origin: this.user_location,
         destination: this.user_destination,
         travelMode: google.maps.TravelMode['DRIVING']
     }, (res, status) => {

         if(status == google.maps.DirectionsStatus.OK){
             directionsDisplay.setDirections(res);
         } else {
             console.warn(status);
         }
        });
     
     });
     
})


    }
}

