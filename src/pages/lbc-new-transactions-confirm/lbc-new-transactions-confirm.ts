import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, ToastController,ViewController, ModalController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Http} from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LbctransactionsPage} from '../../pages/pages'

@Component({
  selector: 'page-new-transaction-confirm-lbc',
  templateUrl: 'lbc-new-transactions-confirm.html'
})
export class LbcnewtransactionconfirmPage {

  get_seed_name:any;
  product_id:any;
  quantity:any;
  total:any;
  supplier:any;
  supplier_id:any;
  status:any;
  tcode:any;
  tdate:any;
  trans_type:any;
  check_code:any;
  user_code:any;
  where_status:any;
  id:any;

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

    this.where_status=JSON.stringify('transacted');

      this.confirm_form = this.formBuilder.group({
      user_code: ['', Validators.required]


      });

  }

  closeModal() {
    this.viewctrl.dismiss();
  }

  transaction(){
    this.check_code= localStorage.getItem('tcode');
    let loader = this.LoadingController.create({
    content: 'Please Wait'
    });
    loader.present().then(()=>{

    if(this.check_code===this.user_code){
      this.tdate = localStorage.getItem('nav_date');
      this.sqlite.create({
        name: 'nafco.db',
        location: 'default'
        })
        .then((db: SQLiteObject) => {

        db.executeSql('select * from lbc_transactions order by id DESC', {}).then((data) => {
        
        this.id = (JSON.stringify(data.rows.item(0).id));
        this.product_id = data.rows.item(0).product_id;
        this.total = data.rows.item(0).total;
        this.quantity = data.rows.item(0).quantity;
        this.tcode= data.rows.item(0).tcode;


        this.http.post("http://51.140.49.106/bufferstock/app/new_transaction_lbc.php", { 
          'quantity': this.quantity,
          'total':this.total,
          'category_id':this.product_id, 
          'trans_type':this.trans_type,
          'trans_code':this.tcode,
          'supplier_id':this.supplier_id,
          'tdate':this.tdate}).map(res => res.json()) .subscribe(data => {
        console.log(JSON.stringify(data))
        });

        db.executeSql('UPDATE lbc_transactions SET status = ' + this.where_status + 'WHERE id='+ this.id , {}).then((data) => {
        //alert("UPDATED:" + JSON.stringify(data));
        }, (err) => {
        alert('Unable to execute sql: '+JSON.stringify(err));
        });

        })
    
        }, (err) => {
        //alert('Unable to execute sql: '+JSON.stringify(err));
        });
        //localStorage.removeItem('tcode');
        loader.dismiss();
        let toast = this.toastcontroller.create({
          message:'Transaction is made successfully',
          duration:5000,
          position:'bottom'
        });
        this.closeModal();
        toast.present();
        
      this.navCtrl.push(LbctransactionsPage)
      this.navCtrl.setRoot(LbctransactionsPage);
        

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
