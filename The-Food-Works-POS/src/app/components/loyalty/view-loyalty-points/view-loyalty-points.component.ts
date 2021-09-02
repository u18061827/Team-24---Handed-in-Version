import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

export interface customers {
  name: string;
  position: number;
  surname: string;
  telephone: string;
  email: string;
}

const ELEMENT_DATA: customers[] = [
  {position: 3521, name: 'Ellen', surname: 'Smith', telephone: '06144749689', email: 'elsmith54@gmail.com'}
]

@Component({
  selector: 'app-view-loyalty-points',
  templateUrl: './view-loyalty-points.component.html',
  styleUrls: ['./view-loyalty-points.component.scss']
})
export class ViewLoyaltyPointsComponent implements OnInit {

  searchForm!: FormGroup;
  displayedColumns: string[] = ['position', 'name', 'surname', 'telephone', 'email', 'select'];
  dataSource = ELEMENT_DATA;
  panelOpenState = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchInput: [''],
      dateInput: [''],
    });
  }

}
