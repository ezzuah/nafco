import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-pending-complete',
  templateUrl: 'pending-complete-sms.html'
})
export class PendingCompleteSMSPage {
  check_code:any;
  user_code:any;
  seed_id:any;
  trans_type:any;
  total_weight:any;
  trans_code:any;
  tdate:any;
  reciever_id:any;
  total:any;
  quantity:any;
  supplier_id:any;
  where_status:any;
  id:any;

  public confirm_form : FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public viewctrl: ViewController,
              public LoadingController: LoadingController,
              public alertCtrl: AlertController,
              public toastcontroller: ToastController,
              public sqlite: SQLite,
              public http: Http
            ) {

      
              this.total= localStorage.getItem('total');
              this.seed_id=localStorage.getItem('pending_seed_id');
              this.trans_type=localStorage.getItem('pending_trans_type');
              this.total_weight=localStorage.getItem('pending_total_weight');
              this.trans_code=localStorage.getItem('pending_trans_code');
              this.tdate=localStorage.getItem('pending_tdate');
              this.reciever_id=localStorage.getItem('pending_reciever_id');
              this.supplier_id= localStorage.getItem('user_id');
              this.where_status=JSON.stringify('transacted');
              this.id = JSON.stringify(localStorage.getItem('pending_id'));
              alert(this.id)
  


    this.confirm_form = this.formBuilder.group({
      user_code: ['', Validators.required]
      });

  }

  closeModal() {
    this.viewctrl.dismiss();
  }

  complete_transaction(){
    this.check_code= localStorage.getItem('tcode');
    let loader = this.LoadingController.create({
    content: 'Please Wait'
    });
    loader.present().then(()=>{

    if(this.check_code===this.user_code){

        this.http.post("http://51.140.49.106/bufferstock/app/new_transaction.php", { 
          'quantity': this.quantity,
          'total':this.total,
          'product_id':this.seed_id, 
          'trans_type':this.trans_type,
          'total_weight':this.total_weight,
          'trans_code':this.check_code,
          'supplier_id':this.supplier_id,
          'tdate':this.tdate,
          'reciever_id':this.reciever_id}).map(res => res.json()) .subscribe(data => {
        console.log(JSON.stringify(data))
        });
      
        this.sqlite.create({
          name: 'nafco.db',
          location: 'default'
          })
          .then((db: SQLiteObject) => {

        db.executeSql('UPDATE transactions SET status = ' + this.where_status + 'WHERE id=' + this.id , {}).then((data) => {
        console.log("UPDATED now:" + JSON.stringify(data));
        }, (err) => {
        console.log('Unable to execute sql: '+JSON.stringify(err));
        });

       
    
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
