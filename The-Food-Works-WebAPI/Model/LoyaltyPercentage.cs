using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class LoyaltyPercentage
    {
        public int LoyaltyPercentageId { get; set; }
        public double LoyaltyPercentageAmount { get; set; }
        public DateTime LoyaltyPercentageDate { get; set; }
    }
}
