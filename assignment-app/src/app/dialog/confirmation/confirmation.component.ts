import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {question: string}) { }

  ngOnInit(): void {
  }

  onSubmit(event): void{
    event.preventDefault();

    this.dialogRef.close(true);
  }

  // Fermer le dialog
  closeDialog(): void{
    this.dialogRef.close(false);
  }

}
