import { Component } from '@angular/core';
import { Platform, NavController, LoadingController, AlertController, ToastController, MenuController } from 'ionic-angular';
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
  selector: 'page-add-farmer',
  templateUrl: 'add-farm-all.html',
})
export class AddFarmAllPage {

lat:any
lng:any;
 photos : any;
// base64Image : string;
// lastImage: string = null;


first_name:any;
last_name:any;
other_names:any;
farmer_phone:any;
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
get_farmer_id:any;


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
        public menuCtrl: MenuController
      ) 
      
            {
        
            this.regis_form = this.formBuilder.group({
              first_name: ['', Validators.required],
              last_name: ['', Validators.required],
              other_names: [''],
              farmer_phone: ['', Validators.required],
              farm_name: ['', Validators.required],
              farm_size: ['', Validators.required],
              farm_region: ['', Validators.required],
              farm_district: ['', Validators.required],
              farm_town: ['', Validators.required],
              farmer_passcode: ['', Validators.required],
            });
    
      }

      // ionViewWillEnter() 
      // { this.menuCtrl.enable(true) }
    
    ionViewDidLoad(){
    localStorage.removeItem('user_location');
      this.http.get('http://51.140.49.106/bufferstock/app/get_regions.php').map(res => res.json()).subscribe(data =>{
        console.log(JSON.stringify(data));
        this.region_list= data;
    })
      // this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        
      //     if(canRequest) {
      //       // the accuracy option will be ignored by iOS
      //       this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      //         () => console.log('Request successful'),
      //         error => console.log('Error requesting location permissions', error)
      //       );
      //     }
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
      


      // takePhoto() {
      //   const options : CameraOptions = {
      //     quality: 80, // picture quality
      //     allowEdit: true,
      //     targetWidth: 800,
      //     targetHeight: 800,
      //     destinationType: this.camera.DestinationType.DATA_URL,
      //     encodingType: this.camera.EncodingType.JPEG,
      //     mediaType: this.camera.MediaType.PICTURE
      //   }
      //   this.camera.getPicture(options) .then((imageData) => {
      //       this.base64Image = "data:image/jpeg;base64," + imageData;
      //       this.photos.push(this.base64Image);
      //       this.photos.reverse();

      //       const fileTransfer: FileTransferObject = this.Transfer.create();
      //             var options1 = {
      //                fileKey: 'file',
      //                fileName: 'name.jpg',
      //                headers: {}
                  
      //             }
            
      //         fileTransfer.upload(imageData, 'http://51.140.49.106/bufferstock/app/upload_photo.php', options1)
      //          .then((data) => {
      //            // success
      //            alert(JSON.stringify(data));
      //            //localstorage save photo name
      //          }, (err) => {
      //            // error
      //            alert("error"+JSON.stringify(err));
      //          });          


      //     }, (err) => {
      //       console.log(err);
      //     });
      // }

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

          this.http.post("http://51.140.49.106/bufferstock/app/add_farmer.php", { 
            'first_name': this.first_name, 
            'last_name': this.last_name, 
            'other_names': this.other_names, 
            'farmer_phone': this.farmer_phone, 
            'farmer_passcode':this.farmer_passcode,
            'farm_name': this.farm_name, 
            'farm_size': this.farm_size, 
            'farm_region': this.farm_region, 
            'farm_district': this.farm_district, 
            'farm_town': this.farm_town, 
            'farm_lng': this.lng, 
            'farm_lat': this.lat,
            'farm_owner_id':this.get_farmer_id,
            'farm_address':this.loc_address,
            'farmer_photo':this.farmer_photo}).map(res => res.json()) .subscribe(data => {
              
              console.log(JSON.stringify(data[0].ID));
              this.get_farmer_id=data[0].ID;
            
          this.http.post("http://51.140.49.106/bufferstock/app/add_farm.php", { 
            'farm_name': this.farm_name, 
            'farm_size': this.farm_size, 
            'farm_region': this.farm_region, 
            'farm_district': this.farm_district, 
            'farm_town': this.farm_town, 
            'farm_lng': this.lng, 
            'farm_lat': this.lat,
            'farm_owner_id':this.get_farmer_id,
            'farm_address':this.loc_address}).map(res => res.json()) .subscribe(data => {
            console.log(JSON.stringify(data));
          loader.dismiss();
          let toast = this.toastcontroller.create({
            message:'Farmer registration was successful',
            duration:3000,
            position:'bottom'
          });
          toast.present();
          this.navCtrl.pop();
          
        })
      },err=>{
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Please check your Internet Connectivity',
          buttons: ['OK']
        });
        alert.present();
      })
       
        })
        
  }
  

}
    