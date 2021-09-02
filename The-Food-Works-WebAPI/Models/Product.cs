﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Models
{
    public partial class Product
    {
        public Product()
        {
            BatchLine = new HashSet<BatchLine>();
            BranchProduct = new HashSet<BranchProduct>();
            BranchRequestLine = new HashSet<BranchRequestLine>();
            ProductContent = new HashSet<ProductContent>();
            ProductReview = new HashSet<ProductReview>();
            SupplierOrderLine = new HashSet<SupplierOrderLine>();
            WriteOffProduct = new HashSet<WriteOffProduct>();
        }

        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }
        public int ProductTypeId { get; set; }
        public int ProductStatusId { get; set; }
        public string ProductBarcode { get; set; }
        public string ProductImage { get; set; }

        public virtual ProductStatus ProductStatus { get; set; }
        public virtual ProductType ProductType { get; set; }
        public virtual ICollection<BatchLine> BatchLine { get; set; }
        public virtual ICollection<BranchProduct> BranchProduct { get; set; }
        public virtual ICollection<BranchRequestLine> BranchRequestLine { get; set; }
        public virtual ICollection<ProductContent> ProductContent { get; set; }
        public virtual ICollection<ProductReview> ProductReview { get; set; }
        public virtual ICollection<SupplierOrderLine> SupplierOrderLine { get; set; }
        public virtual ICollection<WriteOffProduct> WriteOffProduct { get; set; }
    }
}