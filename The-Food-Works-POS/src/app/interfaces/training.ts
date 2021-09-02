import { Time } from "@angular/common";

export interface ModuleType {
  ID: number;
  Description: string;
}

export interface Module {
  TrainingModuleId: number;
  ModuleName: string;
  ModuleType: number;
  ModuleLanguage: string;
  ModuleDuration: string;
  ModuleDescription: string;
  ModuleContentVideo: string;
  ModuleContentText: string;
  ModuleContentImage: string;
  ContentOrder: string;
  TrainingModuleCompleted: boolean;
  TimeElapsed: number;
  DateCompleted: Date;
}
