using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Branch
    {
        public Branch()
        {
            BranchAddresses = new HashSet<BranchAddress>();
            BranchProducts = new HashSet<BranchProduct>();
            BranchRequestLines = new HashSet<BranchRequestLine>();
            BranchRequests = new HashSet<BranchRequest>();
            Employees = new HashSet<Employee>();
            Sales = new HashSet<Sale>();
            WriteOffProducts = new HashSet<WriteOffProduct>();
        }

        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public string BranchContactNumber { get; set; }
        public string BranchEmailAddress { get; set; }
        public string BranchImage { get; set; }
        public bool BranchStatus { get; set; }

        public virtual ICollection<BranchAddress> BranchAddresses { get; set; }
        public virtual ICollection<BranchProduct> BranchProducts { get; set; }
        public virtual ICollection<BranchRequestLine> BranchRequestLines { get; set; }
        public virtual ICollection<BranchRequest> BranchRequests { get; set; }
        public virtual ICollection<Employee> Employees { get; set; }
        public virtual ICollection<Sale> Sales { get; set; }
        public virtual ICollection<WriteOffProduct> WriteOffProducts { get; set; }
    }
}
