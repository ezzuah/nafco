import { AccountPage } from './../account/account';

import { Component } from '@angular/core';
import {  NavController, NavParams,ViewController, MenuController } from 'ionic-angular';

import { AddFarmAllPage, AddFarmerPage, AddFarmFarmerSelectPage, AddFarmerMultiplePage} from '../../pages/pages'

@Component({
  selector: 'page-add-farmer-select',
  templateUrl: 'add-farmer-select.html'
})
export class AddFarmerSelectPage {

display:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,public viewctrl: ViewController, public menuCtrl: MenuController) {

    this.display=localStorage.getItem('user_role');

  }



  closeModal() {
    this.viewctrl.dismiss();
  }


  goto_add_farmer_all(){
    this.navCtrl.push(AddFarmAllPage);
    //this.navCtrl.setRoot(AccountPage);
    
  }

  goto_add_farmer(){
    this.navCtrl.push(AddFarmerPage);
  }

  goto_select_farmer(){
    this.navCtrl.push(AddFarmFarmerSelectPage);
  }

  goto_add_multiple(){
    this.navCtrl.push(AddFarmerMultiplePage);
  }

}
