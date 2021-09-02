﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;

namespace The_Food_Works_WebAPI.services
{
    public class AuditFilterAttribute : ActionFilterAttribute
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();
        public AuditFilterAttribute(TheFoodWorksContext _dbContext)
        {
            db = _dbContext;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext filterContext, ActionExecutionDelegate next)
        {

            try
            {
                var objaudit = new Audit();
                string token = filterContext.HttpContext.Request.Cookies["access_token"];
                if (String.IsNullOrEmpty(token))
                {
                    objaudit.UserId = -1;// user not logged in
                }
                else
                {
                    string userId = MySecurityToken.GetClaim(token, "nameid");
                    objaudit.UserId = Convert.ToInt32(userId);
                }
                objaudit.TimeStamp = DateTime.Now;
                objaudit.Controller = ((ControllerBase)filterContext.Controller)
                    .ControllerContext.ActionDescriptor.ControllerName;
                objaudit.Action = ((ControllerBase)filterContext.Controller)
                    .ControllerContext.ActionDescriptor.ActionName;
                HttpRequest req = filterContext.HttpContext.Request;

                objaudit.QueryString = req.QueryString.ToString();

                req.EnableBuffering();
                string bodyStr;
                using (StreamReader reader
                          = new StreamReader(req.Body, Encoding.UTF8, true, 1024, true))
                {
                    bodyStr = await reader.ReadToEndAsync();
                }
                // Rewind, so the core is not lost when it looks the body for the request
                req.Body.Position = 0;

                objaudit.RequestBody = bodyStr;
                db.Audit.Add(objaudit);
                //                await db.SaveChangesAsync();
                db.SaveChanges();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }//whilst exception hiding is bad practice, we don't want to audit logger to break the system 
            finally
            {
                await base.OnActionExecutionAsync(filterContext, next);
            }
        }
    }
}