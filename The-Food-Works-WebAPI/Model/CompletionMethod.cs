using System;
using System.Collections.Generic;

#nullable disable

namespace The_Food_Works_WebAPI.Model
{
    public partial class CompletionMethod
    {
        public CompletionMethod()
        {
            Sales = new HashSet<Sale>();
        }

        public int CompletionMethodId { get; set; }
        public string CompletionMethodDescription { get; set; }

        public virtual ICollection<Sale> Sales { get; set; }
    }
}
