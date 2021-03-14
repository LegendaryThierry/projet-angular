import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<EditAssignmentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {assignmentTitle: string, dateLimite: Date}) { }

  ngOnInit(): void {

  }

  onSubmit(event): void{
    event.preventDefault();

    this.dialogRef.close({assignmentTitle: this.data.assignmentTitle, dateLimite: this.data.dateLimite});
  }

  // Fermer le dialog
  closeDialog(): void{
    this.dialogRef.close(null);
  }

}
