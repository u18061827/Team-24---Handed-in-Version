using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class SaleVM
    {
        public SaleVM()
        {
        }

        public int? ProductId { get; set; }

        public int? Quantity { get; set; }
        public string? ProductName { get; set; }
        public double? ProductPriceAmount { get; set; }

        public string? ProductBarcode { get; set; }

        public DateTime? DateOfSale { get; set; }
        public int SaleTotal { get; set; }
        public int CustomerId { get; set; }
        public int SaleStatusId { get; set; }
        public int SaleTypeId { get; set; }
        public int CompletionMethodId { get; set; }
        public int? AddressId { get; set; }
        public int? EmployeeId { get; set; }
        public int? BranchId { get; set; }
        public string? PaymentType { get; set; }

        public SaleLine[] SaleLines { get; set; }

        public string? EmailAddress { get; set; }
    }
}