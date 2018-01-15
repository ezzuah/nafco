import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TransactionsPage, DirectionsPage} from '../../pages/pages'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the RoutesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-routes',
  templateUrl: 'routes.html',
})
export class RoutesPage {

  items: any;
  route:any;
  params: any ={};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              public LoadingController: LoadingController,
              public alertCtrl: AlertController,
              public sqlite: SQLite
              ) 
              {
             this.route=JSON.stringify(this.navParams.data.route);
            
  }

  getroutes(){
    this.sqlite.create({
      name: 'nafco.db',
      location: 'default'
      })
      .then((db: SQLiteObject) => {
  
  
      //data retrieve section
  
      db.executeSql('select * from farms WHERE farm_route='+ this.route +' order by farm_name asc',{}).then((data) => {
  
     
      this.items = [];
      if(data.rows.length > 0) {
      for(var i = 0; i < data.rows.length; i++) {
      this.items.push({id: data.rows.item(i).id, 
                      farm_name: data.rows.item(i).farm_name,
                      farm_address: data.rows.item(i).farm_address,
                      farm_town: data.rows.item(i).farm_town,
                      farm_route: data.rows.item(i).farm_route,
                      farm_lng: data.rows.item(i).farm_lng,
                      farm_lat: data.rows.item(i).farm_lat});
         //alert(JSON.stringify(this.items));
      }
      }
  
      }, (err) => {
      //alert('Unable to execute sql: '+JSON.stringify(err));
      });
      })
  }

  ngOnInit() {

    let loader = this.LoadingController.create({
      content: 'Please Wait'
      });
      loader.present().then(()=>{
       this.getroutes();
      loader.dismiss();
    })
  }

  filterItems(ev: any) {
    this.getroutes();
    let val = ev.target.value;

    if (val && val.trim() !== '') {
      this.items = this.items.filter(function(item) {
        return item.farm_name.toLowerCase().includes(val.toLowerCase());
      });
    }
  }


  getdirections($event, item){
    this.navCtrl.push(DirectionsPage,item);
  }


}
