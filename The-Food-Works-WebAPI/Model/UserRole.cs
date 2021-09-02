using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class UserRole
    {
        public UserRole()
        {
            Users = new HashSet<User>();
        }

        public int UserRoleId { get; set; }
        public string UserRoleName { get; set; }
        public string UserRoleDescription { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
