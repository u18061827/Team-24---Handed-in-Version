using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class QrCode
    {
        public int QrCode1 { get; set; }
        public byte[] QrCode2 { get; set; }
        public int SaleId { get; set; }

        public virtual Sale Sale { get; set; }
    }
}
