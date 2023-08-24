import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.css']
})
export class UsernameComponent implements OnInit {
  @Output() userNameEvent = new EventEmitter<string>();

  username = '';
  constructor() { }

  ngOnInit(): void {
  }
setUserName(){
  this.userNameEvent.emit(this.username);
}
}
