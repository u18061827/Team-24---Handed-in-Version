using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class BatchStatus
    {
        public BatchStatus()
        {
            Batches = new HashSet<Batch>();
        }

        public int BatchStatusId { get; set; }
        public string BatchStatusName { get; set; }

        public virtual ICollection<Batch> Batches { get; set; }
    }
}
