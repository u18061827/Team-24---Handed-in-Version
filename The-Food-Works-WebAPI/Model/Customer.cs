using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Customer
    {
        public Customer()
        {
            Carts = new HashSet<Cart>();
            CustomerAddresses = new HashSet<CustomerAddress>();
            LoyaltyDates = new HashSet<LoyaltyDate>();
            ProductReviews = new HashSet<ProductReview>();
            Sales = new HashSet<Sale>();
            Users = new HashSet<User>();
            Vouchers = new HashSet<Voucher>();
        }

        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerSurname { get; set; }
        public DateTime? CustomerDob { get; set; }
        public string CustomerTelephone { get; set; }
        public string CustomerEmail { get; set; }
        public bool IsLoyaltyProgram { get; set; }

        public virtual ICollection<Cart> Carts { get; set; }
        public virtual ICollection<CustomerAddress> CustomerAddresses { get; set; }
        public virtual ICollection<LoyaltyDate> LoyaltyDates { get; set; }
        public virtual ICollection<ProductReview> ProductReviews { get; set; }
        public virtual ICollection<Sale> Sales { get; set; }
        public virtual ICollection<User> Users { get; set; }
        public virtual ICollection<Voucher> Vouchers { get; set; }
    }
}
