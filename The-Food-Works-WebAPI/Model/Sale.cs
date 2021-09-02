using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Sale
    {
        public Sale()
        {
            Deliveries = new HashSet<Delivery>();
            SaleLines = new HashSet<SaleLine>();
            SalePaymentTypes = new HashSet<SalePaymentType>();
        }

        public int SaleId { get; set; }
        public DateTime DateOfSale { get; set; }
        public int SaleTotal { get; set; }
        public int CustomerId { get; set; }
        public int SaleStatusId { get; set; }
        public int SaleTypeId { get; set; }
        public int CompletionMethodId { get; set; }
        public int? AddressId { get; set; }
        public int? EmployeeId { get; set; }
        public int? BranchId { get; set; }

        public virtual CustomerAddress Address { get; set; }
        public virtual Branch Branch { get; set; }
        public virtual CompletionMethod CompletionMethod { get; set; }
        public virtual Customer Customer { get; set; }
        public virtual Employee Employee { get; set; }
        public virtual SaleStatus SaleStatus { get; set; }
        public virtual SaleType SaleType { get; set; }
        public virtual ICollection<Delivery> Deliveries { get; set; }
        public virtual ICollection<SaleLine> SaleLines { get; set; }
        public virtual ICollection<SalePaymentType> SalePaymentTypes { get; set; }
    }
}
