using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class CustomerAddress
    {
        public CustomerAddress()
        {
            Sales = new HashSet<Sale>();
        }

        public int AddressId { get; set; }
        public int CustomerId { get; set; }
        public string AddressStreetNum { get; set; }
        public string AddressStreetName { get; set; }
        public string AddressCity { get; set; }
        public string AddressPostalCode { get; set; }
        public string AddressProvince { get; set; }
        public DateTime AddressDate { get; set; }
        public double AddressLat { get; set; }
        public double AddressLng { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual ICollection<Sale> Sales { get; set; }
    }
}
