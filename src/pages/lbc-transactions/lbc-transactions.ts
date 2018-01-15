import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';


import { LbcnewtransactionconfirmPage } from '../../pages/pages';

@Component({
  selector: 'page-transactions-lbc',
  templateUrl: 'lbc-transactions.html'
})
export class LbctransactionsPage {

  transactions:any; 
  farmers:any;
  pendings:any;
  transacts:any;
  where_pending:any;
  where_transacted:any;
  region_list:any;
  districts_list:any;
  products:any;
  get_product_name:any;

  region:any;
  district:any
  product:any;
  quantity:any;
  unit_price:any;
  total:any;
  tcode:any;
  user_id:any;
  tdate:any;
  supplier:any;
 

send_date :any;
hour:any
minute
second:any;
time_send:any
formattedDate:any;
post_date:any;


 
  

public transaction_form : FormGroup;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public sqlite: SQLite,
              public http: Http,
              public toastcontroller: ToastController,
              public alertCtrl: AlertController,
              public LoadingController: LoadingController,
              public modalCtrl: ModalController,
              public storage: Storage,
              public datepipe: DatePipe,
              public formBuilder: FormBuilder

              ) 
              {
    this.tcode=Math.floor(100000 + Math.random() * 900000);
    this.transactions = "transacted";

    this.storage.get('user_id').then(user_id=>{(user_id);
    this.user_id=user_id});

    this.storage.get('fullname').then(fullname=>{(fullname);
    this.supplier=fullname});

    this.send_date=new Date();
    this.formattedDate=new Date().toISOString().slice(0,10);
    this.hour=this.send_date.getHours();
    this.minute=this.send_date.getMinutes();
    this.second=this.send_date.getSeconds();
    this.time_send=(('0' + this.hour).slice(-2) + ':' + ('0'  + this.minute).slice(-2) + ':' + ('0' + this.second).slice(-2));
    this.post_date= this.formattedDate +''+'T'+''+this.time_send + ''+'Z'
    
    // this.date=new Date();
    // let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
    // alert(this.post_date)

    this.transactions = "transacted";
    this.where_pending= JSON.stringify('pending');
    this.where_transacted= JSON.stringify('transacted');

    this.transaction_form = this.formBuilder.group({
      unit_price: ['', Validators.required],
      quantity: ['', Validators.required],
      total: ['', Validators.required],
      region: ['', Validators.required],
      district: ['', Validators.required],
      product: ['', Validators.required],
    });

  }

  ionViewDidLoad(){

    this.http.get('http://51.140.49.106/bufferstock/app/get_regions.php').map(res => res.json()).subscribe(data =>{
      console.log(JSON.stringify(data));
      this.region_list= data;
    });

    this.http.get('http://51.140.49.106/bufferstock/app/get_seeds.php').map(res => res.json()).subscribe(data =>{
      console.log(JSON.stringify(data));
      this.products= data;
  })

    

    this.sqlite.create({
      name: 'nafco.db',
      location: 'default'
      })
      .then((db: SQLiteObject) => {

      db.executeSql('select * from lbc_transactions  where status =' + this.where_pending , {}).then((data) => {
            this.pendings = [];
            if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
            this.pendings.push({id: data.rows.item(i).id,
                            product: data.rows.item(i).product, 
                            quantity: data.rows.item(i).quantity,
                            total: data.rows.item(i).total,
                            tdate: data.rows.item(i).tdate});
               //alert(JSON.stringify(this.pendings));
            }
            }
        
            }, (err) => {
            alert('Unable to execute sql: '+JSON.stringify(err));
            });

            db.executeSql('select * from lbc_transactions  where status =' + this.where_transacted , {}).then((data) => {
              this.transacts = [];
              if(data.rows.length > 0) {
              for(var i = 0; i < data.rows.length; i++) {
                this.transacts.push({id: data.rows.item(i).id,
                  product: data.rows.item(i).product, 
                  quantity: data.rows.item(i).quantity,
                  total: data.rows.item(i).total,
                  tdate: data.rows.item(i).tdate});
                 //alert(JSON.stringify(data.rows.item(i).pic));
              }
              }
          
              }, (err) => {
              //alert('Unable to execute sql: '+JSON.stringify(err));
              });

      })
  }

  get_districts(){
    this.http.post("http://51.140.49.106/bufferstock/app/get_districts.php", { 'id': this.region}).map(res => res.json()) .subscribe(data => {
      console.log(JSON.stringify(data));
      //this.districts_list=[]
      this.districts_list=(data);
    });

}

get_product(){
  this.http.post("http://51.140.49.106/bufferstock/app/get_seeds_search.php", { 'cat': this.product}).map(res => res.json()) .subscribe(data => {
    console.log(JSON.stringify(data));
    this.get_product_name= data[0].Category_Name;

  });

}

transaction(){

  let loader = this.LoadingController.create({
  content: 'Please Wait'
  });
  loader.present().then(()=>{
    localStorage.setItem('nav_date',this.post_date)
  this.http.post("http://51.140.49.106/bufferstock/app/pending_sms_transaction.php", {'trans_code':this.tcode,'phone_number':'0243212074'}).map(res => res.json()) .subscribe(data => {
    console.log(JSON.stringify(data))
    localStorage.setItem('tcode', this.tcode)
  });

    this.sqlite.create({
      name: 'nafco.db',
      location: 'default'
      })
      .then((db: SQLiteObject) => {
    db.executeSql("INSERT INTO lbc_transactions (product,product_id,quantity,total,supplier,reciever,status,tcode,tdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
    [this.get_product_name,this.product, this.quantity,this.total ,this.supplier,'NAFCO','pending',this.tcode,this.formattedDate]).then((data)=> {
      //alert("INSERTED: " + JSON.stringify(this.get_product_name + '' + this.product));
    }, (error) => {
      alert("ERROR: " + JSON.stringify(error.err));
    });
    
  });
 
     loader.dismiss();
     let myModal = this.modalCtrl.create(LbcnewtransactionconfirmPage,{supplier_id: this.user_id});
     myModal.present();
     

       let toast = this.toastcontroller.create({
       message:'Transaction is awaiting confirmation code',
       duration:5000,
       position:'bottom'
     });
     toast.present();

  },error=>{
    console.log(error);
  }) 



}

getInstantTotal() {
  let  firstNumber = this.unit_price ? parseFloat(this.unit_price) : 0 ;
  let  secondNumber = this.quantity ? parseFloat(this.quantity) : 0;
  this.total= (firstNumber) * (secondNumber) ;


}

}
