﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.ViewModels;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using The_Food_Works_WebAPI.services;

namespace The_Food_Works_WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SupplierOrderController : ControllerBase
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        //Search for all suppliers section
        [HttpGet]
        [Route("GetSupplierOrders")]
        public List<dynamic> getSupplierOrders()
        {
            try
            {
                var supplierOrders = db.SupplierOrderLine.Include(x => x.SupplierOrder).Include(x => x.SupplierOrder.SupplierOrderStatus).Include(x=>x.SupplierOrder.Supplier).Include(x=>x.Product).ToList();

                return testSupplierOrders(supplierOrders);

            }
            catch (Exception)
            {

                throw;
            }
        }

        public List<dynamic> testSupplierOrders(List<SupplierOrderLine> supplierOrders)
        {
            List<dynamic> dynamicSupplierOrders = new List<dynamic>();

            var supplierOrderGroup = supplierOrders.GroupBy(x => new
            {
                x.SupplierOrderId,
                x.SupplierOrder.Supplier.SupplierName,
                //x.Product.ProductName,
               // x.SupplierOrderLineQuantity,
                x.SupplierOrder.SupplierOrderDate,
                x.SupplierOrder.SupplierOrderStatus.SupplierOrderStatusName
            });

            foreach (var supplierOrderG in supplierOrderGroup)
            {
                dynamic dynamicSupplierOrder = new ExpandoObject();
                dynamicSupplierOrder.SupplierOrderId = supplierOrderG.Key.SupplierOrderId;
                dynamicSupplierOrder.SupplierName = supplierOrderG.Key.SupplierName;
               // dynamicSupplierOrder.ProductName = supplierOrderG.Key.ProductName;
               // dynamicSupplierOrder.SupplierOrderLineQuantity = supplierOrderG.Key.SupplierOrderLineQuantity;
                dynamicSupplierOrder.SupplierOrderDate = supplierOrderG.Key.SupplierOrderDate;
                dynamicSupplierOrder.SupplierOrderStatusName = supplierOrderG.Key.SupplierOrderStatusName;


                List<dynamic> lineList = new List<dynamic>();
                foreach (var oneLine in supplierOrderG.GroupBy(x => new { x.SupplierOrderId, x.SupplierOrderLineQuantity, x.ProductId, x.Product.ProductName }))
                {
                    dynamic orderLine = new ExpandoObject();
                    orderLine.SupplierOrderId = oneLine.Key.SupplierOrderId;
                    orderLine.SupplierOrderLineQuantity = oneLine.Key.SupplierOrderLineQuantity;
                    orderLine.ProductId = oneLine.Key.ProductId;
                    orderLine.ProductName = oneLine.Key.ProductName;


                    lineList.Add(orderLine);
                }

                dynamicSupplierOrder.supplierOrderLines = lineList;

                dynamicSupplierOrders.Add(dynamicSupplierOrder);
            }


            return dynamicSupplierOrders;
        }

        //Get specific order
        [HttpPost]
        [Route("GetOneSupplierOrder")]
        public SupplierOrderViewModel getOneSupplierOrder(SupplierOrderViewModel SupplierOrderID)
        {
            try
            {
                var supplierOneOrder = db.SupplierOrder.Include(x => x.SupplierOrderLine).Include(x => x.SupplierOrderStatus).Where(zz => zz.SupplierOrderId == SupplierOrderID.SupplierOrderId).FirstOrDefault();
                var orderLines = db.SupplierOrderLine.Include(x => x.Product).Where(x => x.SupplierOrderId == SupplierOrderID.SupplierOrderId).ToList();
                var statusId = supplierOneOrder.SupplierOrderStatusId;

                SupplierOrderViewModel vm = new SupplierOrderViewModel();
                vm.SupplierOrderId = supplierOneOrder.SupplierOrderId;
                vm.OrderStatusId = db.SupplierOrderStatus.Include(x => x.SupplierOrder).Where(x => x.SupplierOrderStatusId == statusId).Select(x => x.SupplierOrderStatusId).FirstOrDefault();

                List<string> pNames = new List<string>();
                foreach (var orderLine in orderLines)
                {
                    string currentName = db.Product.Where(x => x.ProductId == orderLine.ProductId).Select(x => x.ProductName).FirstOrDefault();
                    pNames.Add(currentName);
                }

                vm.productNames = pNames;
                return vm;
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet]
        [Route("GetIngredients")]
        public List<dynamic> getIngredients()
        {
            var ingredients = db.Product.Include(x=>x.ProductType).Include(x=>x.ProductStatus).Where(x=>x.ProductStatusId == 1 && x.ProductTypeId ==2).ToList();

            return GetDynamicProducts(ingredients);
        }

        public List<dynamic> GetDynamicProducts(List<Product> ingredients)
        {
            var dynamicIngredients = new List<dynamic>();

            foreach (var ingredient in ingredients)
            {
                dynamic dynamicIngredient = new ExpandoObject();
                dynamicIngredient.ProductId = ingredient.ProductId;
                dynamicIngredient.ProductName = ingredient.ProductName;

                dynamicIngredients.Add(dynamicIngredient);
            }

            return dynamicIngredients;
        }

        //Place Supplier Order
        [HttpPost]
        [Route("PlaceSupplierOrder")]
        public ActionResult placeSupplierOrder(SupplierOrderViewModel supplierOrder)
        {
            try
            {
                if (supplierOrder.orderLines != null)
                {
                    int supplierOrderId = db.SupplierOrder.Max(x => x.SupplierOrderId);
                    int supplierId = db.Supplier.Where(x => x.SupplierVatNumber == supplierOrder.SupplierVatNumber).Select(x => x.SupplierId).FirstOrDefault();
                    var newSupplierOrder = new SupplierOrder
                    {
                        SupplierOrderId = supplierOrderId + 1,
                        SupplierId = supplierId,
                        SupplierOrderStatusId = 1,
                        SupplierOrderDate = DateTime.Now,
                    };


                    db.SupplierOrder.Add(newSupplierOrder);

                    db.SaveChanges();

                    var linesToAdd = supplierOrder.orderLines;

                    for (int i = 0; i < linesToAdd.Count(); i++)
                    {
                        var newLine = new SupplierOrderLine
                        {
                            SupplierOrderId = supplierOrderId + 1,
                            ProductId = linesToAdd[i].ProductId,
                            SupplierOrderLineQuantity = linesToAdd[i].SupplierOrderLineQuantity
                        };

                        db.SupplierOrderLine.Add(newLine);
                        db.SaveChanges();
                    }
                }
                else
                    return BadRequest();

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok();
        }

        //send Place Supplier Order Email
        [HttpPost]
        [Route("PlaceSupplierOrderEmail")]

        public ActionResult placeSupplierOrderEmail(SupplierOrderViewModel supplierOrder)
        {
            int supplierId = db.Supplier.Where(x => x.SupplierVatNumber == supplierOrder.SupplierVatNumber).Select(x => x.SupplierId).FirstOrDefault();

            var emailCheck = db.Supplier.Where(x => x.SupplierId == supplierId && x.OrderMethodId == 2).FirstOrDefault();

            var itemsOrdered = "";

            if (emailCheck != null)
            {
                var emailAddress = emailCheck.SupplierEmailAddress;

                for (int i = 0; i < supplierOrder.orderLines.Length; i++)
                {
                    var productName = db.Product.Where(x => x.ProductId == supplierOrder.orderLines[i].ProductId).Select(x => x.ProductName).FirstOrDefault();
                    var productCode = db.Product.Where(x => x.ProductId == supplierOrder.orderLines[i].ProductId).Select(x => x.ProductBarcode).FirstOrDefault();
                    var quantity = supplierOrder.orderLines[i].SupplierOrderLineQuantity;

                    if (productCode != null)
                    {
                        itemsOrdered = itemsOrdered + productName + " (" + productCode + ") " + "        x" + quantity.ToString() + "<br/>";
                    }
                    else
                        itemsOrdered = itemsOrdered + productName  + "        x" + quantity.ToString() + "<br/>";

                }

                var subject = "Order placed by The Food Works " + "(" + DateTime.Now + ")";

                var body = "Good day," + "<br/><br/>" + "Please find below a list of the items we would like to order from you:" 
                + "<br/><br/>" + itemsOrdered +
                "<br/> Order Dated: " + DateTime.Now  +
                "<br/><br/>Head Office: Shop 17, Simarlo Business Rainbow Park<br/>" +
                "            Jakaranda Street, Centurion" + "<br/>            0157<br/>" +
                "Contact Number: 060 942 6629" + "<br/>Email Address: orders@thefoodworks.co.za<br/><br/>" +
                "VAT REG. NO : 4420116552";

                new EmailSender().SendEmailAsync(emailAddress, subject, body);

                return Ok();
            }
            else
                return BadRequest();
        }

        //update supplier order
        [HttpPost]
        [Route("UpdateSupplierOrder")]
        public ActionResult updateSupplierOrder(SupplierOrderViewModel vm)//send whole model from angular to api
        {
            try
            {
                var orderToUpdate = db.SupplierOrder.Include(x=>x.SupplierOrderLine).Where(zz => zz.SupplierOrderId == vm.SupplierOrderId).FirstOrDefault();

                var orderLines = db.SupplierOrderLine.Include(x => x.Product).Where(x => x.SupplierOrderId == vm.SupplierOrderId).ToList();

                int branchId = 1;
                
                orderToUpdate.SupplierOrderStatusId = 2;
                //orderToUpdate.InvoiceImage = vm.im
                db.SaveChanges();

               
                //orderToUpdate.
                var lines = vm.orderLines;
                for ( int i = 0; i<vm.orderLines.Length; i++)
                {
                   var branchCurrentLine = db.BranchProduct.Include(x => x.Branch).Include(x => x.Product).Where(x => x.BranchId == branchId && x.ProductId == lines[i].ProductId).FirstOrDefault();
                   //var currentLine = db.SupplierOrderLine.Where(x => x.ProductId == orderLine.ProductId).FirstOrDefault();
                   branchCurrentLine.QuantityOnHand = branchCurrentLine.QuantityOnHand + lines[i].SupplierOrderLineQuantity;
                   db.SaveChanges();
                }
        
                
                return Ok();

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);

            }
        }

        //[services.ClaimRequirement("Permission", "Admin")]
        [HttpGet]
        [Route("GenerateNotification")]
        public SupplierOrderNotificationVM generateNotification()
        {
            try
            {
                SupplierOrderNotificationVM notificationMsg = new SupplierOrderNotificationVM();
                notificationMsg.notification = "";
                string currentDay = System.DateTime.Now.DayOfWeek.ToString();

                var orderDayRecords = db.SupplierOrderDay.Include(x => x.Supplier).Where(x => x.SupplierId == x.Supplier.SupplierId && x.SupplierOrderDayDescription == currentDay).ToList();
                
                //var baselineQuantityReached = db.BranchProduct.Include(x=>x.Product).Where(x=> x.QuantityOnHand < x. )

                if (orderDayRecords.Count != 0)
                {
                    string supplierName = "";

                    foreach (var supplier in orderDayRecords)
                    {
                        supplierName = supplierName + supplier.Supplier.SupplierName + ", ";
                    }

                    supplierName = supplierName.TrimEnd(',', ' ');
                    notificationMsg.notification = "Reminder: Today is the order day for the following supplier(s): " + supplierName + ".";
                }

                var allBranchProducts = db.BranchProduct.Include(x => x.Product).Where(x =>x.BranchId == 1 && x.Product.ProductId == x.ProductId && x.Product.ProductTypeId == 2 && x.QuantityOnHand < x.BaselineQuantity).ToList();

                if (allBranchProducts.Count != 0)
                {
                    string productName = "";

                    foreach (var bp in allBranchProducts)
                    {
                        productName = productName + bp.Product.ProductName + ", ";
                    }

                    productName = productName.TrimEnd(',', ' ');

                    notificationMsg.notification = notificationMsg.notification  + " The baseline quantity for the following product(s) has been reached: " + productName + ". Please order more from the relevant suppliers.";

                }

                return notificationMsg;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
