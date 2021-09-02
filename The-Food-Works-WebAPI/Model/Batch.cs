﻿using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Batch
    {
        public Batch()
        {
            BatchLines = new HashSet<BatchLine>();
        }

        public int BatchId { get; set; }
        public int? EmployeeId { get; set; }
        public int CookingListId { get; set; }
        public int BatchStatusId { get; set; }

        public virtual BatchStatus BatchStatus { get; set; }
        public virtual CookingList CookingList { get; set; }
        public virtual Employee Employee { get; set; }
        public virtual ICollection<BatchLine> BatchLines { get; set; }
    }
}
