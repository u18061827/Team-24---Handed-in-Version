using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class UserStatus
    {
        public UserStatus()
        {
            Users = new HashSet<User>();
        }

        public int UserStatusId { get; set; }
        public string UserDescription { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
