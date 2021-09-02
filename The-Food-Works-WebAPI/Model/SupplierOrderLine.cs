using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class SupplierOrderLine
    {
        public int ProductId { get; set; }
        public int SupplierOrderId { get; set; }
        public int SupplierOrderLineQuantity { get; set; }

        public virtual Product Product { get; set; }
        public virtual SupplierOrder SupplierOrder { get; set; }
    }
}
