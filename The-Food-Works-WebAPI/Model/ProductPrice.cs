using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class ProductPrice
    {
        public int ProductPriceId { get; set; }
        public double ProductPriceAmount { get; set; }
        public DateTime ProductPriceDate { get; set; }
        public int BranchId { get; set; }
        public int ProductId { get; set; }

        public virtual BranchProduct BranchProduct { get; set; }
    }
}
