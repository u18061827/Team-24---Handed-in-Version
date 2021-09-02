import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  id: number;
  moduleName: string;
  moduleLanguage: string;
  moduleType: string;
  moduleContent: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, moduleName: 'Kitchen Basics', moduleLanguage: 'English', moduleType: 'Workplace', moduleContent: 'Video, Text, Image'},
  {id: 2, moduleName: 'Spices 101', moduleLanguage: 'English', moduleType: 'Cooking', moduleContent: 'Video, Image'},
  {id: 3, moduleName: 'Kitchen Hygiene', moduleLanguage: 'English', moduleType: 'Cleaning', moduleContent: 'Text, Image'},
  {id: 4, moduleName: 'Sanatization Basics', moduleLanguage: 'Afrikaans', moduleType: 'Cleaning', moduleContent: 'Video'},
  {id: 5, moduleName: 'Know Your Utensils', moduleLanguage: 'Afrikaans', moduleType: 'Knowledge', moduleContent: 'Video, Text, Image'},
  {id: 6, moduleName: 'Shorten Your Cooking Time', moduleLanguage: 'English', moduleType: 'Tips', moduleContent: 'Video'},
  {id: 7, moduleName: 'Complimentary Ingredients', moduleLanguage: 'English', moduleType: 'Cooking', moduleContent: 'Video, Text'},
  {id: 8, moduleName: 'Burn Hazards', moduleLanguage: 'Afrikaans', moduleType: 'Tips', moduleContent: 'Video'},
  {id: 9, moduleName: 'Cleaning Your Workspace', moduleLanguage: 'Zulu', moduleType: 'Cleaning', moduleContent: 'Image'},
  {id: 10, moduleName: 'Work Morale', moduleLanguage: 'English', moduleType: 'Knowledge', moduleContent: 'Video, Text, Image'},
  {id: 11, moduleName: 'Introduction', moduleLanguage: 'Xhosa',moduleType: 'Workplace', moduleContent: 'Video, Image'},
];

@Component({
  selector: 'app-maintain-training-module',
  templateUrl: './maintain-training-module.component.html',
  styleUrls: ['./maintain-training-module.component.scss']
})
export class MaintainTrainingModuleComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'moduleName', 'moduleLanguage', 'moduleType', 'moduleContent', 'viewUpdate'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
