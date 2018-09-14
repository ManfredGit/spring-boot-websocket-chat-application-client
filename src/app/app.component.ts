import { Component } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Spring WebSocket Chat';
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient;

  constructor() {
    this.connect();
  }

  connect() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function () {
      that.stompClient.subscribe("/chat", (message) => {
        if (message.body) {
          $(".chat").prepend("<div class='alert alert-secondary flex-wrap'>" + message.body + "</div>");
        }
      });
    });
  }

  sendMessage(message) {
    if (message) {
      this.stompClient.send("/app/send/message", {}, message);
    }
    $('#input').val('');
  }
}
