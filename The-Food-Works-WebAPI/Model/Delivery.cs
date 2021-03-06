using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Delivery
    {
        public int DeliveryId { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string CustomerSignOff { get; set; }
        public bool? IsPending { get; set; }
        public int SaleId { get; set; }
        public int? EmployeeId { get; set; }

        public virtual Employee Employee { get; set; }
        public virtual Sale Sale { get; set; }
    }
}
