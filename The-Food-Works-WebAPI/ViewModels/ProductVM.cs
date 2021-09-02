﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class ProductVM
    {
          public int ProductId { get; set; }
          public string ProductName { get; set; }
          public string ProductDescription { get; set; }
          public string ProductImage { get; set; }
          public int ProductTypeId { get; set; }
          public string ProductTypeName { get; set; }
          public int ProductStatusId { get; set; }
          public string ProductStatusName { get; set; }
          public int Quantity { get; set; }
          public string ProductBarcode { get; set; }
          public int ProductContentId { get; set; }
          public ProductContent[] contents { get; set; }
          public List<int> ProductNames { get; set; }
          public List<int> Quantities { get; set; }
    }
}
