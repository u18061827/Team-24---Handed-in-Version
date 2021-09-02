using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class DocumentType
    {
        public DocumentType()
        {
            EmployeeDocument = new HashSet<EmployeeDocument>();
        }

        public int DocumentTypeId { get; set; }
        public string DocumentTypeDescription { get; set; }

        public virtual ICollection<EmployeeDocument> EmployeeDocument { get; set; }
    }
}
