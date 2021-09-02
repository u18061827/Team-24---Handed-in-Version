import { CookingList } from './../../../interfaces/manufacturing';
import { ManufacturingService } from './../../../services/manufacturing.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-cooking-list',
  templateUrl: './select-cooking-list.component.html',
  styleUrls: ['./select-cooking-list.component.scss']
})
export class SelectCookingListComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SelectCookingListComponent>, private manufacturingService: ManufacturingService, @Inject (MAT_DIALOG_DATA) public data: {heading: string, message: string}, ) { }

  
  message : any
  cookinglists = this.data.message;

  cookingList: CookingList;

  


  ngOnInit(): void
  {
    this.message =this.manufacturingService.cookingLists;
    
  }

  

  onCancel()
  {
    this.dialogRef.close(false);
  }

  onConfirm(res: string)
  {
    console.log(res);
    if (res == "selected")
    {
      this.dialogRef.close(this.cookingList);
    }
    else{
      this.dialogRef.close(res);
    }
    
  }
  checkCheckBoxvalue(cookingList: CookingList)
  {
    this.cookingList = cookingList;


  }

}
