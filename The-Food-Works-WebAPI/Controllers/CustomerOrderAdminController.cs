using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using System.Data;
using System.Dynamic;
using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Proxies;
using System.Web;
using Microsoft.Extensions.Logging;
using static The_Food_Works_WebAPI.ViewModels.CustomerOrderData;
using System.Configuration;


namespace The_Food_Works_WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //SEARCH CUSTOMER ORDER SECTION
    public class CustomerOrderAdminController : ControllerBase
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        //Search for all customer orders
        [HttpGet]
        [Route("GetCustomerOrders")]
        public List<dynamic> getCustomerOrders()
        {
            try
            {
                var customerOrd = db.Sale.Include(x => x.SaleStatus).Include(x => x.Customer)
                    .Include(x => x.CompletionMethod).Include(x => x.Branch).Include(x => x.SaleType).Include(x => x.SalePaymentType).Where(x => x.SaleTypeId == 2).ToList();

                var customerOrders = db.SalePaymentType.Include(x => x.Sale).Include(x => x.Sale.Customer).Include(x => x.Sale.Branch).Include(x => x.Sale.CompletionMethod).Include(x => x.PaymentType).Where(x => x.Sale.SaleTypeId == 2).ToList();

                return testOrders(customerOrders);

            }
            catch (Exception e)
            {
                throw;
            }
        }

        public List<dynamic> testOrders(List<SalePaymentType> customerOrders)
        {
            List<dynamic> dynamicCustomerOrders = new List<dynamic>();

            var saleGroup = customerOrders.GroupBy(x => new { 
                x.SaleId,
                x.Sale.DateOfSale,
                x.Sale.Customer.CustomerName,
                x.Sale.Customer.CustomerSurname,
                x.Sale.Customer.CustomerTelephone,
                x.Sale.Branch.BranchName,
                x.Sale.CompletionMethod.CompletionMethodDescription,
                x.Sale.SaleStatus.SaleStatusDescription
            });

            foreach (var saleG in saleGroup)
            {
                dynamic dynamicCustomerOrder = new ExpandoObject();
                dynamicCustomerOrder.SaleId = saleG.Key.SaleId;
                dynamicCustomerOrder.DateofSale = saleG.Key.DateOfSale;
                dynamicCustomerOrder.CustomerName = saleG.Key.CustomerName;
                dynamicCustomerOrder.CustomerSurname = saleG.Key.CustomerSurname;
                dynamicCustomerOrder.CustomerTelephone = saleG.Key.CustomerTelephone;
                dynamicCustomerOrder.SaleStatusDescription = saleG.Key.SaleStatusDescription;
                dynamicCustomerOrder.CompletionMethodDescription = saleG.Key.CompletionMethodDescription;
                dynamicCustomerOrder.BranchName = saleG.Key.BranchName;

                List<dynamic> pList = new List<dynamic>();
                foreach (var p in saleG.GroupBy(x=> new { x.PaymentType.PaymentTypeId, x.PaymentType.PaymentTypeDescription }))
                {
                    dynamic paymentType = new ExpandoObject();
                    paymentType.PaymentTypeDescription = p.Key.PaymentTypeDescription;

                    pList.Add(paymentType);
                }

                dynamicCustomerOrder.paymentTypes = pList;

                dynamicCustomerOrders.Add(dynamicCustomerOrder);
            }


            return dynamicCustomerOrders;
        }


        //UPDATE CUSTOMER ORDER SECTION

        // Get sale statuses
        [HttpGet]
        [Route("GetSaleStatuses")]
        public List<dynamic> getSaleStatuses()
         {
             //db.Configuration.ProxyCreationEnabled = false;

             var saleStatuses = db.SaleStatus.ToList();

             return GetDynamicSaleStatuses(saleStatuses);
         }

         public List<dynamic> GetDynamicSaleStatuses(List<SaleStatus> saleStatuses)
         {
             var dynamicSaleStatuses = new List<dynamic>();

             foreach (var saleStatus in saleStatuses)
             {
                dynamic dynamicSaleStat = new ExpandoObject();
                dynamicSaleStat.SaleStatusId = saleStatus.SaleStatusId;
                dynamicSaleStat.SaleStatusDescription = saleStatus.SaleStatusDescription;

                dynamicSaleStatuses.Add(dynamicSaleStat);
             }

             return dynamicSaleStatuses;
         }


        //Get specific order
        [HttpPost]
        [Route("GetOneOrder")]
        public CustomerOrderVM getOneOrder(CustomerOrderVM SaleId)
        {
            try
            {
                var customerOneOrder = db.Sale.Include(x=>x.SaleStatus).Where(zz => zz.SaleId == SaleId.SaleId).FirstOrDefault();
                int statusId = customerOneOrder.SaleStatusId;
                //var branch = db.SaleLine.Where(x => x.BranchId == SaleId.SaleId).FirstOrDefault();
                var saleLines = db.SaleLine.Include(x=>x.BranchProduct.Product).Where(x => x.SaleId == SaleId.SaleId).ToList();

                CustomerOrderVM vm = new CustomerOrderVM();
                vm.SaleId = customerOneOrder.SaleId;
                vm.DateofSale = customerOneOrder.DateOfSale;
                vm.SaleStatusId = db.SaleStatus.Where(x => x.SaleStatusId == statusId).Select(x => x.SaleStatusId).FirstOrDefault();

                List<string> pNames = new List<string>();
                foreach (var saleLine in saleLines)
                {
                    string currentName = db.Product.Include(x=>x.BranchProduct).Where(x => x.ProductId == saleLine.ProductId).Select(x => x.ProductName).FirstOrDefault();
                    pNames.Add(currentName);
                }

                List<int> quantities = new List<int>();
                foreach (var saleLine in saleLines)
                {
                    int currentQuantity = db.SaleLine.Include(x=>x.BranchProduct).Where(x => x.BranchProduct.ProductId == saleLine.ProductId && x.SaleId == saleLine.SaleId).Select(x => x.Quantity).FirstOrDefault();
                    quantities.Add(currentQuantity);
                }

                vm.ProductNames = pNames;
                vm.Quantities = quantities;

                return vm;
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPut]
        [Route("UpdateCustomerOrder")]
        public ActionResult updateCustomerOrder(CustomerOrderVM vm)//send whole model from angular to api
        {
            try
            {
                var orderToUpdate = db.Sale.Where(zz => zz.SaleId == vm.SaleId).FirstOrDefault();

                if (vm.SaleStatusId == orderToUpdate.SaleStatusId)
                {
                    return BadRequest();
                }
                else
                {
                    orderToUpdate.SaleStatusId = vm.SaleStatusId;

                    db.SaveChanges();
                    return Ok();
                }

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);

            }
        }


    }
}
