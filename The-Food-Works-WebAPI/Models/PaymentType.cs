// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Models
{
    public partial class PaymentType
    {
        public PaymentType()
        {
            SalePaymentTypes = new HashSet<SalePaymentType>();
        }

        public int PaymentTypeId { get; set; }
        public string PaymentTypeDescription { get; set; }

        public virtual ICollection<SalePaymentType> SalePaymentTypes { get; set; }
    }
}