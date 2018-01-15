import { Component, Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage'



@Injectable()

export class GlobalAPI {

  public menu_status: boolean ;
  public user:string;
  public password_change:string;

constructor(public toast: ToastController,
            public storage: Storage,
            
           ) 
           {
            // this.storage.get('user_role').then(user_role=>{(user_role);
            // this.user=user_role});
            //this.user=localStorage.getItem('user_role');
            
            
  }
}