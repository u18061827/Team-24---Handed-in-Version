﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Models
{
    public partial class UserStatus
    {
        public UserStatus()
        {
            User = new HashSet<User>();
        }

        public int UserStatusId { get; set; }
        public string UserDescription { get; set; }

        public virtual ICollection<User> User { get; set; }
    }
}