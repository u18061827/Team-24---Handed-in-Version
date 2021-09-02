using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class EmployeeDocument
    {
        public int EmployeeDocumentId { get; set; }
        public byte[] DocumentPdf { get; set; }
        public DateTime DocumentDateCaptured { get; set; }
        public int EmployeeId { get; set; }
        public int DocumentTypeId { get; set; }

        public virtual DocumentType DocumentType { get; set; }
        public virtual Employee Employee { get; set; }
    }
}
