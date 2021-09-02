import { TrainingService } from 'src/app/services/training/training.service';
import { Component, OnInit } from '@angular/core';
import { Module } from 'src/app/interfaces/training';


@Component({
  selector: 'app-training-modules-home',
  templateUrl: './training-modules-home.component.html',
  styleUrls: ['./training-modules-home.component.scss']
})
export class TrainingModulesHomeComponent implements OnInit {

  // General Declerations
  moduleList: Module[];
  employeeId = localStorage['user'];
  progress: any;

  panelOpenState = false;
  constructor(private service: TrainingService) { }

  ngOnInit(): void {
    this.service.getTrainingModuleList(this.employeeId).subscribe(
      (resp: any) => {
        console.log(resp)
        this.moduleList = resp;
        this.setProgress()
      },
      (error: any) => {
        console.log("Unable to receive data")
      }
    )
  }

  setProgress() {
    let total = this.moduleList.length;
    let completed = 0;
    for (let i = 0; i < total; i++)
    {
      if(this.moduleList[i].TrainingModuleCompleted == true)
      {
        completed++;
      }
    }
    let progress = (completed * 100)/total;
    console.log(progress);
    this.progress = progress;
  }

}
