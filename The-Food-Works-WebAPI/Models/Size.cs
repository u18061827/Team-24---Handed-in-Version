using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class Size
    {
        public Size()
        {
            Product = new HashSet<Product>();
        }

        public int SizeId { get; set; }
        public string SizeDescription { get; set; }

        public virtual ICollection<Product> Product { get; set; }
    }
}
