using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.ViewModels;
using static The_Food_Works_WebAPI.ViewModels.TrainingVM;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrainingController : Controller
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpGet]
        [Route("getAllTypes")]
        public List<dynamic> getAllTypes()
        {
            var types = db.TrainingModuleType.ToList();
            return getDynamicTypes(types);
        }
        public List<dynamic> getDynamicTypes(List<TrainingModuleType> types)
        {
            var dynamicUserRoles = new List<dynamic>();

            foreach (var userRole in types)
            {
                dynamic dynamicUserRole = new ExpandoObject();
                dynamicUserRole.ID = userRole.TrainingModuleTypeId;
                dynamicUserRole.Description = userRole.TrainingModuleTypeDescription;
                dynamicUserRoles.Add(dynamicUserRole);
            }

            return dynamicUserRoles;
        }

        [HttpPost]
        [Route("getTypeDetails")]
        public TrainingVM getTypeDetails(TrainingVM vm)
        {
            var role = db.TrainingModuleType.Where(x => x.TrainingModuleTypeId == vm.ID).FirstOrDefault();
            TrainingVM newType = new TrainingVM();
            newType.ID = role.TrainingModuleTypeId;
            newType.Description = role.TrainingModuleTypeDescription;
            return newType;
        }

        [HttpPost]
        [Route("updateType")]
        public ActionResult updateType(TrainingVM vm)
        {
            try
            {

                var typeToUpdate = db.TrainingModuleType.Where(x => x.TrainingModuleTypeId == vm.ID).FirstOrDefault();
                typeToUpdate.TrainingModuleTypeDescription = vm.Description;

                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("addType")]
        public ActionResult addType(TrainingVM type)
        {
            try
            {
                var id = db.TrainingModuleType.Select(x => x.TrainingModuleTypeId).Max();
                var newType = new TrainingModuleType
                {
                    TrainingModuleTypeId = id + 1,
                    TrainingModuleTypeDescription = type.Description
                };

                db.TrainingModuleType.Add(newType);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("deleteType")]
        public ActionResult deleteType(TrainingVM type)
        {
            try
            {
                var typeToUpdate = db.TrainingModuleType.Where(x => x.TrainingModuleTypeId == type.ID).FirstOrDefault();

                db.TrainingModuleType.Remove(typeToUpdate);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // Create New Training Module
        [HttpPost]
        [Route("CreateTrainingModule")]
        public ActionResult CreateTrainingModule([FromBody] TrainingModuleVM newModule)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                using (var transSql = db.Database.BeginTransaction())
                {
                    var module = new TrainingModule
                    {
                        ModuleName = newModule.moduleName,
                        TrainingModuleTypeId = newModule.moduleType,
                        ModuleLanguage = newModule.moduleLanguage,
                        ModuleDuration = newModule.moduleDuration,
                        ModuleDescription = newModule.moduleDescription,
                        ModuleContentVideo = newModule.videoLink,
                        ModuleContentText = newModule.textContent,
                        ModuleContentImage = newModule.imageContent,
                        ContentOrder = newModule.contentOrder,
                    };
                    db.TrainingModule.Add(module);
                    db.SaveChanges();
                    transSql.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        // Get list of ALL Training Modules (For a specific employee)
        [HttpGet]
        [Route("GetTrainingModuleList/{employeeId}")]
        public List<dynamic> GetTrainingModuleList([FromRoute] int employeeId)
        {
            var modules = db.TrainingModule.Include(x => x.TrainingModuleType).Include(y => y.EmployeeTrainingModules.Where(z => z.EmployeeId == employeeId)).ToList();

            return GetDynamicModuleList(modules);
        }
        public List<dynamic> GetDynamicModuleList(List<TrainingModule> modules)
        {
            var dynamicTrainingModules = new List<dynamic>();

            foreach (var item in modules)
            {
                dynamic dynamicModules = new ExpandoObject();
                dynamicModules.TrainingModuleId = item.TrainingModuleId;
                dynamicModules.ModuleName = item.ModuleName;
                if(item.EmployeeTrainingModules.Select(x => x.EmployeeTrainingModuleStatus).FirstOrDefault() == true)
                {
                    dynamicModules.TrainingModuleCompleted = true;
                }
                else
                {
                    dynamicModules.TrainingModuleCompleted = false;
                }
                dynamicTrainingModules.Add(dynamicModules);

            }

            return dynamicTrainingModules;
        }

        // Get specific training module (using ID)
        [HttpGet]
        [Route("GetTrainingModule/{moduleId}/{employeeId}")]
        public List<dynamic> GetTrainingModule([FromRoute] int moduleId, [FromRoute] int employeeId)
        {
            var module = db.TrainingModule.Include(x => x.TrainingModuleType).Include(y => y.EmployeeTrainingModules.Where(z => z.EmployeeId == employeeId)).Where(x => x.TrainingModuleId == moduleId).ToList();
            return GetDynamicTrainingModule(module);
        }
        public List<dynamic> GetDynamicTrainingModule(List<TrainingModule> module)
        {
            var dynamicTrainingModule = new List<dynamic>();
            foreach (var item in module)
            {
                dynamic dynamicModule = new ExpandoObject();
                dynamicModule.TrainingModuleId = item.TrainingModuleId;
                dynamicModule.ModuleName = item.ModuleName;
                dynamicModule.ModuleDescription = item.ModuleDescription;
                dynamicModule.ModuleLanguage = item.ModuleLanguage;
                dynamicModule.ModuleContentText = item.ModuleContentText;
                dynamicModule.ModuleContentVideo = item.ModuleContentVideo;
                dynamicModule.ModuleContentImage = item.ModuleContentImage;
                dynamicModule.ModuleDuration = item.ModuleDuration;
                dynamicModule.ModuleType = item.TrainingModuleType.TrainingModuleTypeDescription;
                dynamicModule.ContentOrder = item.ContentOrder;
                if (item.EmployeeTrainingModules.Select(x => x.EmployeeTrainingModuleStatus).FirstOrDefault() == true)
                {
                    dynamicModule.TrainingModuleCompleted = true;
                    dynamicModule.DateCompleted = item.EmployeeTrainingModules.Select(x => x.DateCompleted).FirstOrDefault();
                    dynamicModule.TimeElapsed = item.EmployeeTrainingModules.Select(x => x.TimeElapsed).FirstOrDefault();
                }
                else
                {
                    dynamicModule.TrainingModuleCompleted = false;
                }
                dynamicTrainingModule.Add(dynamicModule);
            }
            return dynamicTrainingModule;
        }
    }
}
