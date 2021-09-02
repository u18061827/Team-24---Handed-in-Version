using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class Customer
    {
        public class CartVM
        {
            public int branchID { get; set; }
            public int customerID { get; set; }
            public int productID { get; set; }

            public int quantity { get; set; }
        }
    }
}
