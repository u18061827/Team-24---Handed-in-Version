using System;
using System.Collections.Generic;

namespace The_Food_Works_WebAPI.Models
{
    public partial class UserPasswordHistory
    {
        public int UserPasswordHistoryId { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }

        public virtual User User { get; set; }
    }
}
