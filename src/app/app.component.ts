import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


import {HomePage, RoutesListPage, TransactionsPage, AboutPage, AccountPage, AddFarmerSelectPage, AddFarmerPage, LbctransactionsPage, SettingsPage, StocksPage} from '../pages/pages';

import { GlobalAPI} from '../pages/global'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  user_type:any;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public sqlite: SQLite,
              public modalCtrl: ModalController,
              public global: GlobalAPI) {

    this.global.menu_status
    this.global.user;
    
    this.initializeApp();

    // used for an example of ngFor and navigation
  

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

      
        this.splashScreen.hide();

        this.sqlite.create({
          name: 'nafco.db',
          location: 'default'
  })
  .then((db: SQLiteObject) => {
  
  
  db.executeSql('CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT,fullname,phone_number,username,user_role)', {})
  .then(() => console.log(' User table Executed SQL'))
  .catch(e => console.log(e));

  db.executeSql('CREATE TABLE IF NOT EXISTS farms(id INTEGER PRIMARY KEY AUTOINCREMENT,farm_name,farm_address,farm_town,farm_lng,farm_lat,farm_size,farm_route,farmer_name,region,district,farmer_id,farmer_contact,farmer_passcode,pic)', {})
  .then(() => console.log('my routes table Executed SQL'))
  .catch(e => console.log(e));

  db.executeSql('CREATE TABLE IF NOT EXISTS route_list(id INTEGER PRIMARY KEY AUTOINCREMENT,route,status)', {})
  .then(() => console.log('Executed SQL'))
  .catch(e => console.log(e));

  db.executeSql('CREATE TABLE IF NOT EXISTS transactions(id INTEGER PRIMARY KEY AUTOINCREMENT,product,quantity,total_weight,total,supplier,reciever,status,tcode,tdate,farm_name,supplier_id,reciever_id,product_id,farmer_id,user_type)', {})
  .then(() => console.log('Executed SQL'))
  .catch(e => console.log(e));

  // db.executeSql('CREATE TABLE IF NOT EXISTS lbc_transactions(id INTEGER PRIMARY KEY AUTOINCREMENT,product,product_id,quantity,total,supplier,reciever,status,tcode,tdate)', {})
  // .then(() => console.log('Executed SQL'))
  // .catch(e => console.log(e));
  
  })


    });
  }



  goto_my_routes(){
    this.nav.push(RoutesListPage);
  }

  goto_transactions(){
    this.nav.push(TransactionsPage);
  }

  goto_lbc_transactions(){
    this.nav.push(LbctransactionsPage);
  }


  goto_about_nafco(){
    this.nav.push(AboutPage);
  }
  
  goto_settings(){
    this.nav.push(SettingsPage);

  }

  goto_stocks(){
    this.nav.push(StocksPage);

  }

  goto_my_account(){
    this.nav.push(AccountPage);
  }

  goto_add_farmer_select(){
    let myModal = this.modalCtrl.create(AddFarmerSelectPage);
    myModal.present();
  }



}
