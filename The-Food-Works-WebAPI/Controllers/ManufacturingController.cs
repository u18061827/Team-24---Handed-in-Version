using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Helpers;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using The_Food_Works_WebAPI.ViewModels;
using System.Text.Json;
using System.Text.Json.Serialization;
using static The_Food_Works_WebAPI.ViewModels.Data;
using static The_Food_Works_WebAPI.ViewModels.GlobalVariables;

namespace The_Food_Works_WebAPI.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class ManufacturingController : Controller
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        UserInfoVM currentUser = MyGlobalVariable;

        [HttpGet]
        [Route("GetAllCookingLists")]
        public List<dynamic> getAllCookingLists()
        {


            var cookingLists = db.CookingList.Where(x => x.CookingListDate >= DateTime.Now.Date).ToList();
            return getDynamicCookingLists(cookingLists);
        }

        public List<dynamic> getDynamicCookingLists(List<CookingList> cookingLists)
        {
            var dynamicLists = new List<dynamic>();

            foreach (var list in cookingLists)
            {
                dynamic dynamicCookingList = new ExpandoObject();

                dynamicCookingList.CookingListId = list.CookingListId;
                dynamicCookingList.CookingListDate = list.CookingListDate;

                dynamicLists.Add(dynamicCookingList);
            }

            return dynamicLists;
        }

        [HttpPost]
        [Route("AddCookingList")]
        public ActionResult addCookingList(CookingList cookingList)
        {
            CookingList cookingListToWrite;
            try
            {
                var dates = db.CookingList.Select(x => x.CookingListDate.Date).ToList();
                if (dates.Contains(cookingList.CookingListDate.Date))
                {
                    return Forbid();
                }
                else
                {
                    int lastID = db.CookingList.Max(x => x.CookingListId);
                    cookingListToWrite = new CookingList
                    {
                        CookingListId = lastID + 1,
                        CookingListDate = cookingList.CookingListDate,

                    };
                    db.CookingList.Add(cookingListToWrite);
                    db.SaveChanges();
                }

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok(cookingListToWrite);
        }


        [HttpGet]
        [Route("GetProductsNeeded")]
        public List<ProductionVM> getProductsNeeded()
        {
            ProductionVM productNeeded = new ProductionVM { };
            ProductionVM productToAdd;

            List<ProductionVM> productNumbers = new List<ProductionVM>();

            var finishedProducts = db.BranchProduct.Include(x => x.Product).Where(x => x.Product.ProductTypeId != 2 && x.Product.ProductTypeId != 3 && x.BranchId == MyGlobalVariable.BranchId).ToList();

            //orderlins that are not yet complete
            var orderlines = db.SaleLine.Include(x => x.Sale).Where(x => x.Sale.SaleStatusId == 1 && x.Sale.SaleTypeId == 2).ToList();

            //request lines that are noy yet completed
            var requestLines = db.BranchRequestLine.Include(x => x.BranchRequest).Where(x => x.BranchRequest.RequestStatusId == 1).ToList();


            int quantityOrdered = 0;

            int quantityRequested = 0;

            //get details of finished products
            foreach (var fp in finishedProducts)
            {

                quantityOrdered = getQuantityOrdered(orderlines, fp.ProductId);

                quantityRequested = getQuantityRequested(requestLines, fp.ProductId);


                productToAdd = new ProductionVM
                {
                    ProductId = fp.Product.ProductId,
                    ProductBarcode = fp.Product.ProductBarcode,
                    ProductName = fp.Product.ProductName,
                    QuantityOnHand = fp.QuantityOnHand,
                    QuantityOrdered = quantityOrdered,
                    QuantityRequested = quantityRequested,

                };
                productNumbers.Add(productToAdd);

            }


            return (productNumbers);
        }

        public int getQuantityOrdered(List<SaleLine> ol, int productId)
        {
            int qo = 0;
            foreach (var sale1 in ol)
            {
                if (sale1.ProductId == productId)
                {
                    qo = qo + sale1.Quantity;
                }
            }

            return qo;
        }

        public int getQuantityRequested(List<BranchRequestLine> rls, int productId)
        {
            int ro = 0;
            foreach (var rl in rls)
            {
                if (rl.ProductId == productId)
                {
                    ro = ro + rl.RequestedQuantity;
                }
            }

            return ro;
        }


        [HttpPost]
        [Route("WriteBatch")]
        public ActionResult writeBatch(ProductionVM batch)
        {
            try
            {


                //get batchID
                int lastID = db.Batch.Max(x => x.BatchId);

                Batch batchToWrite = new Batch
                {
                    BatchId = lastID + 1,
                    CookingListId = batch.CookingListId,
                    BatchStatusId = 1,


                };
                db.Batch.Add(batchToWrite);
                db.SaveChanges();

                foreach (var line in batch.batchLines)
                {
                    BatchLine batchLinesToWrite = new BatchLine
                    {
                        ProductId = line.ProductId,
                        BatchId = lastID + 1,
                        Quantity = line.Quantity,
                    };
                    db.BatchLine.Add(batchLinesToWrite);
                    db.SaveChanges();


                }
            }

            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok();


        }
        [HttpGet]
        [Route("GetBatches")]
        public List<dynamic> getBatches()
        {


            var batches = db.Batch.Include(x => x.CookingList).Include(x => x.BatchStatus).Where(x => x.BatchStatusId == 1).ToList();

            var dynamicBatches = new List<dynamic>();

            foreach (var batch in batches)
            {
                dynamic dynamicBatch = new ExpandoObject();
                dynamicBatch.BatchId = batch.BatchId;
                dynamicBatch.CookingListDate = batch.CookingList.CookingListDate;
                dynamicBatch.BatchStatusName = batch.BatchStatus.BatchStatusName;
                dynamicBatches.Add(dynamicBatch);
            }
            return (dynamicBatches);
            
        }


        [HttpPost]
        [Route("GetBatchDetails")]
        public ActionResult getBatchDetails(object batchid)
        {
            try { 
            string jsonString = System.Text.Json.JsonSerializer.Serialize(batchid);
            int batchID = Convert.ToInt32(jsonString);

            var batchDetails = db.BatchLine.Include(x => x.Batch).ThenInclude(x => x.CookingList).Include(x => x.Product).Where(x => x.BatchId == batchID).ToList();

            var dynamicBatchDetails = new List<dynamic>();

            foreach (var bd in batchDetails)
            {
                dynamic dynamicBatchDetail = new ExpandoObject();
                dynamicBatchDetail.BatchId = bd.BatchId;
                dynamicBatchDetail.CookingListId = bd.Batch.CookingList.CookingListId;
                dynamicBatchDetail.CookingListDate = bd.Batch.CookingList.CookingListDate;
                dynamicBatchDetail.ProductId = bd.ProductId;
                dynamicBatchDetail.ProductName = bd.Product.ProductName;
                dynamicBatchDetail.Quantity = bd.Quantity;

                dynamicBatchDetails.Add(dynamicBatchDetail);

            }
                return Ok(dynamicBatchDetails);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }


           

        }

        [HttpPost]
        [Route("UpdateBatchDetails")]
        public ActionResult getBatchDetails(BatchLine updatedBatch)
        {
            //get batch line to update
            try
            {
                var toUpdate = db.BatchLine.Where(x => x.BatchId == updatedBatch.BatchId && x.ProductId == updatedBatch.ProductId).FirstOrDefault();

                toUpdate.Quantity = updatedBatch.Quantity;

                db.SaveChanges();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok();

        }

        [HttpGet]
        [Route("GetEmployees")]
        public List<dynamic> getEmployeeList()
        {

            
            var employees = db.User.Include(x => x.Employee).Where(x => x.UserStatusId == 1&& x.UserRoleId ==5).ToList();

            var dynamicEmployees = new List<dynamic>();

            foreach (var employee in employees)
            {
                dynamic dynamicEmployee = new ExpandoObject();
                dynamicEmployee.EmployeeId = employee.EmployeeId;
                dynamicEmployee.FullName = employee.Employee.EmployeeName;
                dynamicEmployee.Surname= employee.Employee.EmployeeSurname;
                dynamicEmployees.Add(dynamicEmployee);

            }

                return (dynamicEmployees);
        }


        [HttpGet]
        [Route("GetCookingListDetails")]
        public List<dynamic> getCookingListDetails()
        {
            var todaysDate = DateTime.Now.Date;

            var cookingListDetails = db.CookingList.Where(x => x.CookingListDate == todaysDate).FirstOrDefault();

            var batches = db.Batch.Where(x => x.CookingList.CookingListId == cookingListDetails.CookingListId).ToList();


            if (cookingListDetails == null)
            {
                return null;
            }


            var dynamicBatchDetails = new List<dynamic>();

            foreach ( var batch in batches)
            {
                var batchDetails = db.BatchLine.Include(x => x.Batch).Include(x => x.Product).Where(x => x.BatchId == batch.BatchId);
               
                foreach (var bd in batchDetails)
                {
                    dynamic dynamicBd = new ExpandoObject();
                    dynamicBd.CookingListId = cookingListDetails.CookingListId;
                    dynamicBd.CookingListDate = cookingListDetails.CookingListDate;
                    dynamicBd.ProductId = bd.ProductId;
                    dynamicBd.ProductName = bd.Product.ProductName;
                    dynamicBd.BatchId = bd.BatchId;
                    dynamicBd.Quantity = bd.Quantity;

                    dynamicBatchDetails.Add(dynamicBd);

                }
            }
            

            return dynamicBatchDetails;
        }

        

        [HttpPost]
        [Route("ReconcileBatch")]
        public ActionResult reconcileBatch(ProductionVM batch)
        {
            try {

                var batchToUpdate = db.Batch.Where(x => x.BatchId == batch.BatchId).FirstOrDefault();

                batchToUpdate.EmployeeId = batch.EmployeeId;
                batchToUpdate.BatchStatusId = 3;

                db.SaveChanges();


                foreach(var batchLine in batch.batchLines)
                {
                    var branchProduct = db.BranchProduct.Where(x => x.BranchId == MyGlobalVariable.BranchId && x.ProductId == batchLine.ProductId).FirstOrDefault();

                    branchProduct.QuantityOnHand = branchProduct.QuantityOnHand + batchLine.Quantity;

                    db.SaveChanges();


                }

            }

            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok();


        }
    }

}


