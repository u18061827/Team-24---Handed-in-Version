using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class BatchLine
    {
        public int ProductId { get; set; }
        public int BatchId { get; set; }
        public int Quantity { get; set; }

        public virtual Batch Batch { get; set; }
        public virtual Product Product { get; set; }
    }
}
