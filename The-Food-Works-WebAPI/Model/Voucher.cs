using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Voucher
    {
        public Voucher()
        {
            RedeemedInstances = new HashSet<RedeemedInstance>();
        }

        public int VoucherId { get; set; }
        public string VoucherCode { get; set; }
        public byte[] QrCode { get; set; }
        public bool VoucherStatus { get; set; }
        public DateTime VoucherExpiryDate { get; set; }
        public double VoucherAmount { get; set; }
        public int CustomerId { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual ICollection<RedeemedInstance> RedeemedInstances { get; set; }
    }
}
