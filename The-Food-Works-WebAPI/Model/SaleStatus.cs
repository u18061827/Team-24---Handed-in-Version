using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class SaleStatus
    {
        public SaleStatus()
        {
            Sales = new HashSet<Sale>();
        }

        public int SaleStatusId { get; set; }
        public string SaleStatusDescription { get; set; }

        public virtual ICollection<Sale> Sales { get; set; }
    }
}
