using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class RequestStatus
    {
        public RequestStatus()
        {
            BranchRequests = new HashSet<BranchRequest>();
        }

        public int RequestStatusId { get; set; }
        public string RequestStatusDescription { get; set; }

        public virtual ICollection<BranchRequest> BranchRequests { get; set; }
    }
}
