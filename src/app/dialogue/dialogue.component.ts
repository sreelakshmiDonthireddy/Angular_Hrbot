import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.scss']
})
export class DialogueComponent {
  @Input() showDialogueBox: boolean = false;
  @Output() cancelClicked = new EventEmitter<boolean>()
  // showDialogueBox: boolean = false;
  // @Input () iconValue!:string
  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      const cancelButton = document.querySelector('.cancel-button');
      cancelButton?.addEventListener('click', this.cancelButtonClicked.bind(this));
    });
  }
  ngOnInit(){
    // console.log(this.iconValue,"iconvalue")
  }
cancelButtonClicked() {
  // this.showDialogueBox = false;
  this.cancelClicked.emit(true);

}
}
