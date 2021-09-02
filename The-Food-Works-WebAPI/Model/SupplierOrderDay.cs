using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class SupplierOrderDay
    {
        public int SupplierOrderId { get; set; }
        public string SupplierOrderDayDescription { get; set; }
        public int SupplierId { get; set; }

        public virtual Supplier Supplier { get; set; }
    }
}
