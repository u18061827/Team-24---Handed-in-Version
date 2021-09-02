using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Supplier
    {
        public Supplier()
        {
            SupplierOrderDays = new HashSet<SupplierOrderDay>();
            SupplierOrders = new HashSet<SupplierOrder>();
        }

        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierVatNumber { get; set; }
        public string SupplierContactNumber { get; set; }
        public string SupplierEmailAddress { get; set; }
        public int SupplierTypeId { get; set; }
        public int SupplierStatusId { get; set; }
        public int OrderMethodId { get; set; }
        public int? SupplierAddressId { get; set; }

        public virtual OrderMethod OrderMethod { get; set; }
        public virtual SupplierStatus SupplierStatus { get; set; }
        public virtual SupplierType SupplierType { get; set; }
        public virtual ICollection<SupplierOrderDay> SupplierOrderDays { get; set; }
        public virtual ICollection<SupplierOrder> SupplierOrders { get; set; }
    }
}
