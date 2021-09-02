using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class OrderMethod
    {
        public OrderMethod()
        {
            Suppliers = new HashSet<Supplier>();
        }

        public int OrderMethodId { get; set; }
        public string OrderMethodName { get; set; }

        public virtual ICollection<Supplier> Suppliers { get; set; }
    }
}
