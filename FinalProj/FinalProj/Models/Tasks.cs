using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinalProj.Models
{
    // Model class representing a task
    public class Tasks
    {
        // Unique identifier for the task
        public int Id { get; set; }

        public string Title { get; set; }

        public string AssignedUser { get; set; }

        public string Content { get; set; }

        public string Email { get; set; }

        public int IsActive { get; set; }

        public string CreatedOn { get; set; }

        public DateTime DueDate { get; set; }  // Add DueDate property

        public string Priority { get; set; }   // Add Priority property

        public int IsCompleted { get; set; }

        public int CompleteRequest { get; set; }

    }
}
