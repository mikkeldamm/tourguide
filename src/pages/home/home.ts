import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import {WebRTCService} from '../../common/webrtc.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  @ViewChild('audioPlayer1') audioPlayer1: ElementRef;
  @ViewChild('audioPlayer2') audioPlayer2: ElementRef;

  public usersIds: string = '';

  constructor(public navCtrl: NavController, public webRTC: WebRTCService) {

  }

  public ngOnInit() {

      const userId = (new Date()).getTime().toString();
      console.log("UserID: ", userId);

      this.webRTC.createPeer(userId);
      this.webRTC.init(this.audioPlayer1.nativeElement, this.audioPlayer2.nativeElement);
  }

  public startCall() {
      console.log('Call to ', this.usersIds);
      this.webRTC.call(this.usersIds.split(','));
  }

  public stopCall() {
      console.log('Stop calling to other user');
  }
}
