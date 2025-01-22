using FinalProj.Models;
using FinalProj.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FinalProj.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;



namespace FinalProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService; // Inject EmailService

        public TasksController(IConfiguration configuration, EmailService emailService)
        {
            // Constructor to initialize the TasksController with IConfiguration and EmailService dependencies
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost]
        [Route("AddTasks")]
        public Response AddTasks(Tasks tasks)
        {
            Response response = new Response();
            // Create a new SqlConnection using the connection string retrieved from IConfiguration
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon").ToString());
            // Create a new instance of the Dal class for database operations
            Dal dal = new Dal();

            // Parse AssignedUser to integer
            if (!int.TryParse(tasks.AssignedUser, out int assignedUserId))
            {
                // Handle parsing error return a response with an error message
                response.StatusCode = 400; // Bad request
                response.StatusMessage = "AssignedUser must be a valid integer.";
                return response;
            }

            // Add task and get the response from the data access layer (Dal)
            response = dal.AddTasks(tasks, assignedUserId, connection);

            // If task creation is successful, send notification email
            if (response.StatusCode == 200)
            {
                // Retrieve assigned user's email from the database using the Dal
                string userEmail = dal.GetUserEmailById(assignedUserId, connection);

                // Send email notification using the injected EmailService
                _emailService.SendEmail(userEmail, "New Task Assigned, Check Your DashBoard for Details", "A new task has been assigned to you. Please check your dashboard for details.");
            }

            return response;
        }



        [HttpGet]
        [Route("TasksList")]
        public Response TasksList()
        {
            // Create a new Response object to hold the response status
            Response response = new Response();
            // Create a new SqlConnection using the connection string retrieved from IConfiguration
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon").ToString());
            // Create a new instance of the Dal class for database operations
            Dal dal = new Dal();
            // Retrieve the list of tasks from the database using the Dal
            response = dal.TasksList(connection);
            // Return the response object containing the list of tasks
            return response;
        }



        [HttpDelete]
        [Route("DeleteTasks/{id}")]
        public Response DeleteTasks(int id)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon").ToString());
            Dal dal = new Dal();

            // Call the DeleteTasks method and pass the tasks ID
            response = dal.DeleteTasks(new Tasks { Id = id }, connection);

            return response;
        }




        [HttpPut]
        [Route("EditTasks")]
        public Response EditTasks(Tasks tasks)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon").ToString());
            Dal dal = new Dal();
            response = dal.EditTasks(tasks, connection);
            return response;
        }


        //dont send email dont matter though
        [HttpPost]
        [Route("TasksApproval")]
        public Response TasksApproval(Tasks tasks)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon").ToString());
            Dal dal = new Dal();

            response = dal.TasksApproval(tasks, connection);



            // If task approval is successful, send notification email
            if (response.StatusCode == 200)
            {
                // Retrieve assigned user's email
                string userEmail = response.Data?.ToString(); // Retrieve the email from the response data

                // Send email notification
                if (!string.IsNullOrEmpty(userEmail))
                {
                    _emailService.SendEmail(userEmail, "Task Approved", "Your task has been approved. You can now proceed.");
                }
            }

            return response;
        }







        [HttpPost]
        [Route("UserComplete")]
        public Response UserComplete(Tasks tasks)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon").ToString());
            Dal dal = new Dal();
            response = dal.UserComplete(tasks, connection);
            return response;
        }



    }
}


