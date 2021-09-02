using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Vat
    {
        public int VatId { get; set; }
        public int VatPercentage { get; set; }
        public DateTime VatDate { get; set; }
    }
}
