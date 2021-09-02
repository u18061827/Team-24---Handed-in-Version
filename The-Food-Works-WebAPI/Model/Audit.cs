using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class Audit
    {
        public int Id { get; set; }
        public DateTime? TimeStamp { get; set; }
        public int? UserId { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
        public string QueryString { get; set; }
        public string RequestBody { get; set; }
    }
}
