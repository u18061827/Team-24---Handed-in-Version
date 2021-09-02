using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class CookingList
    {
        public CookingList()
        {
            Batches = new HashSet<Batch>();
        }

        public int CookingListId { get; set; }
        public DateTime CookingListDate { get; set; }

        public virtual ICollection<Batch> Batches { get; set; }
    }
}
