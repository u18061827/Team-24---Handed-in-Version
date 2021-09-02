using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class BranchRequest
    {
        public BranchRequest()
        {
            BranchRequestLines = new HashSet<BranchRequestLine>();
        }

        public int BranchRequestId { get; set; }
        public DateTime? BranchRequestDate { get; set; }
        public int RequestStatusId { get; set; }
        public int BranchId { get; set; }

        public virtual Branch Branch { get; set; }
        public virtual RequestStatus RequestStatus { get; set; }
        public virtual ICollection<BranchRequestLine> BranchRequestLines { get; set; }
    }
}
