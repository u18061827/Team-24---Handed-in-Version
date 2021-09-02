using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class SupplierOrderStatus
    {
        public SupplierOrderStatus()
        {
            SupplierOrders = new HashSet<SupplierOrder>();
        }

        public int SupplierOrderStatusId { get; set; }
        public string SupplierOrderStatusName { get; set; }

        public virtual ICollection<SupplierOrder> SupplierOrders { get; set; }
    }
}
