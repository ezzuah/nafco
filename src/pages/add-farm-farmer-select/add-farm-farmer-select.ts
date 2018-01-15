import { AddFarmPage } from './../add-farm/add-farm';

import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-add-farm-farmer-select',
  templateUrl: 'add-farm-farmer-select.html'
})
export class AddFarmFarmerSelectPage {
farmers:any;
items:any[];

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public viewctrl: ViewController,
      public http: Http
        ) {

        
     this.initializeItems();

      this.http.get('http://51.140.49.106/bufferstock/app/get_all_farmers_list.php').map(res => res.json()).subscribe(data =>{
        console.log(JSON.stringify(data));
        this.farmers= data;
    })

  }




 


  initializeItems() {
    this.items = this.farmers;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1
      })
    }
  }

  goto_add_farmer($event,item){
      this.navCtrl.push(AddFarmPage,item)
  }
}
