using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;
using static The_Food_Works_WebAPI.ViewModels.Data;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReportController : Controller
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        //----------------------STOCK REPORT---------------------------
        // RECEIVE SELECTED BRANCH ID
        // [services.ClaimRequirement("Permission", "Admin")]
        // [services.ClaimRequirement("Permission", "Employee")]
        [HttpPost]
        // [ServiceFilter(typeof(AuditFilterAttribute))]
        [Route("ReportBranchProductStock")]
        public string ReportBranchProductStock(ReportVM vm)
        {
            int branchId = vm.BranchId;
            DataTable dt = ExecSP("ReportBranchProductStock",
                new SqlParameter[] {
                    new SqlParameter("@branchId", branchId)
                });
            string JSONString = DataTableToJson(dt);
            return JSONString;
        }
        // [services.ClaimRequirement("Permission", "Admin")]
        [HttpPost]
        [Route("ReportBranchProductIngredients")]
        public string ReportBranchProductIngredients(ReportVM vm)
        {
            int branchId = vm.BranchId;
            DataTable dt = ExecSP("ReportBranchProductIngredients",
                new SqlParameter[] {
                    new SqlParameter("@branchId", branchId)
                });
            string JSONString = DataTableToJson(dt);
            return JSONString;
        }

        //----------------GENERATE SALES REPORT --------------------
        [HttpPost]
        //[services.ClaimRequirement("Permission", "Admin")]
        //[Authorize(AuthenticationSchemes = "JwtBearer")]
        [Route("ReportDailySales")]
        public string ReportDailySales( ReportVM sm)
        {
            int branchId = sm.BranchId ;
            int year = sm.endDate.Year;

            DataTable dt = ExecSP("ReportDailySales",
                new SqlParameter[] {
                    new SqlParameter("@branchId", branchId),
                    new SqlParameter("@year", year)
                });
            string JSONString = DataTableToJson(dt);
            return JSONString;
        }
       // [services.ClaimRequirement("Permission", "Admin")]
        [HttpPost]
        [Route("ReportAccumulatedSales")]
        public string ReportAccumulatedSales(ReportVM vm)
        {
            
            int branchId = vm.BranchId;
            DataTable dt = ExecSP("ReportAccumulatedSales",
                new SqlParameter[] {
                    new SqlParameter("@branchId", branchId)
                });
            string JSONString = DataTableToJson(dt);
            return JSONString;
        }

        //--------------------------
        [HttpPost]
        [Route("ReportProductTrends")]
        public string ReportProductTrends(ProductReportVM vm)
        {
            int branchId = vm.BranchId;
            DateTime fromDate = vm.startDate.Date;
            DateTime toDate = vm.endDate.Date;
            DataTable dt = ExecSP("ReportProductTrends",
                new SqlParameter[] {
                    new SqlParameter("@branchId", branchId),
                    new SqlParameter("@fromDate", fromDate),
                    new SqlParameter("@toDate", toDate)
                });
            string JSONString = DataTableToJson(dt);
            return JSONString;
        }

        //https://localhost:44325/report/BranchRequests?branchid=1&fromDate=1%20Jan%202020&toDate=1%20Jan%202050
        [HttpPost]
        [Route("BranchRequests")]
        public IActionResult BranchRequests(ProductReportVM vm)
        {
            int branchId = vm.BranchId;
            DateTime fromDate = vm.startDate.Date;
            DateTime toDate = vm.endDate.Date;
            var brancheRequestsData = new List<dynamic>();

            var brancheRequests = db.BranchRequest

                .Where(o => (o.BranchId == branchId) && (o.BranchRequestDate >= fromDate) && (o.BranchRequestDate <= toDate))
                .Select(br => new { br.BranchRequestId, br.BranchRequestDate, br.RequestStatus })
                .ToList()
                ;
            foreach (var br in brancheRequests)
            {
                dynamic dynamicBranchRequest = new ExpandoObject();
                dynamicBranchRequest.RequestId = br.BranchRequestId;
                dynamicBranchRequest.Date = br.BranchRequestDate;
                dynamicBranchRequest.Status = br.RequestStatus;

                List<BranchRequestLine> requestLines = db.BranchRequestLine
                    .Where(brl => brl.BranchRequestId == br.BranchRequestId)
                    .Include(p => p.Product)
                    .ToList();

                dynamicBranchRequest.RequestLines = new List<dynamic>();
                foreach (BranchRequestLine brl in requestLines)
                {
                    dynamic dynamicRequestLine = new ExpandoObject();
                    dynamicRequestLine.ProductId = brl.ProductId;
                    dynamicRequestLine.ProductName = brl.Product.ProductName;
                    dynamicRequestLine.Quantity = brl.RequestedQuantity;
                    dynamicBranchRequest.RequestLines.Add(dynamicRequestLine);
                }
                brancheRequestsData.Add(dynamicBranchRequest);
            }

            return Ok(brancheRequestsData);
        }

        private DataTable ExecSP(string procName, SqlParameter[] parameters)
        {
            SqlConnection con = (SqlConnection)db.Database.GetDbConnection();
            SqlCommand com = new SqlCommand(procName, con);
            com.CommandType = CommandType.StoredProcedure;
            foreach (SqlParameter p in parameters)
            {
                com.Parameters.Add(p);
            }
            SqlDataAdapter da = new SqlDataAdapter(com);
            DataTable dt = new DataTable();

            con.Open();
            da.Fill(dt);
            con.Close();
            return dt;
        }

        private static string DataTableToJson(DataTable dt)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row;
            foreach (DataRow dr in dt.Rows)
            {
                row = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    row.Add(col.ColumnName, dr[col]);
                }
                rows.Add(row);
            }
            return JsonConvert.SerializeObject(rows);
        }

        // Get Product Categories
        [HttpGet]
        [Route("GetBranches")]
        public List<dynamic> getBranches()
        {
            using var db = new TheFoodWorksContext();
            var branches = db.Branch.Take(5).ToList();
        return getDynamicBranches(branches);
        }

        public List<dynamic> getDynamicBranches(List<Branch> branches)
        {
            var dynamicBranches = new List<dynamic>();

            foreach (var branch in branches)
            {
                dynamic dynamicBranch = new ExpandoObject();
                dynamicBranch.BranchId = branch.BranchId;
                dynamicBranch.BranchName = branch.BranchName;
                dynamicBranches.Add(dynamicBranch);
            }

            return dynamicBranches;
        }
    }
}