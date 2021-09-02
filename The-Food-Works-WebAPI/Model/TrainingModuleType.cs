using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class TrainingModuleType
    {
        public TrainingModuleType()
        {
            TrainingModules = new HashSet<TrainingModule>();
        }

        public int TrainingModuleTypeId { get; set; }
        public string TrainingModuleTypeDescription { get; set; }

        public virtual ICollection<TrainingModule> TrainingModules { get; set; }
    }
}
