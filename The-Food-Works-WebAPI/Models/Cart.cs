﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Models
{
    public partial class Cart
    {
        public Cart()
        {
            CartLines = new HashSet<CartLine>();
        }

        public int CartId { get; set; }
        public int? CustomerId { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual ICollection<CartLine> CartLines { get; set; }
    }
}