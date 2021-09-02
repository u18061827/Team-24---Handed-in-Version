using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class SaleType
    {
        public SaleType()
        {
            Sales = new HashSet<Sale>();
        }

        public int SaleTypeId { get; set; }
        public string SaleTypeDescription { get; set; }

        public virtual ICollection<Sale> Sales { get; set; }
    }
}
