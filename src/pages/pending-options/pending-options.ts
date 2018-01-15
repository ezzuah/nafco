import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Http} from '@angular/http';

import { PendingCompleteSMSPage, PendingCompletePasswordPage } from '../../pages/pages';

@Component({
  selector: 'page-pending-options',
  templateUrl: 'pending-options.html'
})
export class PendingOptionsPage {


  tcode:any;
  contact:any;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewctrl: ViewController,
              public modalCtrl: ModalController,
              public http: Http) {
    
    this.tcode=Math.floor(100000 + Math.random() * 900000);
    this.contact = localStorage.getItem('pending_contact')

  }

  closeModal() {
    this.viewctrl.dismiss();
  }

  confirm_sms(){
    this.http.post("http://51.140.49.106/bufferstock/app/pending_sms_transaction.php", {'trans_code':this.tcode,'phone_number':this.contact}).map(res => res.json()) .subscribe(data => {
      console.log(JSON.stringify(data))
      localStorage.setItem('tcode', this.tcode);
    });
    this.closeModal();
    let myModal = this.modalCtrl.create(PendingCompleteSMSPage);

    myModal.present();
  }

  confirm_passcode(){
    this.closeModal();
    let myModal = this.modalCtrl.create(PendingCompletePasswordPage);
    myModal.present();

  }


}
