import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Module } from 'src/app/interfaces/training';
import { TrainingService } from 'src/app/services/training/training.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmModalComponent } from './../../modals/confirm-modal/confirm-modal.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-training-modules-content-view',
  templateUrl: './training-modules-content-view.component.html',
  styleUrls: ['./training-modules-content-view.component.scss']
})
export class TrainingModulesContentViewComponent implements OnInit {

  safeSrc: SafeResourceUrl;
  isActive = true;
  generalForm: FormGroup;

  // General Declerations
  employeeId = localStorage['user'];
  trainingModuleInfo: Module[];
  contentOrder: any;
  passedId: any;
  viewMode: any;
  contentArray: any = [];
  html: any;

  // Content Bools
  videoContent: boolean;
  textContent: boolean;
  imageContent: boolean;
  imageArray: any = [];

  constructor(private _sanitizer: DomSanitizer, public dialog: MatDialog, private route: ActivatedRoute, private service: TrainingService, private fb: FormBuilder) {
    this.safeSrc = this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/1BEWYpBeN94");
    this.passedId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.service.getTrainingModule(this.passedId, this.employeeId).subscribe(
      (resp: any) => {
        console.log(resp);
        this.trainingModuleInfo = resp;
        this.viewMode = this.trainingModuleInfo[0].TrainingModuleCompleted;
        this.contentOrder = this.trainingModuleInfo[0].ContentOrder.replace(/,/g, ", ");
        this.contentArray = this.trainingModuleInfo[0].ContentOrder.split(',');
        console.log(this.contentArray);
        this.imageArray = this.trainingModuleInfo[0].ModuleContentImage.split(',');
        console.log(this.imageArray);
        this.html = this.trainingModuleInfo[0].ModuleContentText;
        this.videoContent = this.contentArray.includes('Video');
        this.textContent = this.contentArray.includes('Text');
        this.imageContent = this.contentArray.includes('Image')
        this.html = this.trainingModuleInfo[0];
        console.log(this.videoContent + ',' + this.textContent + ',' + this.imageContent );
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  openDialog() {
    this.dialog.open(ConfirmModalComponent);
  }

  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
        if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        }
      }
  }
}
