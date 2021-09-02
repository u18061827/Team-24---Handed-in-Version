using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Product
    {
        public Product()
        {
            BatchLines = new HashSet<BatchLine>();
            BranchProducts = new HashSet<BranchProduct>();
            BranchRequestLines = new HashSet<BranchRequestLine>();
            ProductContents = new HashSet<ProductContent>();
            ProductReviews = new HashSet<ProductReview>();
            SupplierOrderLines = new HashSet<SupplierOrderLine>();
            WriteOffProducts = new HashSet<WriteOffProduct>();
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
        public virtual ICollection<BatchLine> BatchLines { get; set; }
        public virtual ICollection<BranchProduct> BranchProducts { get; set; }
        public virtual ICollection<BranchRequestLine> BranchRequestLines { get; set; }
        public virtual ICollection<ProductContent> ProductContents { get; set; }
        public virtual ICollection<ProductReview> ProductReviews { get; set; }
        public virtual ICollection<SupplierOrderLine> SupplierOrderLines { get; set; }
        public virtual ICollection<WriteOffProduct> WriteOffProducts { get; set; }
    }
}
