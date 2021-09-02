using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class SupplierStatus
    {
        public SupplierStatus()
        {
            Suppliers = new HashSet<Supplier>();
        }

        public int SupplierStatusId { get; set; }
        public string SupplierStatusName { get; set; }

        public virtual ICollection<Supplier> Suppliers { get; set; }
    }
}
