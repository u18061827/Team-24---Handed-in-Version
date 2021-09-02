using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using The_Food_Works_WebAPI.ViewModels;
using static The_Food_Works_WebAPI.ViewModels.GlobalVariables;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SaleController : Controller
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpGet]
        [Route("GetAllSales")]
        public List<dynamic> getAllSales()
        {
            //var employees = db.Employee.ToList();
            var sales = db.Sale.ToList();
            return getDynamicSales(sales);
        }

        public List<dynamic> getDynamicSales(List<Sale> sales)
        {
            var dynamicSales = new List<dynamic>();

            foreach (var sale in sales)
            {
                dynamic dynamicSale = new ExpandoObject();
                dynamicSale.SaleID = sale.SaleId;
                dynamicSale.SaleDate = sale.DateOfSale;
                dynamicSale.saleTotal = sale.SaleTotal;

                dynamicSales.Add(dynamicSale);
            }

            return dynamicSales;
        }

        [HttpGet]
        [Route("GetMainMeals")]
        public List<dynamic> getMainMeals()
        {
            var mainMeals = db.Product.Where(x => x.ProductTypeId == 1).ToList();
            return getDynamicProduct(mainMeals);
        }

        public List<dynamic> getDynamicProduct(List<Product> products)
        {
            var dynamicProducts = new List<dynamic>();

            foreach (var product in products)
            {
                dynamic dynamicProduct = new ExpandoObject();

                dynamicProduct.ProductId = product.ProductId;
                dynamicProduct.ProductName = product.ProductName;
                dynamicProduct.ProductBarcode = product.ProductBarcode;
                dynamicProducts.Add(dynamicProduct);
            }

            return dynamicProducts;
        }

        [HttpGet]
        [Route("GetSides")]
        public List<dynamic> getSides()
        {
            var sides = db.Product.Where(x => x.ProductTypeId == 5).ToList();
            return getDynamicProduct(sides);
        }

        [HttpGet]
        [Route("GetDesserts")]
        public List<dynamic> getDesserts()
        {
            var desserts = db.Product.Where(x => x.ProductTypeId == 4).ToList();
            return getDynamicProduct(desserts);
        }

        private SaleVM toReturn;

        [HttpPost]
        [Route("GetSelectedProduct")]
        public SaleVM getSelectedProduct(SaleVM product)
        {
            var barcodes = db.Product.Select(x => x.ProductBarcode).ToList();

            if (barcodes.Contains(product.ProductBarcode))
            {
                var productBarcode = product.ProductBarcode;
                var productToReturn = db.Product.Include(x => x.BranchProduct).ThenInclude(x => x.ProductPrice).Where(x => x.ProductBarcode == productBarcode).FirstOrDefault();
                var productPrice = db.ProductPrice.Where(x => x.ProductId == productToReturn.ProductId && x.BranchId == MyGlobalVariable.BranchId).OrderByDescending(x => x.ProductPriceDate).FirstOrDefault();

                toReturn = new SaleVM
                {
                    Quantity = 1,
                    ProductName = productToReturn.ProductName,
                    ProductPriceAmount = productPrice.ProductPriceAmount,
                    ProductBarcode = productToReturn.ProductBarcode,
                    ProductId = productToReturn.ProductId,
                };

                return toReturn;
            }
            else
            {
                return null;
            }
        }

        [HttpGet]
        [Route("GetVATpercentage")]
        public dynamic getVATpercentage()
        {
            var vatPercen = db.Vat.OrderByDescending(x => x.VatDate).Select(x => x.VatPercentage).FirstOrDefault();
            return vatPercen;
        }

        [HttpPost]
        [Route("WriteSale")]
        public ActionResult writeSale(SaleVM sale)
        {
            try
            {
                int saleID = db.Sale.Max(x => x.SaleId);
                var newSale = new Sale
                {
                    SaleId = saleID + 1,
                    DateOfSale = DateTime.Now,
                    SaleTotal = sale.SaleTotal,
                    CustomerId = sale.CustomerId,
                    SaleStatusId = sale.SaleStatusId,
                    SaleTypeId = sale.SaleTypeId,
                    CompletionMethodId = sale.CompletionMethodId,
                    EmployeeId = sale.EmployeeId,
                    BranchId = MyGlobalVariable.BranchId,
                };

                db.Sale.Add(newSale);
                db.SaveChanges();

                var saleLinesToWrite = sale.SaleLines;

                //get saleID

                for (int i = 0; i < saleLinesToWrite.Count(); i++)
                {
                    var newSaleLine = new SaleLine
                    {
                        BranchId = (int)MyGlobalVariable.BranchId,
                        ProductId = saleLinesToWrite[i].ProductId,
                        SaleId = saleID + 1,
                        Quantity = saleLinesToWrite[i].Quantity
                    };

                    var branchProduct = db.BranchProduct.Where(x => x.ProductId == saleLinesToWrite[i].ProductId && x.BranchId == MyGlobalVariable.BranchId).FirstOrDefault();
                    branchProduct.QuantityOnHand = branchProduct.QuantityOnHand - saleLinesToWrite[i].Quantity;
                    db.SaveChanges();
                    db.SaleLine.Add(newSaleLine);
                    db.SaveChanges();
                }

                SalePaymentType payment = new SalePaymentType();

                payment.SaleId = saleID + 1;
                payment.PaymentTypeId = db.PaymentType.Where(zz => zz.PaymentTypeDescription == sale.PaymentType).Select(zz => zz.PaymentTypeId).First();
                payment.AmountPaid = sale.SaleTotal;

                db.SalePaymentType.Add(payment);
                db.SaveChanges();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok();
        }

        [HttpPost]
        [Route("EmailReceipt")]
        public ActionResult emailReceipt(SaleVM sale)
        {
            string itemsPurchased = "";
            for (int i = 0; i < sale.SaleLines.Length; i++)
            {
                var productName = db.Product.Where(x => x.ProductId == sale.SaleLines[i].ProductId).Select(x => x.ProductName).FirstOrDefault();
                var productPrice = db.ProductPrice.Where(x => x.ProductId == sale.SaleLines[i].ProductId && x.BranchId == MyGlobalVariable.BranchId).OrderByDescending(x => x.ProductPriceDate).Select(x => x.ProductPriceAmount).FirstOrDefault();
                itemsPurchased = itemsPurchased + sale.SaleLines[i].Quantity + "x " + productName + "               R" + productPrice + " each<br/>";
            }
            var employee = db.Employee.Where(x => x.EmployeeId == sale.EmployeeId).Select(x => x.EmployeeName).FirstOrDefault();
            double vatTotal = sale.SaleTotal * 0.15;
            var subTotal = sale.SaleTotal - vatTotal;
            var subject = "Receipt for purchase at The Food Works " + DateTime.Now;

            var body = "Thank you for buying from us! Please find your receipt below." +
            "<br/><br/>" + itemsPurchased + "<br/>Subtotal: R" + subTotal +
            "<br/>VAT Total: R" + vatTotal + "<br/> Grand Total: R" + sale.SaleTotal +
            "<br/><br/>Employee: " + employee + " <br/>Date: " + DateTime.Now + "<br/>Head Office: Shop 17, Simarlo Business Rainbow Park<br/>" +
            "            Jakaranda Street, Centurion" + "<br/>            0157<br/>" +
            "Contact Number: 060 942 6629" + "<br/>Email Address: orders@thefoodworks.co.za<br/><br/>" +
            "VAT REG. NO : 4420116552";

            new EmailSender().SendEmailAsync(sale.EmailAddress, subject, body);

            return Ok();
        }
    }
}