import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, ToastController, ModalController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Http} from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
//import { Storage } from '@ionic/storage';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

import { TransactionsnewconfirmPage, TransactionsPage } from '../../pages/pages'




@Component({
  selector: 'new-transaction',
  templateUrl: 'transactions-new.html',
})
export class TransactionsnewPage {

  stock_limit:any;
  get_seed_name:any;
  get_warehouse_name:any;
  product_id:any;
  get_unit_price:any;
  get_unit_weight:any;
  quantity:any;
  total:any;
  reciever:any;
  reciever_id:any;
  supplier_id:any;
  supplier:any;
  user_id:any;
  total_weight:any;
  measure:any;
  status:any;
  tcode:any;
  tdate:any;
  farm_name:any;
  trans_type:any;
  user_type_send:any;
  phone_number:any;
  nafco_phone_number:any;
  nafco:any;
  nafco_region:any;
  nafco_region_id:any;


  cat:any;
  seeds:any;
  search_results:any;

  send_date :any;
  hour:any
  minute
  second:any;
  time_send:any
  formattedDate:any;
  post_date:any;

  

  //public transact_form : FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public http: Http, 
              public toastcontroller: ToastController, 
              public LoadingController: LoadingController,
              public sqlite: SQLite,
              public formBuilder: FormBuilder,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
              
            this.tcode=Math.floor(100000 + Math.random() * 900000);
            this.nafco=this.navParams.data.farmer_name;
            this.nafco_phone_number=this.navParams.data.contact;

            this.reciever=this.navParams.data.farmer_name;
            this.reciever_id=this.navParams.data.farmer_id;
            this.supplier_id=localStorage.getItem('user_id')
            this.supplier=localStorage.getItem('fullname');
            this.user_id=localStorage.getItem('user_id');
            this.stock_limit = localStorage.getItem('stock_limit');

            this.farm_name=this.navParams.data.farm_name;
            this.phone_number=this.navParams.data.farmer_contact;

            this.trans_type=localStorage.getItem('user_role');
            this.status='pending';

            if(this.trans_type==='Seed Distributor'){
              this.user_type_send='FNF'
            }else{
              if(this.trans_type==='LBC' && this.nafco=='NAFCO'){
                this.user_type_send='FLN'
                localStorage.setItem('nafco','NAFCO');
              }else{
                if(this.trans_type==='LBC' && this.nafco!='NAFCO'){
                  this.user_type_send='FFL'
                }
              }
             
            }
            //alert(this.nafco + ' ' +this.user_type_send)

            this.send_date=new Date();
            this.formattedDate=new Date().toISOString().slice(0,10);
            this.hour=this.send_date.getHours();
            this.minute=this.send_date.getMinutes();
            this.second=this.send_date.getSeconds();
            this.time_send=(('0' + this.hour).slice(-2) + ':' + ('0'  + this.minute).slice(-2) + ':' + ('0' + this.second).slice(-2));
            this.post_date= this.formattedDate +''+'T'+''+this.time_send + ''+'Z'
            //alert(this.formattedDate)

            //this.transact_form = this.formBuilder.group({
              //get_unit_weight: ['', Validators.required],
              // unit_price: ['', Validators.required],
              // quantity: ['', Validators.required],
              // total: ['', Validators.required],

