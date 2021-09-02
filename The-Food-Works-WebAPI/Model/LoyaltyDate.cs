using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class LoyaltyDate
    {
        public int LoyaltyDateId { get; set; }
        public int CustomerId { get; set; }
        public DateTime DateJoined { get; set; }

        public virtual Customer Customer { get; set; }
    }
}
