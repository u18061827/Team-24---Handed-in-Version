﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Text;
using The_Food_Works_WebAPI.Models;
using static The_Food_Works_WebAPI.ViewModels.CustomerOrder;

namespace The_Food_Works_WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CustomerOrderController : ControllerBase
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        private string secretKey = "sk_test_960bfde0VBrLlpK098e4ffeb53e1";

        [HttpGet]
        [Route("GetBranchLocation")]
        public List<dynamic> GetBranchLocation()
        {
            var branches = db.Branch.ToList();

            return GetDynamicBranchLocation(branches);
        }

        public List<dynamic> GetDynamicBranchLocation(List<Branch> branches)
        {
            var dynamicBranches = new List<dynamic>();

            foreach (var branch in branches)
            {
                dynamic dynamicBranch = new ExpandoObject();
                dynamicBranch.branchLocationID = branch.BranchId;
                dynamicBranch.branchLocationName = branch.BranchName;

                dynamicBranches.Add(dynamicBranch);
            }

            return dynamicBranches;
        }

        [HttpPost]
        [Route("GetProducts")]
        public dynamic GetProducts([FromBody] int branchID)
        {
            var branchProducts = db.BranchProduct.Include(zz => zz.Product).Include(zz => zz.Product.ProductReview).Include(zz => zz.ProductPrice).Where(zz => zz.BranchId == branchID && zz.Product.ProductTypeId == 1).ToList();

            return GetDynamicProducts(branchProducts);
        }

        public List<dynamic> GetDynamicProducts(List<BranchProduct> branchProducts)
        {
            var dynamicBranchProducts = new List<dynamic>();

            foreach (var product in branchProducts)
            {
                dynamic dynamicBranchProduct = new ExpandoObject();
                dynamicBranchProduct.productID = product.ProductId;
                dynamicBranchProduct.productImage = product.Product.ProductImage;
                dynamicBranchProduct.productName = product.Product.ProductName;
                dynamicBranchProduct.productPrice = product.ProductPrice.Where(zz => zz.ProductId == product.ProductId).OrderByDescending(zz => zz.ProductPriceDate).Select(zz => zz.ProductPriceAmount).FirstOrDefault();

                dynamicBranchProducts.Add(dynamicBranchProduct);
            }

            return dynamicBranchProducts;
        }

        [HttpGet]
        [Route("GetProduct/{productID}/{branchID}")]
        public dynamic GetProduct([FromRoute] int productID, int branchID)
        {
            var branchProduct = db.BranchProduct.Include(zz => zz.Product).Include(zz => zz.Product.ProductReview).Include(zz => zz.ProductPrice).Where(zz => zz.ProductId == productID && zz.BranchId == branchID).First();

            ProductVM product = new ProductVM();

            product.productID = branchProduct.ProductId;
            product.productImage = branchProduct.Product.ProductImage;
            product.productName = branchProduct.Product.ProductName;
            product.productDescription = branchProduct.Product.ProductDescription;
            var isReview = branchProduct.Product.ProductReview.FirstOrDefault(zz => zz.ProductId == branchProduct.ProductId);
            if (isReview != null)
            {
                product.productRating = branchProduct.Product.ProductReview.Where(zz => zz.ProductId == branchProduct.ProductId).Select(zz => zz.RatingStars).Average();
            }
            product.productPrice = branchProduct.ProductPrice.Where(zz => zz.ProductId == branchProduct.ProductId).OrderByDescending(zz => zz.ProductPriceDate).Select(zz => zz.ProductPriceAmount).FirstOrDefault();

            return product;
        }

        [HttpPost]
        [Route("AddToCart")]
        public dynamic AddToCart([FromBody] CartVM cartData)
        {
            var isCart = db.Cart.Where(zz => zz.CustomerId == cartData.customerID).FirstOrDefault();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (isCart == null)
                {
                    var cart = new Cart
                    {
                        CartId = cartData.customerID,
                        CustomerId = cartData.customerID
                    };

                    db.Cart.Add(cart);
                    db.SaveChanges();
                }

                CartLine result = db.CartLine.Where(zz => zz.CartId == cartData.customerID && zz.ProductId == cartData.productID && zz.BranchId == cartData.branchID).FirstOrDefault();

                if (result != null)
                {
                    result.Quantity = cartData.quantity;

                    db.SaveChanges();
                }
                else
                {
                    var cartLine = new CartLine
                    {
                        BranchId = cartData.branchID,
                        ProductId = cartData.productID,
                        CartId = db.Cart.Where(zz => zz.CustomerId == cartData.customerID).Select(zz => zz.CartId).FirstOrDefault(),
                        Quantity = cartData.quantity
                    };

                    db.CartLine.Add(cartLine);
                    db.SaveChanges();
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("GetCart")]
        public dynamic GetCart([FromBody] CartFilterVM data)
        {
            var cartItems = db.CartLine.Include(zz => zz.BranchProduct).Include(zz => zz.BranchProduct.Product).Include(zz => zz.BranchProduct.ProductPrice).Where(zz => zz.CartId == data.cartID && zz.BranchId == data.branchID).ToList();

            return GetDynamicItems(cartItems);
        }

        public List<dynamic> GetDynamicItems(List<CartLine> cartItems)
        {
            var dynamicCartItems = new List<dynamic>();

            foreach (var item in cartItems)
            {
                dynamic dynamicCartItem = new ExpandoObject();
                dynamicCartItem.productID = item.ProductId;
                dynamicCartItem.branchID = item.BranchId;
                dynamicCartItem.productImage = item.BranchProduct.Product.ProductImage;
                dynamicCartItem.productName = item.BranchProduct.Product.ProductName;
                dynamicCartItem.productPrice = item.BranchProduct.ProductPrice.Where(zz => zz.ProductId == item.ProductId).OrderByDescending(zz => zz.ProductPriceDate).Select(zz => zz.ProductPriceAmount).FirstOrDefault();
                dynamicCartItem.quantity = item.Quantity;

                dynamicCartItems.Add(dynamicCartItem);
            }

            return dynamicCartItems;
        }

        [HttpPost]
        [Route("ClearCart")]
        public dynamic ClearCart([FromBody] CartFilterVM data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var itemsToRemove = db.CartLine.Where(zz => zz.CartId == data.cartID && zz.BranchId == data.branchID).ToList();

                db.CartLine.RemoveRange(itemsToRemove);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("RemoveItem")]
        public dynamic RemoveItem([FromBody] CartLineVM data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var itemToRemove = db.CartLine.Where(zz => zz.CartId == data.cartID && zz.BranchId == data.branchID && zz.ProductId == data.productID).First();

                db.CartLine.RemoveRange(itemToRemove);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("GetVAT")]
        public dynamic GetVAT()
        {
            var vatPercentage = db.Vat.OrderByDescending(zz => zz.VatDate).Select(zz => zz.VatPercentage).FirstOrDefault();

            return vatPercentage;
        }

        [HttpPost]
        [Route("Checkout")]
        public dynamic Checkout([FromBody] CheckoutVM data)
        {
            try
            {
                if (data.token != null)
                {
                    using (var wb = new WebClient())
                    {
                        var body = new NameValueCollection();
                        body["token"] = data.token;
                        body["amountInCents"] = data.amount.ToString();
                        body["currency"] = "ZAR";

                        wb.Headers.Add("X-Auth-Secret-Key", secretKey);
                        var response = wb.UploadValues("https://online.yoco.com/v1/charges/", "POST", body);
                        string responseInString = Encoding.UTF8.GetString(response);
                    }
                }

                using (var transact = db.Database.BeginTransaction())
                {
                    var saleID = db.Sale.OrderByDescending(zz => zz.SaleId).Select(zz => zz.SaleId).First() + 1;
                    var amountInRands = data.amount / 100;
                    object addressID = null;

                    if (data.completionMethod == 1)
                    {
                        addressID = db.CustomerAddress.Where(zz => zz.CustomerId == data.customerID).Select(zz => zz.AddressId).FirstOrDefault();
                    }

                    var sale = new Sale
                    {
                        SaleId = saleID,
                        DateOfSale = DateTime.Now,
                        SaleTotal = amountInRands,
                        CustomerId = data.customerID,
                        SaleStatusId = 1,
                        SaleTypeId = data.paymentMethod,
                        CompletionMethodId = data.completionMethod,
                        AddressId = (int?)addressID,
                        BranchId = data.branchID
                    };

                    db.Sale.Add(sale);
                    db.SaveChanges();

                    var cartItems = db.CartLine.Where(zz => zz.CartId == data.customerID && zz.BranchId == data.branchID).ToList();

                    List<SaleLine> dynamicSaleLines = new List<SaleLine>();

                    foreach (var item in cartItems)
                    {
                        SaleLine dynamicSaleLine = new SaleLine();
                        dynamicSaleLine.BranchId = item.BranchId;
                        dynamicSaleLine.ProductId = item.ProductId;
                        dynamicSaleLine.SaleId = saleID;
                        dynamicSaleLine.Quantity = item.Quantity;

                        dynamicSaleLines.Add(dynamicSaleLine);
                    }

                    db.SaleLine.AddRange(dynamicSaleLines);
                    db.CartLine.RemoveRange(cartItems);
                    db.SaveChanges();

                    var paymentTypeID = 1;
                    var amountPaid = amountInRands;

                    if (data.paymentMethod == 1)
                    {
                        paymentTypeID = 5;
                        amountPaid = 0;
                    }

                    var Payment = new SalePaymentType
                    {
                        PaymentTypeId = paymentTypeID,
                        SaleId = saleID,
                        AmountPaid = amountPaid
                    };

                    db.SalePaymentType.Add(Payment);
                    db.SaveChanges();

                    if (data.completionMethod == 1)
                    {
                        var delivery = new Delivery
                        {
                            SaleId = saleID,
                            IsPending = false
                        };

                        db.Delivery.Add(delivery);
                        db.SaveChanges();
                    }

                    transact.Commit();
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        [HttpPost]
        [Route("GetOrders")]
        public dynamic GetOrders([FromBody] OrderFilterVM data)
        {
            var orders = db.Sale.Include(zz => zz.SaleStatus).Include(zz => zz.CompletionMethod).Include(zz => zz.SalePaymentType).ThenInclude(zz => zz.PaymentType).Include(zz => zz.SaleLine).ThenInclude(zz => zz.BranchProduct.Product).ThenInclude(zz => zz.BranchProduct).ThenInclude(zz => zz.ProductPrice).Where(zz => zz.CustomerId == data.customerID && zz.DateOfSale.Year == data.orderDate).ToList();

            return GetDynamicOrders(orders);
        }

        public List<dynamic> GetDynamicOrders(List<Sale> orders)
        {
            var dynamicOrders = new List<dynamic>();

            foreach (var order in orders)
            {
                dynamic dynamicOrder = new ExpandoObject();
                dynamicOrder.orderID = order.SaleId;
                if (order.SaleStatusId == 1 || order.SaleStatusId == 2)
                {
                    dynamicOrder.orderStatus = "Being Prepared";
                    dynamicOrder.icon = "flame-outline";
                    dynamicOrder.color = "danger";
                }
                if (order.SaleStatusId == 4)
                {
                    dynamicOrder.orderStatus = "Packed";
                    dynamicOrder.icon = "cube-outline";
                    dynamicOrder.color = "success";
                }
                if (order.SaleStatusId == 3)
                {
                    dynamicOrder.orderStatus = "Completed";
                    dynamicOrder.icon = "checkmark-done-circle-outline";
                    dynamicOrder.color = "primary";
                }
                List<dynamic> orderLines = new List<dynamic>();
                foreach (var item in order.SaleLine)
                {
                    dynamic dynamicOrderLine = new ExpandoObject();
                    dynamicOrderLine.productImage = item.BranchProduct.Product.ProductImage;

                    orderLines.Add(dynamicOrderLine);
                }
                dynamicOrder.orderLines = orderLines;

                dynamicOrders.Add(dynamicOrder);
            }

            return dynamicOrders;
        }

        [HttpGet]
        [Route("GetOrder/{saleID}")]
        public dynamic GetOrder([FromRoute] int saleID)
        {
            var sale = db.Sale.Include(zz => zz.SaleStatus).Include(zz => zz.CompletionMethod).Include(zz => zz.SalePaymentType).ThenInclude(zz => zz.PaymentType).Include(zz => zz.SaleLine).ThenInclude(zz => zz.BranchProduct.Product).ThenInclude(zz => zz.BranchProduct).ThenInclude(zz => zz.ProductPrice).Where(zz => zz.SaleId == saleID).First();

            OrderVM order = new OrderVM();

            order.orderID = sale.SaleId;
            order.orderStatus = sale.SaleStatusId;
            order.orderDate = sale.DateOfSale;
            order.completionMethod = sale.CompletionMethod.CompletionMethodDescription;
            // order.paymentMethod = sale.SalePaymentType.Select(zz => zz.PaymentType.PaymentTypeDescription).First();
            List<dynamic> orderLines = new List<dynamic>();
            foreach (var item in sale.SaleLine)
            {
                dynamic dynamicOrderLine = new ExpandoObject();
                dynamicOrderLine.productID = item.ProductId;
                dynamicOrderLine.productName = item.BranchProduct.Product.ProductName;
                dynamicOrderLine.quantity = item.Quantity;
                dynamicOrderLine.productPrice = item.BranchProduct.ProductPrice.Where(zz => zz.ProductId == item.ProductId).OrderByDescending(zz => zz.ProductPriceDate).Select(zz => zz.ProductPriceAmount).FirstOrDefault();

                orderLines.Add(dynamicOrderLine);
            }
            order.orderLines = orderLines;

            return order;
        }

        [HttpPost]
        [Route("DoReview")]
        public dynamic DoReview([FromBody] ReviewVM data)
        {
            try
            {
                var currentReview = db.ProductReview.Where(zz => zz.CustomerId == data.customerID && zz.ProductId == data.productID).FirstOrDefault();

                if (currentReview == null)
                {
                    var Review = new ProductReview
                    {
                        RatingStars = data.ratingStars,
                        RatingOverview = data.ratingOverview,
                        CustomerId = data.customerID,
                        ProductId = data.productID
                    };

                    db.ProductReview.Add(Review);
                    db.SaveChanges();
                }
                else
                {
                    currentReview.RatingStars = data.ratingStars;
                    currentReview.RatingOverview = data.ratingOverview;
                    currentReview.CustomerId = data.customerID;
                    currentReview.ProductId = data.productID;

                    db.SaveChanges();
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        [HttpGet]
        [Route("GetCustomerDetails/{customerID}")]
        public dynamic GetCustomerDetails([FromRoute] int customerID)
        {
            var foundCustomer = db.Customer.Where(zz => zz.CustomerId == customerID).FirstOrDefault();

            CustomerVM customer = new CustomerVM();

            customer.customerName = foundCustomer.CustomerName;
            customer.customerSurname = foundCustomer.CustomerSurname;
            customer.customerTelephone = foundCustomer.CustomerTelephone;

            return customer;
        }

        [HttpPost]
        [Route("MakePayment")]
        public dynamic MakePayment([FromBody] PaymentVM data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                using (var transact = db.Database.BeginTransaction())
                {
                    var paymentToRemove = db.SalePaymentType.Where(zz => zz.SaleId == data.saleID).First();

                    db.SalePaymentType.Remove(paymentToRemove);
                    db.SaveChanges();

                    SalePaymentType payment = new SalePaymentType();

                    payment.SaleId = data.saleID;
                    payment.PaymentTypeId = db.PaymentType.Where(zz => zz.PaymentTypeDescription == data.paymentType).Select(zz => zz.PaymentTypeId).First();
                    payment.AmountPaid = data.amount;

                    db.SalePaymentType.Add(payment);
                    db.SaveChanges();

                    transact.Commit();
                }

                CompleteOrder(data.saleID);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("CompleteOrder")]
        public dynamic CompleteOrder([FromBody] int orderID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var saleToComplete = db.Sale.Where(zz => zz.SaleId == orderID).First();

                saleToComplete.SaleStatusId = 3;

                db.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}

//[HttpGet]
//[Route("GetDeals")]
//public dynamic GetDeals()
//{
//    var packages = db.Product.Where(zz => zz.ProductTypeId == 3).ToList();

//    return GetDynamicDeals(packages);
//}

//public dynamic GetDynamicDeals(List<Product> packages)
//{
//    var dynamicPackages = new List<dynamic>();

//    foreach (var package in packages)
//    {
//        var products = db.Product.Where(zz => zz.ProProductId == package.ProProductId && zz.ProductName != package.ProductName);

//        dynamic dynamicPackage = new ExpandoObject();
//        dynamicPackage.PackageName = package.ProductName;

//        List<dynamic> packageProducts = new List<dynamic>();
//        foreach (var product in products)
//        {
//            dynamic productObject = new ExpandoObject();
//            productObject.ProductName = product.ProductName;

//            packageProducts.Add(productObject);
//        }

//        dynamicPackages.Add(dynamicPackage);
//        dynamicPackages.Add(packageProducts);
//    }

//    return dynamicPackages;
//}