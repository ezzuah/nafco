
import { AddFarmFarmerSelectPage } from './../add-farm-farmer-select/add-farm-farmer-select';
import { Component } from '@angular/core';
import { Nav, NavController, LoadingController, ToastController, AlertController, ModalController, NavParams } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
//import { Storage } from '@ionic/storage'
import 'rxjs/add/operator/map';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';


import { UserPage, DirectionsPage, AccountPage, TransactionsnewPage, TransactionsnewconfirmPage, TransactionsPage} from '../../pages/pages'

import { GlobalAPI} from '../../pages/global'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  public menu_status: boolean = false;

  check_username:any;
  username:any;
  password:any;
  user_role:any;
  fullname:any;
  phone_number:any;
  my_routes:any;
  farms:any;

  public login_form : FormGroup;

  constructor(
    public navCtrl: NavController,
    public LoadingController: LoadingController,
    public toastcontroller: ToastController,
    public http: Http,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public sqlite: SQLite,
    public nav: Nav,
    public gloabl: GlobalAPI) 
  {

    this.login_form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

   
    this.check_username=localStorage.getItem('username');
    this.menu_status=false;
  }

  ionViewDidLoad(){
    if(this.check_username!=undefined){
      this.gloabl.menu_status=true;
      //this.navCtrl.push(AccountPage);
      //this.nav.setRoot(AccountPage);
    }
  //this.navCtrl.push(TransactionsPage);

  }

  userlogin(){

    let loader = this.LoadingController.create({
      content: 'Please Wait'
      });
      loader.present().then(()=>{

    this.http.post("http://51.140.49.106/bufferstock/app/login.php", { 'username': this.username, 'password': this.password }).map(res => res.json()) .subscribe(data => {
      console.log(JSON.stringify(data));
 
      if(data.message!="Incorrect Username or Password"){
    //  this.storage.set('fullname',data[0].Name);
    localStorage.setItem('fullname',data[0].Name);
    localStorage.setItem('phone_number',data[0].Phone_Number);
    localStorage.setItem('user_role',data[0].Role);
    localStorage.setItem('username',this.username);
    localStorage.setItem('user_id',data[0].ID);
    
    this.gloabl.menu_status= true;
    this.gloabl.user= data[0].Role;
    this.gloabl.password_change = data[0].Password_Change

    if(data[0].Role=='LBC'){
      localStorage.setItem('company_name',data[0].Company_Name);
      localStorage.setItem('stock_limit',data[0].LBC_Stock_Limit);
      this.sqlite.create({
        name: 'nafco.db',
        location: 'default'
        })
        .then((db: SQLiteObject) => {

          db.executeSql('DELETE FROM farms WHERE farm_name IS NOT NULL', {}).then((data) => {
          }, (err) => {
          alert('Unable to execute sql: '+JSON.stringify(err));
          });

          this.http.post('http://51.140.49.106/bufferstock/app/user_farmers.php', {route:''}).map(res => res.json()).subscribe(data => {
            const result = data
            .map(item => `('${item.Name}','${item.Address}','${item.Farm_Size}','${item.Latitude}','${item.Longitude}','${item.Town}','${item.Route_ID}','${item.Farmer_Firstname +' ' + item.Farmer_Middlename + ' ' + item.Farmer_Lastname}','${item.Region_Name}','${item.District_Name}','${item.ID}','${item.Farmer_Phone}','${item.Farmer_Passcode}','${item.Farmer_Picture}')`)
            .join(',');
           this.farms=result;
            console.log(this.farms)

            db.executeSql("INSERT INTO farms (farm_name,farm_address,farm_size,farm_lng,farm_lat,farm_town,farm_route,farmer_name,region,district,farmer_id,farmer_contact,farmer_passcode,pic) VALUES " + this.farms , []).then((data) => {
              //alert("INSERTED: " + JSON.stringify(data));
          }, (error) => {
              alert("ERROR: " + JSON.stringify(error.err));
            });
          });

          })
        }
      
     this.navCtrl.push(AccountPage);
     this.nav.setRoot(AccountPage);
    
    }else{
    
    if(data.message=="Incorrect Username or Password"){
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Wrong Username or Password',
        buttons: ['Try Again']
      });
      alert.present();
    }
    }
    loader.dismiss();
    },error=>{
    loader.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: 'Please check your Internet Connectivity',
      buttons: ['Try Again']
    });
    alert.present();
  }) 
 });
      
  
  }
}
