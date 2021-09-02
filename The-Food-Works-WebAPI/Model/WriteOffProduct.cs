using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class WriteOffProduct
    {
        public int WriteOffId { get; set; }
        public int ProductId { get; set; }
        public int BranchId { get; set; }
        public int WriteOffQuantity { get; set; }
        public DateTime WriteOffDate { get; set; }
        public string WriteOffReason { get; set; }

        public virtual Branch Branch { get; set; }
        public virtual Product Product { get; set; }
        public virtual WriteOff WriteOff { get; set; }
    }
}
