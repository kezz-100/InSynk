using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinalProj.Models
{
    // Model class representing a response from the server
    public class Response
    {
        // HTTP status code indicating the result of the operation
        public int StatusCode { get; set; }
        // Message describing the status of the operation
        public string StatusMessage { get; set; }
        public List<Registration> listRegistration { get; set; }
        public Registration Registration { get; set; }
        public List<Tasks> listTasks { get; set; }
        public Tasks Tasks { get; set; } //delete
        public Tasks EditedTasks { get; set; } //edited tasks
        public string Data { get; set; } // Add the Data property to store additional information


    }
}


