import { Injectable } from '@angular/core';

import {WebRTCConfig} from './webrtc.config';

@Injectable()
export class WebRTCService {

    private _userId: string = '';
    private _peer: PeerJs.Peer;
    private _localStream: any;

    myEl: HTMLMediaElement;
    otherEl: HTMLMediaElement;
    onCalling: Function;

    constructor(private config: WebRTCConfig) {
        navigator.getUserMedia = (<any>navigator).getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia;
    }

    createPeer(userId: string) {
        this._userId = userId;
        // Create the Peer object where we create and receive connections.
        this._peer = new Peer(this._userId, this.config.getPeerJSOption());
    }

    init(myEl: HTMLMediaElement, otherEl: HTMLMediaElement) {
        this.myEl = myEl;
        this.otherEl = otherEl;

        // Receiving a call
        this._peer.on('call', (call) => {
            // Answer the call automatically (instead of prompting user) for demo purposes
            call.answer(this._localStream);
            this._step3(call);
        });

        this._peer.on('error', (err) => {
            console.log(err.message);
        });

    }

    call(userIds: string[]) {
        // Initiate a call!
        this._step1(() => {
          userIds.forEach(id => {
            this._peer.call(id, this._localStream);
          });
        });

        //this._step3(call);
    }

    private _step1(cb) {
        // Get audio/video stream
        navigator.getUserMedia({ audio: true, video: false }, (stream) => {

            this._localStream = stream;
            cb();

        }, (error) => {
            console.log(error);
        });
    }

    private _step3(call) {
        // Wait for stream on the call, then set peer video display
        call.on('stream', (stream) => {
            console.log("CALL ANSWERED", this._userId);
            this.otherEl.src = URL.createObjectURL(stream);
            //this.otherEl.src = URL.createObjectURL(stream);
        });

        call.on('close', () => {
            console.log("CALL CLOSED");
        });
    }
}
