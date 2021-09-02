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
using System.Web;
using Microsoft.Extensions.Logging;
using System.Configuration;
using The_Food_Works_WebAPI.ViewModels;
using The_Food_Works_WebAPI.services;

namespace The_Food_Works_WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        //ADD SUPPLIER SECTION

        // Get supplier types
        [HttpGet]
        [Route("GetTypes")]
        public List<dynamic> getSupplierTypes()
        {
            var supplierTypes = db.SupplierType.ToList();

            return GetDynamicSupplierTypes(supplierTypes);
        }

        public List<dynamic> GetDynamicSupplierTypes(List<SupplierType> supplierTypes)
        {
            var dynamicSupplierTypes = new List<dynamic>();

            foreach (var supplierType in supplierTypes)
            {
                dynamic dynamicsupplierType = new ExpandoObject();
                dynamicsupplierType.SupplierTypeId = supplierType.SupplierTypeId;
                dynamicsupplierType.SupplierTypeName = supplierType.SupplierTypeName;

                dynamicSupplierTypes.Add(dynamicsupplierType);
            }

            return dynamicSupplierTypes;
        }

        // Get order methods
        [HttpGet]
        [Route("GetOrderMethods")]
        public List<dynamic> getOrderMethods()
        {
            var orderMethods = db.OrderMethod.ToList();

            return GetDynamicOrderMethods(orderMethods);
        }

        public List<dynamic> GetDynamicOrderMethods(List<OrderMethod> orderMethods)
        {
            var dynamicOrderMethods = new List<dynamic>();

            foreach (var orderMethod in orderMethods)
            {
                dynamic dynamicOrderMethod = new ExpandoObject();
                dynamicOrderMethod.OrderMethodId = orderMethod.OrderMethodId;
                dynamicOrderMethod.OrderMethodName = orderMethod.OrderMethodName;

                dynamicOrderMethods.Add(dynamicOrderMethod);
            }

            return dynamicOrderMethods;
        }

        
        // Get statuses
        [HttpGet]
        [Route("GetStatuses")]
        public List<dynamic> getStatuses()
        {
            var statuses = db.SupplierStatus.ToList();

            return GetDynamicStatuses(statuses);
        }

        public List<dynamic> GetDynamicStatuses(List<SupplierStatus> statuses)
        {
            var dynamicStatuses = new List<dynamic>();

            foreach (var status in statuses)
            {
                dynamic dynamicStatus = new ExpandoObject();
                dynamicStatus.SupplierStatusId = status.SupplierStatusId;
                dynamicStatus.SupplierStatusName = status.SupplierStatusName;

                dynamicStatuses.Add(dynamicStatus);
            }

            return dynamicStatuses;
        }




        //Helper function
        private bool SupplierExists(string supplierName)
        {
            //db.Configuration.ProxyCreationEnabled = false;
            var supplier = db.Supplier.Where(zz => zz.SupplierName == supplierName).FirstOrDefault();

            return supplier != null;
        }

        /* [HttpPost]
         [Route("AddSupplier")]
         public ActionResult addSupplier(SupplierDetailsViewModel vm)
         {
             if (this.SupplierExists(vm.SupplierName))
             {
                 return Forbid();
             }
             if (!ModelState.IsValid)
             {
                 return BadRequest(ModelState);
             }

             var newSupplier = new Supplier
             {
                 SupplierName = vm.SupplierName,
                 SupplierContactNumber = vm.SupplierContactNumber,
                 SupplierEmailAddress = vm.SupplierEmailAddress,
                 SupplierTypeId = vm.SupplierTypeID,
                 SupplierStatusId = vm.SupplierStatusID,
                 //OrderMethodId = vm.OrderMethodID
                 //address + order day
             };

             try
             {
                 using (var transSQL = db.Database.BeginTransaction())
                 {
                     var supplier = new Supplier
                     {
                         SupplierName = vm.SupplierName,
                         SupplierVatNumber = vm.SupplierVatNumber,
                         SupplierContactNumber = vm.
                         BranchStatus = true
                     };
                 }
             }
             catch (Exception e)
             {
                 return BadRequest(e.Message);
             }
         }*/

        //Search for all suppliers section
        //[ServiceFilter(typeof(AuditFilterAttribute))]
        [HttpGet]
        [Route("GetSuppliers")]
        public List<dynamic> getSuppliers()
        {
            try
            {
                var suppliers = db.SupplierOrderDay.Include(x=>x.Supplier).ThenInclude(x => x.SupplierAddress).Include(x => x.Supplier.OrderMethod).Include(x=>x.Supplier.SupplierAddress).Include(x=>x.Supplier.OrderMethod).Where(x=>x.Supplier.SupplierStatusId==1).ToList();

                return testSuppliers(suppliers);

            }
            catch (Exception)
            {

                throw;
            }
        }

        public List<dynamic> testSuppliers(List<SupplierOrderDay> suppliers)
        {
            List<dynamic> dynamicSuppliers = new List<dynamic>();

            var supplierGroup = suppliers.GroupBy(x => new
            {
                x.SupplierId,
                x.Supplier.SupplierName,
                x.Supplier.SupplierVatNumber,
                x.Supplier.SupplierContactNumber,
                x.Supplier.SupplierEmailAddress,
                x.Supplier.OrderMethod.OrderMethodName,
                // x.Supplier.SupplierAddress.SupplierAddressBuildingNumber,
                // x.Supplier.SupplierAddress.SupplierAddressStreetName,
                // x.Supplier.SupplierAddress.SupplierAddressCity
            });

            foreach (var supplierG in supplierGroup)
            {
                dynamic dynamicSupplier = new ExpandoObject();
                dynamicSupplier.SupplierId = supplierG.Key.SupplierId;
                dynamicSupplier.SupplierName = supplierG.Key.SupplierName;
                dynamicSupplier.SupplierVatNumber = supplierG.Key.SupplierVatNumber;
                dynamicSupplier.SupplierContactNumber = supplierG.Key.SupplierContactNumber;
                dynamicSupplier.SupplierEmailAddress = supplierG.Key.SupplierEmailAddress;
                dynamicSupplier.OrderMethodName = supplierG.Key.OrderMethodName;
                // dynamicSupplier.SupplierAddressBuildingNumber = supplierG.Key.SupplierAddressBuildingNumber;
                // dynamicSupplier.SupplierAddressStreetName = supplierG.Key.SupplierAddressStreetName;
                // dynamicSupplier.SupplierAddressCity = supplierG.Key.SupplierAddressCity;


                List<dynamic> dayList = new List<dynamic>();
                foreach (var day in supplierG.GroupBy(x => new { x.SupplierOrderId, x.SupplierOrderDayDescription }))
                {
                    dynamic orderDay = new ExpandoObject();
                    orderDay.SupplierOrderDayDescription = day.Key.SupplierOrderDayDescription;

                    dayList.Add(orderDay);
                }

                dynamicSupplier.orderDays = dayList;

                dynamicSuppliers.Add(dynamicSupplier);
            }


            return dynamicSuppliers;
        }
        public List<dynamic> getDynamicSuppliers(List<Supplier> suppliers, string orderDay)
        {
            var dynamicSuppliers = new List<dynamic>();
            foreach (var supplier in suppliers)
            {
                dynamic dynamicSupplier = new ExpandoObject();
                dynamicSupplier.SupplierId = supplier.SupplierId;
                dynamicSupplier.SupplierName = supplier.SupplierName;
                dynamicSupplier.SupplierVatNumber = supplier.SupplierVatNumber;
                dynamicSupplier.SupplierContactNumber = supplier.SupplierContactNumber;
                dynamicSupplier.SupplierEmailAddress = supplier.SupplierEmailAddress;
                dynamicSupplier.orderDay = orderDay;

                dynamicSupplier.OrderMethodName = supplier.OrderMethod.OrderMethodName;

                dynamicSuppliers.Add(dynamicSupplier);

            }

            return dynamicSuppliers;
        }


        //ADD SUPPLIER
        [HttpPost]
        [Route("AddSupplier")]
        public ActionResult addSupplier([FromBody] SupplierCombinedVM supplier)
        {
            try
            {
                //check if VAT number already exists
                var check = db.Supplier.Where(zz => zz.SupplierVatNumber == supplier.supplier.SupplierVatNumber).FirstOrDefault();

                if (check != null)
                {
                    return BadRequest();
                }
                else
                {
                    int addressId = db.SupplierAddress.Max(x => x.SupplierAddressId);
                    var newAddress = new SupplierAddress
                    {
                        SupplierAddressId = addressId + 1,
                        SupplierAddressBuildingNumber = supplier.address.SupplierAddressBuildingNumber,
                        SupplierAddressFull = supplier.address.SupplierAddressFull,
                        SupplierAddressStreetName = supplier.address.SupplierAddressStreetName,
                        SupplierAddressSuburb = supplier.address.SupplierAddressSuburb,
                        SupplierAddressProvince = supplier.address.SupplierAddressProvince,
                        SupplierAddressCity = supplier.address.SupplierAddressCity,
                        SupplierAddressCountry = supplier.address.SupplierAddressCountry,
                        SupplierAddressDate = DateTime.Now,
                        SupplierAddressLat = supplier.address.SupplierAddressLat,
                        SupplierAddressLng = supplier.address.SupplierAddressLng,
                        SupplierAddressZipCode = supplier.address.SupplierAddressZip
                    };


                    db.SupplierAddress.Add(newAddress);
                    db.SaveChanges();


                    int supplierId = db.Supplier.Max(x => x.SupplierId);
                    var newSupplier = new Supplier
                    {
                        SupplierId = supplierId + 1,
                        SupplierName = supplier.supplier.SupplierName,
                        SupplierContactNumber = supplier.supplier.SupplierContactNumber,
                        SupplierVatNumber = supplier.supplier.SupplierVatNumber,
                        SupplierEmailAddress = supplier.supplier.SupplierEmailAddress,
                        SupplierTypeId = supplier.supplier.SupplierTypeID,
                        SupplierStatusId = 1,
                        OrderMethodId = supplier.supplier.OrderMethodID,
                        SupplierAddressId = addressId + 1,
                    };


                    db.Supplier.Add(newSupplier);
                    db.SaveChanges();


                    var daysToAdd = supplier.supplier.orderDays;
                    for (int i = 0; i < daysToAdd.Count(); i++)
                    {
                        int supplierOrderDayid = db.SupplierOrderDay.Max(x => x.SupplierOrderId);
                        var newDays = new SupplierOrderDay
                        {
                            SupplierOrderId = supplierOrderDayid + 1,
                            SupplierId = supplierId + 1,
                            SupplierOrderDayDescription = daysToAdd[i].SupplierOrderDayDescription
                        };

                        db.SupplierOrderDay.Add(newDays);
                        db.SaveChanges();
                    }

                }

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok();
        }

        [HttpPost]
        [Route("FindSupplier")]
        // [services.ClaimRequirement("Permission", "Admin")]
        public SupplierVM FindSupplier(SupplierVM id)
        {
            var role = db.Supplier.Where(x => x.SupplierId == id.SupplierId).FirstOrDefault();
            SupplierVM newRole = new SupplierVM();
            newRole.SupplierId = role.SupplierId;
            newRole.SupplierName = role.SupplierName;
            newRole.SupplierVatNumber = role.SupplierVatNumber;
            newRole.OrderMethodID = role.OrderMethodId;
            newRole.SupplierEmailAddress = role.SupplierEmailAddress;
            newRole.SupplierContactNumber = role.SupplierContactNumber;
            newRole.SupplierTypeID = role.SupplierTypeId;
            return newRole;
        }

        [HttpPost]
        [Route("UpdateSupplier")]

        public ActionResult UpdateSupplier(SupplierVM updatedSupplier)
        {

            try
            {
                var supplierToUpdate = db.Supplier.Where(x => x.SupplierId == updatedSupplier.SupplierId).FirstOrDefault();

                supplierToUpdate.SupplierName = updatedSupplier.SupplierName;
                supplierToUpdate.SupplierVatNumber = updatedSupplier.SupplierVatNumber;
                supplierToUpdate.SupplierContactNumber = updatedSupplier.SupplierContactNumber;
                supplierToUpdate.SupplierEmailAddress = updatedSupplier.SupplierEmailAddress;
                // supplierToUpdate.SupplierOrderDay = updatedSupplier.orderDays;
                supplierToUpdate.OrderMethodId = updatedSupplier.OrderMethodID;


                //var daysToAdd = updatedSupplier.orderDays;
                //for (int i = 0; i < daysToAdd.Count(); i++)
                //{
                //    int supplierOrderDayid = db.SupplierOrderDay.Max(x => x.SupplierOrderId);
                //    var newDays = new SupplierOrderDay
                //    {
                //        Supplier = supplierToUpdate,
                //        SupplierOrderId = supplierOrderDayid + 1,
                //        SupplierId = supplierToUpdate.SupplierId ,
                //        SupplierOrderDayDescription = daysToAdd[i].SupplierOrderDayDescription
                //    };
                //    db.SaveChanges();
                //}
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("FindSupplier")]
        // [services.ClaimRequirement("Permission", "Admin")]
        public SuppAdd FindSupplier(SuppAdd vat)
        {
            var getSupp = db.Supplier.Where(x => x.SupplierVatNumber == vat.SupplierVatNumber).FirstOrDefault();

            SuppAdd supp = new SuppAdd();

            //SUPPLIER DETAILS
            supp.SupplierId = getSupp.SupplierId;
            supp.SupplierName = getSupp.SupplierName;
            supp.SupplierVatNumber = getSupp.SupplierVatNumber;
            supp.OrderMethodID = getSupp.OrderMethodId;
            supp.SupplierEmailAddress = getSupp.SupplierEmailAddress;
            supp.SupplierContactNumber = getSupp.SupplierContactNumber;
            supp.SupplierTypeID = getSupp.SupplierTypeId;
            supp.SupplierStatusID = getSupp.SupplierStatusId;

            //ADDRESS DETAILS
            var getAddress = db.SupplierAddress.Where(x => x.SupplierAddressId == getSupp.SupplierAddressId).FirstOrDefault();
            supp.SupplierAddressId = getAddress.SupplierAddressId;
            supp.SupplierAddressBuildingNumber = getAddress.SupplierAddressBuildingNumber;
            supp.SupplierAddressStreetName = getAddress.SupplierAddressStreetName;
            supp.SupplierAddressFull = getAddress.SupplierAddressFull;
            supp.SupplierAddressSuburb = getAddress.SupplierAddressSuburb;
            supp.SupplierAddressProvince = getAddress.SupplierAddressProvince;
            supp.SupplierAddressCity = getAddress.SupplierAddressCity;
            supp.SupplierAddressCountry = getAddress.SupplierAddressCountry;
            supp.SupplierAddressZip = getAddress.SupplierAddressZipCode;
            supp.SupplierAddressLat = getAddress.SupplierAddressLat;
            supp.SupplierAddressLng = getAddress.SupplierAddressLng;

            return supp;
        }

        [HttpPost]
        [Route("UpdateSupplier")]

        public ActionResult UpdateSupplier(SuppAdd updatedSupplier)
        {

            try
            {
                var supplierToUpdate = db.Supplier.Where(x => x.SupplierVatNumber == updatedSupplier.SupplierVatNumber).FirstOrDefault();

                //ADDRESS
                var addressToUpdate = db.SupplierAddress.Where(x => x.SupplierAddressId == supplierToUpdate.SupplierAddressId).FirstOrDefault();
                addressToUpdate.SupplierAddressBuildingNumber = updatedSupplier.SupplierAddressBuildingNumber;
                addressToUpdate.SupplierAddressFull = updatedSupplier.SupplierAddressStreetName;
                addressToUpdate.SupplierAddressFull = updatedSupplier.SupplierAddressFull;
                addressToUpdate.SupplierAddressSuburb = updatedSupplier.SupplierAddressSuburb;
                addressToUpdate.SupplierAddressProvince = updatedSupplier.SupplierAddressProvince;
                addressToUpdate.SupplierAddressCity = updatedSupplier.SupplierAddressCity;
                addressToUpdate.SupplierAddressCountry = updatedSupplier.SupplierAddressCountry;
                addressToUpdate.SupplierAddressZipCode = updatedSupplier.SupplierAddressZip;
                addressToUpdate.SupplierAddressLat = updatedSupplier.SupplierAddressLat;
                addressToUpdate.SupplierAddressLng = updatedSupplier.SupplierAddressLng;

                db.SaveChanges();


                //SUPPLIER

                supplierToUpdate.SupplierName = updatedSupplier.SupplierName;
                supplierToUpdate.SupplierVatNumber = updatedSupplier.SupplierVatNumber;
                supplierToUpdate.SupplierContactNumber = updatedSupplier.SupplierContactNumber;
                supplierToUpdate.SupplierEmailAddress = updatedSupplier.SupplierEmailAddress;
                // supplierToUpdate.SupplierOrderDay = updatedSupplier.orderDays;
                supplierToUpdate.OrderMethodId = updatedSupplier.OrderMethodID;
                supplierToUpdate.SupplierTypeId = updatedSupplier.SupplierTypeID;
                supplierToUpdate.SupplierStatusId = updatedSupplier.SupplierStatusID;
                supplierToUpdate.SupplierAddressId = addressToUpdate.SupplierAddressId;

                db.SaveChanges();


                var daysToAdd = updatedSupplier.orderDays;
                var currentDays = db.SupplierOrderDay.Where(x => x.SupplierId == supplierToUpdate.SupplierId).ToList();
                var maxId = db.SupplierOrderDay.Max(x => x.SupplierOrderId);

                for (int i = 0; i < currentDays.Count(); i++)
                {
                    db.Remove(currentDays[i]);

                    db.SaveChanges();
                }

                for (int i = 0; i < currentDays.Count(); i++)
                {
                    var newContent = new SupplierOrderDay
                    {
                        SupplierId = supplierToUpdate.SupplierId,
                        SupplierOrderId = maxId + 1,
                        SupplierOrderDayDescription = currentDays[i].SupplierOrderDayDescription
                    };

                    db.SupplierOrderDay.Add(newContent);
                    db.SaveChanges();
                }

                //var daysToAdd = updatedSupplier.orderDays;
                //for (int i = 0; i < daysToAdd.Count(); i++)
                //{
                //    int supplierOrderDayid = db.SupplierOrderDay.Max(x => x.SupplierOrderId);
                //    var newDays = new SupplierOrderDay
                //    {
                //        Supplier = supplierToUpdate,
                //        SupplierOrderId = supplierOrderDayid + 1,
                //        SupplierId = supplierToUpdate.SupplierId ,
                //        SupplierOrderDayDescription = daysToAdd[i].SupplierOrderDayDescription
                //    };
                //    db.SaveChanges();
                //}
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
