using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class BranchRequestLine
    {
        public int BranchRequestId { get; set; }
        public int ProductId { get; set; }
        public int RequestedQuantity { get; set; }
        public int? BranchId { get; set; }

        public virtual Branch Branch { get; set; }
        public virtual BranchRequest BranchRequest { get; set; }
        public virtual Product Product { get; set; }
    }
}
