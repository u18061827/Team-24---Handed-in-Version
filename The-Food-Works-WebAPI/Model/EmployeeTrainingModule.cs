using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class EmployeeTrainingModule
    {
        public int TrainingModuleId { get; set; }
        public int EmployeeId { get; set; }
        public TimeSpan? TimeElapsed { get; set; }
        public bool? EmployeeTrainingModuleStatus { get; set; }
        public DateTime? DateCompleted { get; set; }

        public virtual Employee Employee { get; set; }
        public virtual TrainingModule TrainingModule { get; set; }
    }
}
