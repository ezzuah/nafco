import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, ToastController,ViewController, ModalController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Http} from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TransactionsPage} from '../../pages/pages'


@Component({
  selector: 'new-transaction-confirm',
  templateUrl: 'transactions-new-confirm.html',
})
export class TransactionsnewconfirmPage {

  get_seed_name:any;
  product_id:any;
  product:any;
  get_unit_price:any;
  get_unit_weight:any;
  quantity:any;
  total:any;
  reciever:any;
  reciever_id:any;
  supplier:any;
  supplier_id:any;
  total_weight:any;
  status:any;
  tcode:any;
  tdate:any;
  farm_name:any;
  trans_type:any;
  check_code:any;
  user_code:any;
  where_status:any;
  id:any;
  user_id:any;
  stock_limit:any;
  limit:any;
  farmer_name_check:any;
  nafco:any;
  warehouse:any;
  username:any;
  nafco_contact:any;
  farmer_contact:any;
  warehouse_id:any;

  cat:any;
  seeds:any;
  search_results:any;
  

  public confirm_form : FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public http: Http, 
              public toastcontroller: ToastController, 
              public LoadingController: LoadingController,
              public sqlite: SQLite,
              public storage: Storage,
              public formBuilder: FormBuilder,
              public viewctrl: ViewController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
              
            this.tcode=Math.floor(100000 + Math.random() * 900000);
            this.reciever=this.navParams.data.farmer_name;
            this.reciever_id=this.navParams.data.reciever_id;
            this.supplier_id=this.navParams.data.supplier_id;
            this.farm_name=this.navParams.data.farm_name;
            this.check_code= localStorage.getItem('tcode');
            this.where_status=JSON.stringify('transacted');
            this.farmer_name_check=localStorage.getItem('farmer_name_check');
            this.supplier=localStorage.getItem('company_name');
            this.user_id = localStorage.getItem("user_id");
            this.stock_limit = localStorage.getItem("stock_limit");
            
            
            

            // this.storage.get('user_role').then(user_role=>{(user_role);
            // this.trans_type=user_role});

            this.trans_type=localStorage.getItem('user_role');
            this.nafco=this.navParams.data.nafco;
            //alert(this.tcode)

