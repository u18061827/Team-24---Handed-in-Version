using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class ProductReview
    {
        public int RatingId { get; set; }
        public int RatingStars { get; set; }
        public string RatingOverview { get; set; }
        public int CustomerId { get; set; }
        public int ProductId { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual Product Product { get; set; }
    }
}
