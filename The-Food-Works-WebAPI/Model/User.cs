﻿using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class User
    {
        public int UserId { get; set; }
        public string UserUsername { get; set; }
        public string UserPassword { get; set; }
        public int? OneTimePin { get; set; }
        public int? UserRoleId { get; set; }
        public int? UserStatusId { get; set; }
        public int? CustomerId { get; set; }
        public int? EmployeeId { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual Employee Employee { get; set; }
        public virtual UserRole UserRole { get; set; }
        public virtual UserStatus UserStatus { get; set; }
    }
}
