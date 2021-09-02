using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using static The_Food_Works_WebAPI.ViewModels.Data;

namespace The_Food_Works_WebAPI.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AdminController : DeliveryController
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpGet]
        [Route("getAllUserRoles")]
        public List<dynamic> getUserRoles()
        {
            var userRoles = db.UserRole.ToList();
            return getDynamicUserRole(userRoles);
        }
        public List<dynamic> getDynamicUserRole(List<UserRole> userRoles)
        {
            var dynamicUserRoles = new List<dynamic>();

            foreach (var userRole in userRoles)
            {
                dynamic dynamicUserRole = new ExpandoObject();
                dynamicUserRole.UserRoleId = userRole.UserRoleId;
                dynamicUserRole.UserRoleName = userRole.UserRoleName;
                dynamicUserRole.UserRoleDescription = userRole.UserRoleDescription;
                dynamicUserRoles.Add(dynamicUserRole);
            }

            return dynamicUserRoles;
        }
        // [services.ClaimRequirement("Permission", "Admin")]
        [HttpPost]
        [Route("AddUserRole")]
        //[AuditThis]
        //{Controller},{ACTION},{uSERNAME}, QueryString, RequestBody, dateTime
        // [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult addUserRole(UserRoleVM userRole)
        {
            try
            {
                var id = db.UserRole.Select(x => x.UserRoleId).Max();
                var newUserRole = new UserRole
                {
                   // UserRoleId = id + 1,
                    UserRoleName = userRole.name,
                    UserRoleDescription = userRole.description
                };

                db.UserRole.Add(newUserRole);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // [services.ClaimRequirement("Permission", "Admin")]
        [HttpPost]
        [Route("UpdateUserRole")]
        // [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult updateUserRole(UserRoleVM updatedRole)
        {

            try
            {

                var roleToUpdate = db.UserRole.Where(x => x.UserRoleId == updatedRole.ID).FirstOrDefault();
                roleToUpdate.UserRoleName = updatedRole.name;
                roleToUpdate.UserRoleDescription = updatedRole.description;

                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("FindUserRole")]
        // [services.ClaimRequirement("Permission", "Admin")]
        public UserRoleVM FindUserRole(UserRoleVM vm)
        {
            var role = db.UserRole.Where(x => x.UserRoleId == vm.ID).FirstOrDefault();
            UserRoleVM newRole = new UserRoleVM();
            newRole.ID = role.UserRoleId;
            newRole.name = role.UserRoleName;
            newRole.description = role.UserRoleDescription;
            return newRole;
        }

        public List<dynamic> getDynamicProducts(List<Product> products)
        {
            var dynamicProducts = new List<dynamic>();

            foreach (var product in products)
            {

                dynamic dynamicproduct = new ExpandoObject();

                dynamicproduct.ID = product.ProductId;

                dynamicproduct.name = product.ProductName;

                dynamicproduct.description = product.ProductDescription;

                var branchP = db.BranchProduct.Where(x => x.ProductId == product.ProductId && x.BranchId == 1).FirstOrDefault();

                if (branchP != null)
                    dynamicproduct.QOH = branchP.QuantityOnHand;
                else
                    dynamicproduct.QOH = 0;

                dynamicProducts.Add(dynamicproduct);

            }
            return dynamicProducts;

        }

        // [services.ClaimRequirement("Permission", "Admin")]
        [HttpGet]
        [Route("GetAllBranchProducts")]
        public List<dynamic> getAllBranchProducts()
        {
            var branchProducts = new List<dynamic>();
            var branches = db.Branch.Take(2).ToList();
            foreach (var b in branches)
            {
                dynamic branch = new ExpandoObject();
                branch.Name = b.BranchName;
                branch.ID = b.BranchId;
                var tmpBP = db.BranchProduct
                    .Include(bp => bp.Product)
                    .Where(p => p.BranchId == b.BranchId)
                    .Select(o => new
                    {
                        ID = o.ProductId,
                        name = o.Product.ProductName,
                        description = o.Product.ProductDescription,
                        QOH = o.QuantityOnHand

                    })
                    .ToList();

                branch.Products = tmpBP;
                branchProducts.Add(branch);

            }
            return branchProducts;
        }

        List<Product> WOproducts = new List<Product>();
        // [services.ClaimRequirement("Permission", "Admin")]
        [HttpPost]
        [Route("FindProduct")]
        public List<Product> FindProduct(SelectedProductVM[] vm)
        {
            for (int i = 0; i < vm.Length; i++)
            {
                // var product = db.BranchProduct.Where(y => y.BranchId == vm[i].BranchId && y.ProductId == vm[i].SelectedId).FirstOrDefault();
                var product = db.Product
                    .Where(x => x.ProductId == vm[i].SelectedId)
                    .FirstOrDefault();

                WOproducts.Add(product);
            }
            return WOproducts;
        }


        [HttpPost]
        [Route("ValidateWO")]
        public bool ValidateWO(WriteOffVM vm)
        {
            var product = db.BranchProduct.Where(x => x.ProductId == vm.productId).FirstOrDefault();
            if (vm.WOQuantity <= product.QuantityOnHand)
            {
                return true;
            }
            else
                return false;

        }

        [HttpPost]
        [Route("FinalWriteOff")]
        // [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult FinalWriteOff(WriteOffVM vm)
        {
            try
            {
                var id = db.WriteOff.Select(x => x.WriteOffId).Max();
                var newWO = new WriteOff
                {
                    WriteOffId = id + 1,
                    WriteOffDate = DateTime.Now,
                };

                db.WriteOff.Add(newWO);

                Product product = db.Product.Where(x => x.ProductId == vm.productId).FirstOrDefault();
                // var wid = db.WriteOffProduct.Select(x => x.WriteOffId).Max();
                var newPWO = new WriteOffProduct
                {
                    WriteOffId = 1,
                    WriteOffQuantity = vm.WOQuantity,
                    WriteOffReason = vm.WOReason,
                    ProductId = vm.productId,
                    BranchId = vm.branchId,
                    Product = product,
                    WriteOff = newWO,
                    WriteOffDate = newWO.WriteOffDate,

                };
                db.WriteOffProduct.Add(newPWO);

                var pToUpdate = db.BranchProduct.Where(x => x.ProductId == vm.productId).FirstOrDefault();
                pToUpdate.QuantityOnHand = pToUpdate.QuantityOnHand - newPWO.WriteOffQuantity;

                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // -------------AUDIT----------------------------------------------------------
        [HttpGet]
        [Route("GetAllAudits")]
        public List<Audit> GetAllAudits()
        {
            List<Audit> list = new List<Audit>();
            list = db.Audit.ToList();
            return list;

        }
    }
}
