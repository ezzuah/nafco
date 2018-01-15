import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TransactionsPage, DirectionsPage} from '../../pages/pages'
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { RoutesPage} from '../../pages/pages';


@Component({
  selector: 'page-routes-list',
  templateUrl: 'routes-list.html',
})
export class RoutesListPage {

  routes_list: any;
  params: any ={};
  username:any;
  test:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              public LoadingController: LoadingController,
              public alertCtrl: AlertController,
              public storage: Storage,
              public sqlite: SQLite
              ) {
                this.storage.get('username').then(username=>{(username);
                this.username=username});
  }

  getroutes(){

    this.sqlite.create({
      name: 'nafco.db',
      location: 'default'
      })
      .then((db: SQLiteObject) => {
  
  
      //data retrieve section
  
      db.executeSql('select COUNT(farm_route) as route_total, farm_route from farms GROUP BY farm_route order by farm_route ASC', {}).then((data) => {
  
     
      this.routes_list = [];
      if(data.rows.length > 0) {
      for(var i = 0; i < data.rows.length; i++) {
      this.routes_list.push({id: data.rows.item(i).id, 
                      route_total: data.rows.item(i).route_total,
                      route: data.rows.item(i).farm_route});
         //alert(JSON.stringify(this.routes_list));
      }
      }
  
      }, (err) => {
      //alert('Unable to execute sql: '+JSON.stringify(err));
      });


      })



  }

  ionViewDidLoad() {

    let loader = this.LoadingController.create({
      content: 'Loading Routes...'
      });
      loader.present().then(()=>{
       this.getroutes();
      loader.dismiss();
    })
  }

  goto_routes($event, item){
    this.navCtrl.push(RoutesPage,item);
  }

}
