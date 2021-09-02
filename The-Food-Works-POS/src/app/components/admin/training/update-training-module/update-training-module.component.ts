import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddProductModalComponent } from 'src/app/components/modals/add-product-modal/add-product-modal.component';
import { take } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-update-training-module-stock',
  templateUrl: './update-training-module.component.html',
  styleUrls: ['./update-training-module.component.scss']
})
export class UpdateTrainingModuleComponent implements OnInit {

  createForm: FormGroup;
  createContentForm: FormGroup;
  isEditable = true;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private _ngZone: NgZone) { }

  Content = [
    'Video',
    'Text',
    'Images',
  ];

  // Drag and Drop
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Content, event.previousIndex, event.currentIndex);
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  ngOnInit(): void {
    this.createForm = this.fb.group({
      moduleName: ['Sanatizing Your Workspace', Validators.required],
      moduleType: ['', Validators.required],
      moduleDescription: ['This training Module entails basic hygeine practices that are common throughout the kitchen of The Food Works. We will run you through several basic steps to take before entering the workspace, as well as show you tips and tricks on how to keep the environment safe for everyones peace of mind.', Validators.required],
      moduleLanguage: ['', Validators.required],
      moduleDuration: ['', Validators.required],
      employeeDesignation: ['', Validators.required]
    });

    this.createContentForm = this.fb.group({
      videoUrl: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', Validators.required],
      moduleType: [''],
      moduleDescription: [''],
      moduleLanguage: [''],
      moduleDuration: [''],
      employeeDesignation: ['']
    });

  }

  // Text area input
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  openDialog() {
    this.dialog.open(AddProductModalComponent);
  }

}

