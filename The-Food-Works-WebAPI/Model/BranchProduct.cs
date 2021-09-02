using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class BranchProduct
    {
        public BranchProduct()
        {
            CartLines = new HashSet<CartLine>();
            ProductPrices = new HashSet<ProductPrice>();
            SaleLines = new HashSet<SaleLine>();
        }

        public int BranchId { get; set; }
        public int ProductId { get; set; }
        public int QuantityOnHand { get; set; }
        public int? BaselineQuantity { get; set; }

        public virtual Branch Branch { get; set; }
        public virtual Product Product { get; set; }
        public virtual ICollection<CartLine> CartLines { get; set; }
        public virtual ICollection<ProductPrice> ProductPrices { get; set; }
        public virtual ICollection<SaleLine> SaleLines { get; set; }
    }
}
