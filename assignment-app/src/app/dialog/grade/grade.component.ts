import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {
  grade = 20;
  comment = '';

  constructor(private dialogRef: MatDialogRef<GradeComponent>) { }

  ngOnInit(): void {
  }

  onSubmit(event): void{
    event.preventDefault();

    console.log(this.grade);
    console.log(this.comment);
    // les deux champs sont obligatoires...
    if (!this.grade) { return; }
    if (!this.comment) { return; }

    this.dialogRef.close([this.grade, this.comment]);
  }

  // Fermer le dialog
  closeDialog(): void{
    this.dialogRef.close(null);
  }
}
