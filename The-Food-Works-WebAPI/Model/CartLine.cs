using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class CartLine
    {
        public int BranchId { get; set; }
        public int ProductId { get; set; }
        public int CartId { get; set; }
        public int Quantity { get; set; }

        public virtual BranchProduct BranchProduct { get; set; }
        public virtual Cart Cart { get; set; }
    }
}
