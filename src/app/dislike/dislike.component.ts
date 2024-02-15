import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dislike',
  templateUrl: './dislike.component.html',
  styleUrls: ['./dislike.component.scss']
})
export class DislikeComponent{
  @Input() showDislikeBox: boolean = false;
  @Output() cancelDislike = new EventEmitter<boolean>();
  // showDislikeBox: boolean = true;
  constructor() {
    // document.addEventListener('DOMContentLoaded', () => {
    //   const cancelButton = document.querySelector('.cancel-button');
    //   cancelButton?.addEventListener('click', this.cancelButtonClicked.bind(this));
    // });
  }
  
  cancelDislikeButton() {
  this.cancelDislike.emit(true);
  // this.showDislikeBox = false;
}
}