            //});

           
             

            
  }

  ionViewDidLoad() {
      this.http.post('http://51.140.49.106/bufferstock/app/get_products.php',{'trans_type':this.user_type_send}).map(res => res.json()).subscribe(data =>{
        console.log(JSON.stringify(data));
        this.seeds= data;
    })

    this.http.post('http://51.140.49.106/bufferstock/app/get_nafco_warehouse.php',{'id':''}).map(res => res.json()).subscribe(data =>{
      console.log(JSON.stringify(data));
      this.nafco_region= data;
  })
  
  }


  get_seed(){
        this.http.post("http://51.140.49.106/bufferstock/app/get_products_search.php", { 'cat': this.product_id,'trans_type':this.user_type_send}).map(res => res.json()) .subscribe(data => {
          console.log(JSON.stringify(data));
          this.search_results=(JSON.stringify(data));
          this.get_unit_weight= data[0].Unit_Weight;
          this.get_unit_price= data[0].Unit_Price;
          this.get_seed_name= data[0].Category_Name;
          this.measure= data[0].Unit_of_Measure;
        });

    }

  
    get_nafco_region(){
      this.http.post("http://51.140.49.106/bufferstock/app/get_nafco_warehouse.php", { 'id': this.nafco_region_id}).map(res => res.json()) .subscribe(data => {
        console.log(JSON.stringify(data));
        //this.search_results=(JSON.stringify(data));
        this.nafco_phone_number= data[0].Contact;
        this.get_warehouse_name= data[0].Warehouse_Name;
        localStorage.setItem('warehouse_id',data[0].ID);
      });

  }

    getInstantTotal() {
      let  firstNumber = this.get_unit_price ? parseFloat(this.get_unit_price) : 0 ;
      let  secondNumber = this.quantity ? parseFloat(this.quantity) : 0;
      this.total= (firstNumber) * (secondNumber) ;

      let  thirdNumber = this.get_unit_weight ? parseFloat(this.get_unit_weight) : 0 ;
      let  fourthNumber = this.quantity ? parseFloat(this.quantity) : 0;
      this.total_weight= (thirdNumber) * (fourthNumber) ;
    }


      transaction(){
        let loader = this.LoadingController.create({
        content: 'Please Wait'
        });
        loader.present().then(()=>{

          if(this.trans_type=='Seed Distributor'){
          
        this.http.post("http://51.140.49.106/bufferstock/app/pending_sms_transaction.php", {'trans_code':this.tcode,'phone_number':this.phone_number,'product':this.get_seed_name,'quantity':this.quantity,'total':this.total}).map(res => res.json()) .subscribe(data => {
          console.log(JSON.stringify(data))
          localStorage.setItem('tcode', this.tcode)
          localStorage.setItem('nav_date',this.post_date)
          localStorage.setItem('farmer_contact',this.phone_number)
        });
      }else{

        this.http.post("http://51.140.49.106/bufferstock/app/pending_sms_lbc_buy.php", {'trans_code':this.tcode,'phone_number':this.phone_number,'product':this.get_seed_name,'quantity':this.quantity,'total':this.total}).map(res => res.json()) .subscribe(data => {
          console.log(JSON.stringify(data))
          localStorage.setItem('tcode', this.tcode)
          localStorage.setItem('nav_date',this.post_date)
          localStorage.setItem('farmer_contact',this.phone_number)
          
        });

      }
    
          this.sqlite.create({
            name: 'nafco.db',
            location: 'default'
            })
            .then((db: SQLiteObject) => {
          db.executeSql("INSERT INTO transactions (product,quantity,total_weight,total,supplier,reciever,status,tcode,tdate,farm_name,supplier_id,reciever_id,product_id,farmer_id,user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
          [this.get_seed_name, this.quantity,this.total_weight +' ' + this.measure ,this.total,this.supplier,this.reciever,this.status,this.tcode,this.formattedDate,this.farm_name,this.user_id,this.reciever_id,this.product_id,this.reciever_id,this.trans_type]).then((data)=> {
            //alert("INSERTED: " + JSON.stringify(data));
          }, (error) => {
            alert("ERROR: " + JSON.stringify(error.err));
          });
          
        });
       
           loader.dismiss();
           let myModal = this.modalCtrl.create(TransactionsnewconfirmPage,{supplier_id: this.user_id, reciever_id:this.reciever_id});
           myModal.present();
           
             let toast = this.toastcontroller.create({
             message:'Transaction is awaiting confirmation code',
             duration:3000,
             position:'bottom'
           });
           toast.present();
    
        },error=>{
          console.log(error);
        }) 
      
    }

    transaction_nafco(){
      if(parseFloat(this.stock_limit) > parseFloat(this.quantity)){
      let loader = this.LoadingController.create({
        content: 'Please Wait'
        });
        loader.present().then(()=>{
          
          this.http.post("http://51.140.49.106/bufferstock/app/pending_sms_lbc_sell_nafco.php", {'trans_code':this.tcode,'phone_number':this.nafco_phone_number,'product':this.get_seed_name,'quantity':this.quantity,'total':this.total}).map(res => res.json()) .subscribe(data => {
            console.log(JSON.stringify(data))
            localStorage.setItem('tcode', this.tcode)
            localStorage.setItem('nav_date',this.formattedDate)
            localStorage.setItem('nafco_contact',this.nafco_phone_number)
            //alert(this.tcode);
          });

          this.sqlite.create({
            name: 'nafco.db',
            location: 'default'
            })
            .then((db: SQLiteObject) => {
          db.executeSql("INSERT INTO transactions (product,quantity,total_weight,total,supplier,reciever,status,tcode,tdate,farm_name,supplier_id,reciever_id,product_id,farmer_id,user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
          [this.get_seed_name, this.quantity,this.total_weight +' ' + this.measure ,this.total,this.supplier,'NAFCO',this.status,this.tcode,this.formattedDate,this.get_warehouse_name,this.user_id,'0',this.product_id,this.reciever_id,this.trans_type]).then((data)=> {
            //alert("INSERTED: " + JSON.stringify(data));
          }, (error) => {
            alert("ERROR: " + JSON.stringify(error.err));
          });
          
        });
      
    });
    
    loader.dismiss();
    let myModal = this.modalCtrl.create(TransactionsnewconfirmPage,{supplier_id: this.user_id,nafco:'NAFCO'});
    myModal.present();

    let toast = this.toastcontroller.create({
      message:'Transaction is awaiting confirmation code',
      duration:5000,
      position:'bottom'
    });
    this.navCtrl.pop();
    toast.present();
    }else{
    
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: 'Please your supply is more than the total you can supply',
              buttons: ['Contact NAFCO']
            });
            alert.present();
          }
        }
}
