using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinalProj.Models
{
    // Model class representing user registration information
    public class Registration
    {
        // Unique identifier for the user
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNo { get; set; }
        public int IsActive { get; set; }
        public int IsApproved { get; set; }
        public string UserType { get; set; }
    }
}

