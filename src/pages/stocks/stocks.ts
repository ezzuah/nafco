import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-stocks',
  templateUrl: 'stocks.html',
})
export class StocksPage {

  stocks:any;
  user_id:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public LoadingController: LoadingController,
              public http: Http) {
              
                this.user_id = localStorage.getItem("user_id")
  }

  ionViewDidLoad() {


    let loader = this.LoadingController.create({
      content: 'Loading Stocks...'
      });
      loader.present().then(()=>{
        this.http.get('http://51.140.49.106/bufferstock/app/lbc_stock.php?id"'+ this.user_id).map(res => res.json()).subscribe(data =>{
          console.log(JSON.stringify(data));
          this.stocks= data;
      });
      loader.dismiss();
    })

  }

}
