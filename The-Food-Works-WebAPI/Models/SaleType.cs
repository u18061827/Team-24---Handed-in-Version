﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Models
{
    public partial class SaleType
    {
        public SaleType()
        {
            Sales = new HashSet<Sale>();
        }

        public int SaleTypeId { get; set; }
        public string SaleTypeDescription { get; set; }

        public virtual ICollection<Sale> Sales { get; set; }
    }
}