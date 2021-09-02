﻿using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class BranchAddress
    {
        public int BranchAddressId { get; set; }
        public string BranchAddressFull { get; set; }
        public string BranchStreetName { get; set; }
        public string BranchSuburb { get; set; }
        public string BranchCity { get; set; }
        public string BranchProvince { get; set; }
        public string BranchCountry { get; set; }
        public string BranchZip { get; set; }
        public DateTime? BranchDate { get; set; }
        public double BranchLate { get; set; }
        public double BranchLng { get; set; }
        public int BranchId { get; set; }

        public virtual Branch Branch { get; set; }
    }
}
