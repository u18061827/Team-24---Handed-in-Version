import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-add-loyalty-member',
  templateUrl: './add-loyalty-member.component.html',
  styleUrls: ['./add-loyalty-member.component.scss']
})
export class AddLoyaltyMemberComponent implements OnInit {

  searchForm!: FormGroup;
  displayedColumns: string[] = ['position', 'name', 'surname', 'telephone', 'email', 'select'];
  dataSource = ELEMENT_DATA;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchInput: ['', Validators.required],
      dateInput: ['', Validators.required],
    });
  }

}
