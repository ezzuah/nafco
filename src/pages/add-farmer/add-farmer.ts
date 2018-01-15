import { Component } from '@angular/core';
import { Platform, NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';
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
  templateUrl: 'add-farmer.html',
})
export class AddFarmerPage {

lat:any
lng:any;
 photos : any;
// base64Image : string;
// lastImage: string = null;


first_name:any;
last_name:any;
other_names:any; 
farmer_phone:any;
farmer_passcode:any;
farmer_photo:any;


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
        public toastcontroller: ToastController
      ) 
      
            {
        
            this.regis_form = this.formBuilder.group({
              first_name: ['', Validators.required],
              last_name: ['', Validators.required],
              other_names: ['', Validators.required],
              farmer_phone: ['', Validators.required],
              farmer_passcode: ['', Validators.required]
            });
    
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
            'farmer_photo':this.farmer_photo}).map(res => res.json()) .subscribe(data => {
              console.log(JSON.stringify(data));
          
            },err=>{
            loader.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: 'Please check your Internet Connectivity',
              buttons: ['OK']
            });
            alert.present();
            
          })
          loader.dismiss();
          let toast = this.toastcontroller.create({
            message:'Farmer registration was successful',
            duration:3000,
            position:'bottom'
          });
          this.navCtrl.pop();
          toast.present();
          
          
        })
        
  }
  

}
    