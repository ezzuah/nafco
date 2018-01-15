import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { AddFarmPage } from '../pages/add-farm/add-farm';
import { AddFarmAllPage } from '../pages/add-farm-all/add-farm-all';
import { AddFarmFarmerSelectPage } from '../pages/add-farm-farmer-select/add-farm-farmer-select';
import { AddFarmerPage } from '../pages/add-farmer/add-farmer';
import { AddFarmerMultiplePage } from '../pages/add-farmer-multiple/add-farmer-multiple';
import { AddFarmerSelectPage } from '../pages/add-farmer-select/add-farmer-select'
import { MyApp } from './app.component';
import { DirectionsPage } from '../pages/directions/directions';
import {FarmerLbcTransactionsConfirmPage} from '../pages/farmer-lbc-transactions-confirm/farmer-lbc-transactions-confirm'
import {FarmerLbcTransactionsNewPage} from '../pages/farmer-lbc-transactions-new/farmer-lbc-transactions-new'
import { HomePage } from '../pages/home/home';
import { MyfarmersPage } from '../pages/myfarmers/myfarmers';
import { TransactionsnewPage } from '../pages/transactions-new/transactions-new';
import { TransactionsnewconfirmPage } from '../pages/transactions-new-confirm/transactions-new-confirm';
import { LbcnewtransactionconfirmPage } from '../pages/lbc-new-transactions-confirm/lbc-new-transactions-confirm';
import { PendingCompletePasswordPage } from '../pages/pending-complete-password/pending-complete-password';
import { PendingCompleteSMSPage } from '../pages/pending-complete-sms/pending-complete-sms';
import { PendingOptionsPage } from '../pages/pending-options/pending-options';
import { RoutesPage } from '../pages/routes/routes';
import { RoutesListPage } from '../pages/routes-list/routes-list';
import { RoutesViewPage } from '../pages/routes-view/routes-view';
import { SettingsPage } from '../pages/settings/settings';
import { StocksPage } from '../pages/stocks/stocks';
import { TransactionsPage } from '../pages/transactions/transactions';
import { LbctransactionsPage } from '../pages/lbc-transactions/lbc-transactions';
import { LbcTransactionsNewPage } from '../pages/lbc-transactions-new/lbc-transactions-new';
import { LogOnPasswordChangePage } from '../pages/logon-password-change/logon-password-change';
import { UserPage } from '../pages/user/user';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Network } from '@ionic-native/network';
import { FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DatePipe } from '@angular/common';

import { GlobalAPI} from '../pages/global'


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AccountPage,
    AddFarmPage,
    AddFarmAllPage,
    AddFarmFarmerSelectPage,
    AddFarmerPage,
    AddFarmerMultiplePage,
    AddFarmerSelectPage,
    DirectionsPage,
    FarmerLbcTransactionsConfirmPage,
    FarmerLbcTransactionsNewPage,
    HomePage,
    MyfarmersPage,
    TransactionsnewPage,
    LogOnPasswordChangePage,
    TransactionsnewconfirmPage,
    LbcnewtransactionconfirmPage,
    PendingCompletePasswordPage,
    PendingCompleteSMSPage,
    PendingOptionsPage,
    RoutesPage,
    RoutesListPage,
    RoutesViewPage,
    SettingsPage,
    StocksPage,
    TransactionsPage,
    LbctransactionsPage,
    LbcTransactionsNewPage,
    UserPage
  ],
  imports: [
    BrowserModule,HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AccountPage,
    AddFarmPage,
    AddFarmAllPage,
    AddFarmFarmerSelectPage,
    AddFarmerPage,
    AddFarmerMultiplePage,
    AddFarmerSelectPage,
    DirectionsPage,
    FarmerLbcTransactionsConfirmPage,
    FarmerLbcTransactionsNewPage,
    HomePage,
    MyfarmersPage,
    TransactionsnewPage,
    LogOnPasswordChangePage,
    TransactionsnewconfirmPage,
    LbcnewtransactionconfirmPage,
    PendingCompletePasswordPage,
    PendingCompleteSMSPage,
    PendingOptionsPage,
    RoutesPage,
    RoutesListPage,
    RoutesViewPage,
    SettingsPage,
    StocksPage,
    TransactionsPage,
    LbctransactionsPage,
    LbcTransactionsNewPage,
    UserPage
  ],
  providers: [
    StatusBar, GlobalAPI,
    SplashScreen,Geolocation,SQLite,LocationAccuracy,Network,Camera,FileTransfer,File,DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
