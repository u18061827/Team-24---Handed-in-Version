using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class SupplierAddress
    {
        public int SupplierAddressId { get; set; }
        public string SupplierAddressFull { get; set; }
        public string SupplierAddressBuildingNumber { get; set; }
        public string SupplierAddressStreetName { get; set; }
        public string SupplierAddressSuburb { get; set; }
        public string SupplierAddressCity { get; set; }
        public string SupplierAddressProvince { get; set; }
        public string SupplierAddressCountry { get; set; }
        public string SupplierAddressZipCode { get; set; }
        public DateTime? SupplierAddressDate { get; set; }
        public double SupplierAddressLat { get; set; }
        public double SupplierAddressLng { get; set; }
    }
}
