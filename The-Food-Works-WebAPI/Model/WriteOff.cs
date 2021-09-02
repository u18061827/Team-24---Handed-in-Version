using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class WriteOff
    {
        public WriteOff()
        {
            WriteOffProducts = new HashSet<WriteOffProduct>();
        }

        public int WriteOffId { get; set; }
        public DateTime WriteOffDate { get; set; }

        public virtual ICollection<WriteOffProduct> WriteOffProducts { get; set; }
    }
}
