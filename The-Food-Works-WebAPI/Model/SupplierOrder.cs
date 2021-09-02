using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class SupplierOrder
    {
        public SupplierOrder()
        {
            SupplierOrderLines = new HashSet<SupplierOrderLine>();
        }

        public int SupplierOrderId { get; set; }
        public DateTime SupplierOrderDate { get; set; }
        public int SupplierId { get; set; }
        public int SupplierOrderStatusId { get; set; }
        public string InvoiceImage { get; set; }

        public virtual Supplier Supplier { get; set; }
        public virtual SupplierOrderStatus SupplierOrderStatus { get; set; }
        public virtual ICollection<SupplierOrderLine> SupplierOrderLines { get; set; }
    }
}
