using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class RedeemedInstance
    {
        public int RedeemedInstanceId { get; set; }
        public int RedeemedInstanceNumber { get; set; }
        public double RedeemedInstanceAmount { get; set; }
        public DateTime RedeemedInstanceDate { get; set; }
        public int VoucherId { get; set; }

        public virtual Voucher Voucher { get; set; }
    }
}
