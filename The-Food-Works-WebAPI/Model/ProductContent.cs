using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class ProductContent
    {
        public int ProductId { get; set; }
        public int ProductContentId { get; set; }
        public int Quantity { get; set; }

        public virtual Product Product { get; set; }
    }
}
