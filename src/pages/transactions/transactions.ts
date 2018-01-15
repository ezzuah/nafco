import { Component } from '@angular/core';
import {  NavController, NavParams, ModalController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { TransactionsnewPage, PendingOptionsPage } from '../../pages/pages';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {

  transactions:any; 
  farmers:any;
  lbc_farmers:any;
  user_type:any;
  pendings:any;
  transacts:any;
  where_pending:any;
  where_transacted:any;
  where_user_type:any;
  lbc_sell_type:any;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public sqlite: SQLite,
              public modalCtrl: ModalController,
              public http: Http) {
    

    this.transactions = "transacted";
    this.where_pending= JSON.stringify('pending');
    this.where_transacted= JSON.stringify('transacted');
    this.where_user_type=localStorage.getItem(JSON.stringify('user_role'));
    this.user_type=localStorage.getItem('user_role');

    this.lbc_sell_type= [{"farmer_name": "NAFCO"}]
    //alert(this.user_type)
  }

  //ionViewWillEnter() {  
    ionViewDidLoad(){

      if(this.user_type=='LBC'){
        this.http.get('http://51.140.49.106/bufferstock/app/get_all_farmers_list.php').map(res => res.json()).subscribe(data =>{
          console.log(JSON.stringify(data));
          this.lbc_farmers= data;
      })
      }


    this.sqlite.create({
      name: 'nafco.db',
      location: 'default'
      })
      .then((db: SQLiteObject) => {
  
  
      //data retrieve section
  
      db.executeSql('select * from farms order by farm_name ASC', {}).then((data) => {
      this.farmers = [];
      if(data.rows.length > 0) {
      for(var i = 0; i < data.rows.length; i++) {
      this.farmers.push({id: data.rows.item(i).id, 
                      
                      pic: data.rows.item(i).pic,
                      farm_name: data.rows.item(i).farm_name,
                      farm_address: data.rows.item(i).farm_address,
                      farmer_name: data.rows.item(i).farmer_name,
                      farmer_id: data.rows.item(i).farmer_id,
                      farmer_contact: data.rows.item(i).farmer_contact});
         //alert(JSON.stringify(this.farmers));
      }
      }
  
      }, (err) => {
      //alert('Unable to execute sql: '+JSON.stringify(err));
      });

      db.executeSql('select transactions.id as id,transactions.product as product,transactions.product_id as product_id,transactions.total as total,transactions.reciever as reciever,transactions.total_weight as total_weight,transactions.tdate as tdate, transactions.quantity as quantity,transactions.reciever_id as reciever_id, transactions.user_type as user_type,transactions.status as status,farms.farmer_contact as farmer_contact, farms.pic as pic, farms.farm_name as farm_name from transactions LEFT JOIN farms ON transactions.farmer_id=farms.farmer_id  where status =' + this.where_pending +'order by id desc' , {}).then((data) => {
            this.pendings = [];
            if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
            this.pendings.push({id: data.rows.item(i).id, 
                             pic: data.rows.item(i).pic,
                             product: data.rows.item(i).product,
                             product_id: data.rows.item(i).product_id,
                             farm_name: data.rows.item(i).farm_name,
                             total: data.rows.item(i).total,
                             reciever: data.rows.item(i).reciever,
                             total_weight: data.rows.item(i).total_weight,
                             tdate: data.rows.item(i).tdate,
                             quantity: data.rows.item(i).quantity,
                             reciever_id: data.rows.item(i).reciever_id,
                             user_type: data.rows.item(i).user_type,
                             status: data.rows.item(i).status,
                             farmer_contact: data.rows.item(i).farmer_contact,
                             });
               //alert(JSON.stringify(this.pendings));
            }
            }
        
            }, (err) => {
            //alert('Unable to execute sql: '+JSON.stringify(err));
            });

            db.executeSql('select * from transactions LEFT JOIN farms ON transactions.farmer_id=farms.farmer_id  where status =' + this.where_transacted +'order by id desc', {}).then((data) => {
              this.transacts = [];
              if(data.rows.length > 0) {
              for(var i = 0; i < data.rows.length; i++) {
              this.transacts.push({id: data.rows.item(i).id,
                pic: data.rows.item(i).pic,
                product: data.rows.item(i).product,
                seed_id: data.rows.item(i).seed_id,
                farm_name: data.rows.item(i).farm_name,
                total: data.rows.item(i).total,
                reciever: data.rows.item(i).reciever,
                total_weight: data.rows.item(i).total_weight,
                tdate: data.rows.item(i).tdate,
                quantity: data.rows.item(i).quantity,
                reciever_id: data.rows.item(i).reciever_id,
                user_type: data.rows.item(i).user_type,
                status: data.rows.item(i).status,
                farmer_id: data.rows.item(i).farmer_id,
                });
                 //alert(JSON.stringify(this.transacts));
              }
              }
          
              }, (err) => {
              //alert('Unable to execute sql: '+JSON.stringify(err));
              });

      })
  }

  goto_new_transaction($event,item){
    this.navCtrl.push(TransactionsnewPage,item)
    localStorage.setItem('farmer_name_check',item.farmer_name)
    
  }

 

  goto_options($event,item){
    let myModal = this.modalCtrl.create(PendingOptionsPage,item);
    myModal.present();
    localStorage.setItem('pending_total',item.total);
    localStorage.setItem('pending_seed_id',item.product_id);
    localStorage.setItem('pending_trans_type',item.user_type);
    localStorage.setItem('pending_total_weight',item.total_weight);
    localStorage.setItem('pending_trans_code',item.trans_code);
    localStorage.setItem('pending_supplier_id',item.supplier_id);
    localStorage.setItem('pending_tdate',item.tdate);
    localStorage.setItem('pending_reciever_id',item.reciever_id);
    localStorage.setItem('pending_contact',item.farmer_contact);
    localStorage.setItem('pending_quantity',item.quantity);
    localStorage.setItem('pending_id',item.id);
    
  }

}
