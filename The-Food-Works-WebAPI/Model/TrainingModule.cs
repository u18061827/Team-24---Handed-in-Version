using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class TrainingModule
    {
        public TrainingModule()
        {
            EmployeeTrainingModules = new HashSet<EmployeeTrainingModule>();
        }

        public int TrainingModuleId { get; set; }
        public string ModuleName { get; set; }
        public string ModuleDescription { get; set; }
        public string ModuleLanguage { get; set; }
        public string ModuleContentText { get; set; }
        public string ModuleContentVideo { get; set; }
        public string ModuleContentImage { get; set; }
        public string ModuleDuration { get; set; }
        public int TrainingModuleTypeId { get; set; }
        public string ContentOrder { get; set; }

        public virtual TrainingModuleType TrainingModuleType { get; set; }
        public virtual ICollection<EmployeeTrainingModule> EmployeeTrainingModules { get; set; }
    }
}
