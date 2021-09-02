using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class SalePaymentType
    {
        public int SaleId { get; set; }
        public int PaymentTypeId { get; set; }
        public double AmountPaid { get; set; }

        public virtual PaymentType PaymentType { get; set; }
        public virtual Sale Sale { get; set; }
    }
}
