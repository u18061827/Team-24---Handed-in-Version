using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class ProductStatus
    {
        public ProductStatus()
        {
            Products = new HashSet<Product>();
        }

        public int ProductStatusId { get; set; }
        public string ProductStatusName { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}
