using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Employee
    {
        public Employee()
        {
            Batches = new HashSet<Batch>();
            Deliveries = new HashSet<Delivery>();
            EmployeeTrainingModules = new HashSet<EmployeeTrainingModule>();
            Sales = new HashSet<Sale>();
            Users = new HashSet<User>();
        }

        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeSurname { get; set; }
        public string EmployeeIdNumber { get; set; }
        public string EmployeeTelephone { get; set; }
        public string EmployeeEmail { get; set; }
        public int BranchId { get; set; }

        public virtual Branch Branch { get; set; }
        public virtual ICollection<Batch> Batches { get; set; }
        public virtual ICollection<Delivery> Deliveries { get; set; }
        public virtual ICollection<EmployeeTrainingModule> EmployeeTrainingModules { get; set; }
        public virtual ICollection<Sale> Sales { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}
