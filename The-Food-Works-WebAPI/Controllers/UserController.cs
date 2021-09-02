using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using static The_Food_Works_WebAPI.ViewModels.Data;
using System.Dynamic;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using The_Food_Works_WebAPI.services;
using Microsoft.AspNetCore.Cors;
using static The_Food_Works_WebAPI.ViewModels.GlobalVariables;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    //  @CrossOrigin(origins = "http://localhost:4200");
    public class UserController : DeliveryController
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();
        
        [HttpPost]
        [Route("Login")]
        // [ServiceFilter(typeof(AuditFilterAttribute))]
        public ActionResult Login(AuthVM vm)
        {
            string hashedPassword = Security.ComputeSha256Hash(vm.Password);
            UserInfoVM uVM = new UserInfoVM();

            var user = db.User
                .Include(u => u.UserRole)
                .Where(zz => zz.UserUsername.ToUpper() == vm.EmailAddress.ToUpper() && zz.UserPassword == hashedPassword)
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }
            string token = "";
            //add the Employee role so that you can decorate actions with either "Employee" permission or "Cashier"
            if (user.EmployeeId != null)
            {
                token = MySecurityToken.GenerateToken(user.UserId, new string[] { "Employee", user.UserRole.UserRoleName });
                Employee employee = db.Employee.Where(x => x.EmployeeId == user.EmployeeId).FirstOrDefault();
                uVM.BranchId = employee.BranchId;
                uVM.EmployeeId = user.EmployeeId;
                uVM.DisplayName = String.Format("{0} {1}", employee.EmployeeName, employee.EmployeeSurname);
                uVM.EmailAddress = user.UserUsername;
                uVM.Roles = user.UserRole.UserRoleDescription.Split(",");
            }
            else if(user.CustomerId != null)
            {
                token = MySecurityToken.GenerateToken(user.UserId, new string[] { "Customer", user.UserRole.UserRoleName });
                Customer customer = db.Customer.Where(x => x.CustomerId == user.CustomerId).FirstOrDefault();
                uVM.CustomerId = customer.CustomerId;
                uVM.DisplayName = String.Format("{0} {1}", customer.CustomerName, customer.CustomerSurname);
                uVM.EmailAddress = user.UserUsername;
            }
            HttpContext.Response.Cookies.Append("access_token", token, new CookieOptions { Secure = false, HttpOnly = false });
            HttpContext.Response.Cookies.Append("test1", token, new CookieOptions { Secure = false, HttpOnly = true });
            HttpContext.Response.Cookies.Append("test2", token, new CookieOptions { Domain = "localhost" });
            MyGlobalVariable = uVM;
            return Ok(uVM);
        }
    

        [HttpGet]
        [Route("LogOut")]
        // [ServiceFilter(typeof(AuditFilterAttribute))]
        public IActionResult LogOut()
        {
            HttpContext.Response.Cookies.Append("access_token", "", new CookieOptions { HttpOnly = true });
            return Ok();
        }

        // Helper functions
        //private bool UserExists(string EmailAddress)
        //{
        //    //var user = db.User.Where(zz => zz.UserUsername == EmailAddress).FirstOrDefault();

        //    //return user != null;
        //}
        [HttpPost]
        [HttpGet]
        [Route("fakeToken")]
        public IActionResult fakeToken()
        {
            string token = MySecurityToken.GenerateToken(1, new string[] { "Customer" });
            HttpContext.Response.Cookies.Append("access_token", token, new CookieOptions { HttpOnly = true });
            return Ok(token);
        }

        //[services.ClaimRequirement("Permission", "Customer")]
        [services.ClaimRequirement("Permission", "Cashier")]
        [HttpGet]
        [Route("test")]
        public IActionResult test()
        {
            return Ok();
        }

        [services.ClaimRequirement("Permission", "Employee")]
        [HttpGet]
        [Route("test2")]
        public IActionResult test2()
        {
            return Ok();
        }

        //OTP Generator
        public int GenerateRandomNo()
        {
            int _min = 1000;
            int _max = 9999;
            Random _rdm = new Random();
            return _rdm.Next(_min, _max);
        }

        [HttpGet]
        // [ServiceFilter(typeof(AuditFilterAttribute))]
        [Route("VerifyEmail")]
        public ActionResult VerifyEmail(String key)
        {
            var user = db.User.Where(z => z.UserPassword == key).FirstOrDefault();
            if (user != null)
            { //set user.EmailVerified=true;
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        // FORGOT PASSWORD EMAIL
        [HttpPost]
        // [ValidateAntiForgeryToken]
        // [ServiceFilter(typeof(AuditFilterAttribute))]
        [Route("ForgotPassword")]
        public ActionResult ForgotPassword(ForgotPasswordVM Email)
        {
            String email = Email.Email;
            var getUser = db.User.Include(c => c.Customer).Include(c => c.Employee).Where(z => z.UserUsername == email).FirstOrDefault();
            if (getUser != null)
            {
                getUser.OneTimePin = GenerateRandomNo();
                db.SaveChanges();
                String firstName;
                if (getUser.CustomerId != null)
                {
                    firstName = getUser.Customer.CustomerName;
                }
                else if (getUser.EmployeeId != null)
                {
                    firstName = getUser.Employee.EmployeeName;
                }
                else
                {
                    firstName = "user";
                }
                var subject = "Password Reset Request";
                var body = "Hi " + firstName + ", <br/> You recently requested to reset your password for your account. " +
                     " <br/><br/> Enter your unique One-Time-Pin to reset your password: <br/><br/>" + getUser.OneTimePin +

                     "<br/><br/>If you did not request a password reset, please ignore this email or reply to let us know.<br/><br/> Thank you";

                //body = "test";
                new EmailSender().SendEmailAsync(email, subject, body);
                return Ok("An email has been sent containing your unique One-Time-Pin. Please check your inbox.");
            }
            return NotFound("User not found. ");
        }

        // CHECK FORGOT PASSWORD OTP
        [HttpPost]
        [Route("CheckOTP")]
        public ActionResult CheckOTP(OTPvm user)
        {
            var getUser = db.User.Include(c => c.Customer).Include(c => c.Employee).Where(z => z.UserUsername == user.email).FirstOrDefault();
            // check if the email exists and if the OTP matches
            if (getUser != null && getUser.OneTimePin == user.OTP)
            {
                return Ok("OTP is valid");
            }
            else
            {
                return BadRequest("Invalid OTP");
            }
        }

        // RESET USER PASSWORD
        [HttpPost]
        [Route("ResetPassword")]
        public ActionResult ResetPassword(ResetPasswordVM vm)
        {
            var getUser = db.User.Include(c => c.Customer).Include(c => c.Employee).Where(z => z.UserUsername == vm.email).FirstOrDefault();
            string hashedPassword = Security.ComputeSha256Hash(vm.NewPassword);
            string currentPassword = Security.ComputeSha256Hash(vm.CurrentPassword);
            if (getUser != null && currentPassword == getUser.UserPassword)
            {
                getUser.UserPassword = hashedPassword;
                
                db.SaveChanges();

                return Ok();
            }
            else
            {
                return BadRequest("Incorrect Credentials");
            }
        }

        // Helper functions
        private bool UserExists(string EmailAddress)
        {
            var user = db.User.Where(zz => zz.UserUsername == EmailAddress).FirstOrDefault();

            return user != null;
        }

        public string ComputeSha256Hash(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        // to logout invalidate the token. 

        //RESET PASSWORD
        //    [HttpPost]
        //    public ActionResult ForgotPassword(string Email)
        //    {
        //        string resetCode = Guid.NewGuid().ToString();
        //        var verifyUrl = "/Account/ResetPassword/" + resetCode;
        //        var link = Request.Url.AbsoluteUri.Replace(Request.Url.PathAndQuery, verifyUrl);

        //        var getUser = db.User.Where(z => z.UserUsername == Email).FirstOrDefault();
        //        if (getUser != null)
        //        {
        //            getUser.ResetPasswordCode = resetCode;

        //            This line I have added here to avoid confirm password not match issue , as we had added a confirm password property

        //                db.Configuration.ValidateOnSaveEnabled = false;
        //            db.SaveChanges();

        //            var subject = "Password Reset Request";
        //            var body = "Hi " + getUser.FirstName + ", <br/> You recently requested to reset your password for your account. Click the link below to reset it. " +

        //                 " <br/><br/><a href='" + link + "'>" + link + "</a> <br/><br/>" +
        //                 "If you did not request a password reset, please ignore this email or reply to let us know.<br/><br/> Thank you";

        //            SendEmail(getUser.Email, body, subject);

        //            ViewBag.Message = "Reset password link has been sent to your email id.";
        //        }
        //        else
        //        {
        //            ViewBag.Message = "User doesn't exists.";
        //            return View();
        //        }
        //    }

        //}
    }
}