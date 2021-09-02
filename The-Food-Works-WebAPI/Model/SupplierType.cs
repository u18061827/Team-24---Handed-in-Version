using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class SupplierType
    {
        public SupplierType()
        {
            Suppliers = new HashSet<Supplier>();
        }

        public int SupplierTypeId { get; set; }
        public string SupplierTypeName { get; set; }

        public virtual ICollection<Supplier> Suppliers { get; set; }
    }
}
