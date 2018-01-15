import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GlobalAPI} from '../../pages/global'

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController,
              public global: GlobalAPI) {

  }

  change_password(){

  }

  logout(){
    let confirm = this.alertCtrl.create({
        title: 'Logout',
        message: 'Are you sure you want to logout?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('No, staying');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('yes, logging out');
              localStorage.removeItem('fullname');
              localStorage.removeItem('phone_number');
              localStorage.removeItem('user_role');
              localStorage.removeItem('username');
              localStorage.removeItem('user_id');
              localStorage.removeItem('password_change');
              this.navCtrl.push(HomePage);
              this.navCtrl.setRoot(HomePage);
              this.global.menu_status=false;
            }
          }
        ]
      });
      confirm.present();
    }
  



}
