import { Component } from '@angular/core';
import { Platform, NavController, LoadingController, AlertController, ToastController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';



@Component({
  selector: 'page-add-farm',
  templateUrl: 'add-farm.html',
})
export class AddFarmPage {

lat:any
lng:any;
 photos : any;
// base64Image : string;
// lastImage: string = null;


farmer_id:any;
farm_name:any; 
farm_size:any;
farm_lng:any;
farm_lat:any;
farm_region:any;
farm_district:any;
farm_town:any;
farmer_passcode:any;
loc_address:any;
farmer_photo:any;
region_list:any;
districts_list:any;
dist_id:any;

public regis_form : FormGroup;


    constructor(
        public navCtrl: NavController, 
        public http: Http, 
        public geolocation: Geolocation,
        public LoadingController:LoadingController,
        public platform: Platform,
        public alertCtrl: AlertController,
        public network: Network,
        public locationAccuracy: LocationAccuracy,
        public camera: Camera,
        public toast: ToastController,
        public Transfer: FileTransfer,
        public file: File,
        public formBuilder: FormBuilder,
        public toastcontroller: ToastController,
        public navparms: NavParams
      ) 
      
            {
        
            this.regis_form = this.formBuilder.group({
              farm_name: ['', Validators.required],
              farm_size: ['', Validators.required],
              farm_region: ['', Validators.required],
              farm_district: ['', Validators.required],
              farm_town: ['', Validators.required],
              
            });

            this.farmer_id=this.navparms.data.ID;
            //alert(this.farmer_id);
    
      }
    
    ionViewDidLoad(){
    localStorage.removeItem('user_location');
      this.http.get('http://51.140.49.106/bufferstock/app/get_regions.php').map(res => res.json()).subscribe(data =>{
        console.log(JSON.stringify(data));
        this.region_list= data;
    })

        this.geolocation.getCurrentPosition({
        enableHighAccuracy:true
        }).then((resp) => {
          console.log(resp.coords.latitude)
          console.log(resp.coords.longitude)
          this.lng = resp.coords.longitude;
          this.lat = resp.coords.latitude;


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
                        console.log("city name is: " + this.address);
                        //this.storage.set('user_location', this.address);
                        localStorage.setItem('user_location',this.address)
                        //alert(this.address)
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

        } 
      //}
      )}

      get_districts(){
        this.http.post("http://51.140.49.106/bufferstock/app/get_districts.php", { 'id': this.farm_region}).map(res => res.json()) .subscribe(data => {
          console.log(JSON.stringify(data));
          //this.districts_list=[]
          this.districts_list=(data);
        });

    }

      ngOnInit() {
        this.photos = [];
      }
      

      takePhoto()
      {
        
         let options = {
             quality: 90,
             allowEdit: true,
             targetWidth: 800,
             targetHeight: 800,
              };
  
  
        this.camera.getPicture(options).then((imageData) => {
         // imageData is either a base64 encoded string or a file URI
         // If it's base64:
  

       const fileTransfer: FileTransferObject = this.Transfer.create();
  
        var options1 = {
           fileKey: 'file',
           fileName: 'name.jpg',
           headers: {}
        
        }
  
    fileTransfer.upload(imageData, 'http://51.140.49.106/bufferstock/app/upload_photo.php', options1)
     .then((data) => {
       // success
       //alert((data.response));
       localStorage.setItem('farmer_photo',data.response) 
     }, (err) => {
       // error
       alert("error"+JSON.stringify(err));
     });
  
  
      });
  
   
  }


    register(){
    this.loc_address=localStorage.getItem('user_location');
    this.farmer_photo=localStorage.getItem('farmer_photo');
          let loader = this.LoadingController.create({
            content: 'Please Wait'
            });
            loader.present().then(()=>{
            
          this.http.post("http://51.140.49.106/bufferstock/app/add_farm.php", { 
            'farm_name': this.farm_name, 
            'farm_size': this.farm_size, 
            'farm_region': this.farm_region, 
            'farm_district': this.farm_district, 
            'farm_town': this.farm_town, 
            'farm_lng': this.lng, 
            'farm_lat': this.lat,
            'farm_owner_id':this.farmer_id,
            'farm_address':this.loc_address}).map(res => res.json()).subscribe(data => {
            console.log(JSON.stringify(data));
          loader.dismiss();
          let toast = this.toastcontroller.create({
            message:'Farmer registration was successful',
            duration:3000,
            position:'bottom'
          });
          toast.present();
          this.navCtrl.pop();
       
      }),err=>{
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Please check your Internet Connectivity',
          buttons: ['OK']
        });
        alert.present();
      }
       
        })
        
  }

}
    