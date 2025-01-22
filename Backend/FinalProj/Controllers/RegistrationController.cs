using FinalProj.Models;
using FinalProj.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using BCrypt.Net; // Import BCrypt.Net for password hashing
using System.Data;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Identity.Data;



namespace FinalProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService; // Inject EmailService

        // Constructor to initialize IConfiguration and EmailService
        public RegistrationController(IConfiguration configuration, EmailService emailService)
        {
            _configuration = configuration;
            _emailService = emailService;
        }



        [HttpPost]
        [Route("ForgotPassword")]
        public Response ForgotPassword(Registration registration)
        {
            // Create a new Response object to hold the response status
            Response response = new Response();
            // Create a new SqlConnection using the connection string retrieved from IConfiguration
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon"));
            // Create a new instance of the Dal class for database operations
            Dal dal = new Dal();

            // Check if the email is provided
            if (string.IsNullOrEmpty(registration.Email))
            {
                response.StatusCode = 100;
                response.StatusMessage = "Email cannot be null or empty";
                return response;
            }

            // Generate a temporary password
            string temporaryPassword = GenerateTemporaryPassword();

            // Update the user's password in the database
            response = dal.UpdatePassword(registration.Email, temporaryPassword, connection);

            // If password updated successfully, send password reset email
            if (response.StatusCode == 200)
            {
                _emailService.SendEmail(registration.Email, "Password Reset Your Temporary Password: " + temporaryPassword, "");
                response.StatusMessage = "Password reset email sent";
            }

            return response;
        }

        // Method to generate a temporary password
        private string GenerateTemporaryPassword()
        {
            // Define a string containing all allowed characters for the temporary password
            string allowedChars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*(),.?\":{}|<>";
            // Create a new instance of the Random class to generate random numbers
            Random randNum = new Random();
            // Create a character array to store the temporary password
            char[] chars = new char[10];
            // Get the length of the allowed characters string
            int allowedCharCount = allowedChars.Length;

            // Loop through each character position in the temporary password
            for (int i = 0; i < 10; i++)
            {
                // Generate a random index within the allowed characters range
                chars[i] = allowedChars[(int)((allowedChars.Length) * randNum.NextDouble())];
            }
            // Convert the character array to a string and return the temporary password
            return new string(chars);
        }





        [HttpPost] // Attribute specifying that this method handles HTTP POST requests
        [Route("Login")] // Attribute specifying the route at which this method can be accessed
        public Response Login(Registration registration)
        // Method signature taking a Registration object as parameter and returning a Response object
        {
            Response response = new Response();
            // Create a new SqlConnection using the connection string named "SNCon" from the configuration
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon"));
            Dal dal = new Dal();
            // Call the Login method of the Dal object to attempt login with the provided registration details
            response = dal.Login(registration, connection);
            // Return the response indicating the outcome of the login attempt
            return response;
        }



        
        [HttpPost]
        [Route("Registration")]
        public Response Registration(Registration registration)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon"));
            Dal dal = new Dal();

            if (string.IsNullOrEmpty(registration.Email))
            {
                response.StatusCode = 100;
                response.StatusMessage = "Email cannot be null or empty";
                return response;
            }

            response = dal.Registration(registration, connection);

            // If registration is successful, send registration email
            if (response.StatusCode == 200)
            {
                _emailService.SendEmail(registration.Email, "Registration Successful, Please Wait for the Admin to Verify", "Thank you for registering! Your admin will send you an email when your registration has been approved, when it has, you'll be able to login. Piece of cake!");
            }

            return response;
        }
        


        [HttpPost]
        [Route("UserApproval")]
        public Response UserApproval(Registration registration)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon"));
            Dal dal = new Dal();

            // Update user approval status in the database
            response = dal.UserApproval(registration, connection);

            // If user approval is successful, send approval email
            if (response.StatusCode == 200)
            {
                // Retrieve user's email
                Registration approvedUser = dal.GetRegistrationById(registration.Id, connection);

                // Send email notification
                _emailService.SendEmail(approvedUser.Email, "Good News, You've Been Verified You can now Login", "Your registration has been approved. You can now login to the system.");
            }

            return response;
        }



        [HttpPost]
        [Route("RegistrationList")]
        public Response RegistrationList(Registration registration)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon"));
            Dal dal = new Dal();
            response = dal.RegistrationList(registration, connection);
            return response;
        }

        [HttpDelete]
        [Route("DeleteRegistration/{id}")]
        public Response DeleteRegistration(int id)
        {
            Response response = new Response();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("SNCon"));
            Dal dal = new Dal();
            response = dal.DeleteRegistration(new Registration { Id = id }, connection);
            return response;
        }


    }
}