            this.confirm_form = this.formBuilder.group({
            user_code: ['', Validators.required]
            });
            
  }

  closeModal() {
    this.viewctrl.dismiss();
  }

  ionViewDidLoad() {
    //alert('this is supplier id' + this.supplier_id + 'and this is reciever id' +this.reciever_id)
  }




      transaction(){
        this.check_code= localStorage.getItem('tcode');
        this.tdate= localStorage.getItem('nav_date');
        this.farmer_contact = localStorage.getItem('farmer_contact');
        let loader = this.LoadingController.create({
        content: 'Please Wait'
        });
        loader.present().then(()=>{

        if(this.check_code===this.user_code){

          this.sqlite.create({
            name: 'nafco.db',
            location: 'default'
            })
            .then((db: SQLiteObject) => {

            db.executeSql('select * from transactions order by id DESC', {}).then((data) => {
            
            this.id = (JSON.stringify(data.rows.item(0).id));
            this.quantity = data.rows.item(0).quantity;
            this.total = data.rows.item(0).total;
            this.product_id = data.rows.item(0).product_id;
            this.product = data.rows.item(0).product;
            this.total_weight= data.rows.item(0).total_weight;
            this.tcode= data.rows.item(0).tcode;
          

            this.http.post("http://51.140.49.106/bufferstock/app/new_transaction.php", { 
              'quantity': this.quantity,
              'total':this.total,
              'product_id':this.product_id, 
              'trans_type':this.trans_type,
              'trans_code':this.tcode,
              'supplier_id':this.supplier_id,
              'tdate':this.tdate,
              'phone_number':this.farmer_contact,
              'tcode':this.tcode,
              'total_weight':this.total_weight,
              'product':this.product,
              'reciever_id':this.reciever_id}).map(res => res.json()) .subscribe(data => {
            console.log(JSON.stringify(data))
            });

            this.http.post("http://51.140.49.106/bufferstock/app/update_stock_lbc.php", { 
              'id': this.user_id,
              'product_name':this.product,
              'quantity':this.quantity
              }).map(res => res.json()) .subscribe(data => {
            console.log(JSON.stringify(data))
            });


            db.executeSql('UPDATE transactions SET status = ' + this.where_status + 'WHERE id='+ this.id , {}).then((data) => {
            //alert("UPDATED:" + JSON.stringify(data));
            }, (err) => {
            alert('Unable to execute sql: '+JSON.stringify(err));
            });

            })
        
            }, (err) => {
            //alert('Unable to execute sql: '+JSON.stringify(err));
            });
            localStorage.removeItem('tcode');
            loader.dismiss();
            let toast = this.toastcontroller.create({
              message:'Transaction is made successfully',
              duration:5000,
              position:'bottom'
            });
            this.closeModal();
            this.navCtrl.pop();
            toast.present();
            
            
            

        }else{
          loader.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: 'Transaction Code is not correct',
            buttons: ['Try Again']
          });
          alert.present();

        }
       
        },error=>{
          console.log(error);
        }) 
      
    }

    transaction_nafco(){
      this.check_code= localStorage.getItem('tcode');
      this.tdate= localStorage.getItem('nav_date');
      this.username = localStorage.getItem("username");
      this.nafco_contact = localStorage.getItem('nafco_contact');
      this.warehouse_id = localStorage.getItem('warehouse_id');
      let loader = this.LoadingController.create({
      content: 'Please Wait'
      });
      loader.present().then(()=>{

      if(this.check_code===this.user_code){

        this.sqlite.create({
          name: 'nafco.db',
          location: 'default'
          })
          .then((db: SQLiteObject) => {

          db.executeSql('select * from transactions order by id DESC', {}).then((data) => {
          
          this.id = (JSON.stringify(data.rows.item(0).id));
          this.quantity = data.rows.item(0).quantity;
          this.total = data.rows.item(0).total;
          this.product_id = data.rows.item(0).product_id;
          this.total_weight= data.rows.item(0).total_weight;
          this.tcode= data.rows.item(0).tcode;
          this.product = data.rows.item(0).product;
          this.warehouse=data.rows.item(0).farm_name;

        this.limit = this.stock_limit - this.quantity
       
        this.http.post("http://51.140.49.106/bufferstock/app/new_transaction_warehouse.php", { 
        'quantity': this.quantity,
        'total':this.total,
        'product_id':this.product_id, 
        'trans_type':'SUP',
        'supplier_id':this.username,
        'processed':'1',
        'description':this.supplier,
        'warehouse':this.warehouse,
        'phone_number':this.nafco_contact,
        'tcode':this.tcode,
        'total_weight':this.total_weight,
        'product':this.product,
        'warehouse_id':this.warehouse_id,
        'tdate':this.tdate}).map(res => res.json()) .subscribe(data => {
      //console.log(JSON.stringify(data))
      
      });

      this.http.post("http://51.140.49.106/bufferstock/app/update_stock_limit.php", { 
        'id': this.user_id,
        'limit':this.limit,
        }).map(res => res.json()) .subscribe(data => {
      //alert('this is limit' + JSON.stringify(data))
      });

      //this is to subtract
      this.http.post("http://51.140.49.106/bufferstock/app/update_lbc_stock_balance.php", { 
        'id': this.user_id,
        'product':this.product,
        'quantity':this.quantity
        }).map(res => res.json()) .subscribe(data => {
      //alert(JSON.stringify(data))
      });

         

          db.executeSql('UPDATE transactions SET status = ' + this.where_status + 'WHERE id='+ this.id , {}).then((data) => {
        //alert("UPDATED:" + JSON.stringify(data));
          }, (err) => {
          alert('Unable to execute sql: '+JSON.stringify(err));
          });

          })
      
          }, (err) => {
          //alert('Unable to execute sql: '+JSON.stringify(err));
          });
          localStorage.removeItem('tcode');
          loader.dismiss();
          let toast = this.toastcontroller.create({
            message:'Transaction is made successfully',
            duration:5000,
            position:'bottom'
          });
          this.closeModal();
          this.navCtrl.pop();
          toast.present();
          
          
          

      }else{
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Transaction Code is not correct',
          buttons: ['Try Again']
        });
        alert.present();

      }
     
      },error=>{
        console.log(error);
      }) 
    
  }
      

}
