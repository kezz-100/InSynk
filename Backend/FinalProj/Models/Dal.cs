using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.IO;
using BCrypt.Net; // Import BCrypt.Net for password hashing



//communicating with database

namespace FinalProj.Models
{
    public class Dal
    {

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///Registration Methods
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





        // Method to retrieve user information for new password 
        public Response ForgotPassword(string email, SqlConnection connection)
        {
            Response response = new Response();

            // Check if email exists in the database
            string query = "SELECT * FROM Registration WHERE Email = @Email";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@Email", email);

            try
            {
                connection.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (!reader.HasRows)
                {
                    // If email not found, return appropriate response
                    response.StatusCode = 100;
                    response.StatusMessage = "Email address not found";
                    return response;
                }

                // Email exists, retrieve user details including plaintext password
                Registration user = new Registration();
                if (reader.Read())
                {
                    user.Id = Convert.ToInt32(reader["Id"]);
                    user.Name = reader["Name"].ToString();
                    user.Email = reader["Email"].ToString();
                    user.Password = reader["Password"].ToString(); // Retrieve plaintext password
                }

                reader.Close();

                // Set the user information in the response
                response.Data = user.Email; // Return email of the user
                response.StatusCode = 200;
                response.StatusMessage = "User found";
            }
            catch (Exception ex)
            {
                response.StatusCode = 100;
                response.StatusMessage = "Failed to find user: " + ex.Message;
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                }
            }

            return response;
        }

        // Method to update user password
        public Response UpdatePassword(string email, string newPassword, SqlConnection connection)
        {
            Response response = new Response();

            // Update the password in the database
            string query = "UPDATE Registration SET Password = @Password WHERE Email = @Email";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@Password", BCrypt.Net.BCrypt.HashPassword(newPassword)); // Hash the temporary password
            cmd.Parameters.AddWithValue("@Email", email);

            try
            {
                connection.Open();
                int rowsAffected = cmd.ExecuteNonQuery();
                connection.Close();

                if (rowsAffected > 0)
                {
                    // If password updated successfully, return success response
                    response.StatusCode = 200;
                    response.StatusMessage = "Password updated successfully";
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Failed to update password";
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions
                response.StatusCode = 100;
                response.StatusMessage = "Failed to update password: " + ex.Message;
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                }
            }

            return response;
        }




        // Method to register a new user
        public Response Registration(Registration registration, SqlConnection connection)
        {
            // Create a new Response object to hold the response status
            Response response = new Response();

            // Hash the user's password for security
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registration.Password);

            // Check if the email already exists in the database
            using (SqlCommand checkEmailCmd = new SqlCommand("SELECT COUNT(*) FROM Registration WHERE Email = @Email", connection))
            {
                // Add email parameter to the SQL query to prevent SQL injection
                checkEmailCmd.Parameters.AddWithValue("@Email", registration.Email);
                connection.Open();
                // Execute the SQL query and retrieve the count of email occurrences
                int emailCount = (int)checkEmailCmd.ExecuteScalar();
                connection.Close();

                if (emailCount > 0)
                {
                    // Email already exists, return error response
                    response.StatusCode = 100;
                    response.StatusMessage = "Email already exists";
                    return response;
                }
            }

            // Validate email domain format
            if (!IsEmailDomainValid(registration.Email))
            {
                // Email domain is not valid, return error response
                response.StatusCode = 100;
                response.StatusMessage = "Invalid email domain format";
                return response;
            }

            // Validate phone number format
            if (!IsPhoneNumberValid(registration.PhoneNo))
            {
                // Phone number is not valid, return error response
                response.StatusCode = 100;
                response.StatusMessage = "Invalid phone number format";
                return response;
            }

            // Proceed with registration if email and phone number are unique and valid
            using (SqlCommand cmd = new SqlCommand("INSERT INTO Registration(Name, Email, Password, PhoneNo, IsActive, IsApproved, UserType) VALUES(@Name, @Email, @Password, @PhoneNo, 1, 0, 'USER')", connection))
            {
                // Add parameters to the SQL query to insert registration data
                cmd.Parameters.AddWithValue("@Name", registration.Name);
                cmd.Parameters.AddWithValue("@Email", registration.Email);
                //cmd.Parameters.AddWithValue("@Password", registration.Password);
                cmd.Parameters.AddWithValue("@Password", hashedPassword); // Store hashed password
                cmd.Parameters.AddWithValue("@PhoneNo", registration.PhoneNo);

                connection.Open();
                // Execute the SQL query to insert registration data and retrieve the count of affected rows
                int i = cmd.ExecuteNonQuery();
                connection.Close();

                if (i > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Registration successful";
                    response.Data = registration.Email; // Return email of registered user
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Registration failed";
                }
            }

            return response;
        }

        // Method to validate email domain format
        private bool IsEmailDomainValid(string email)
        {
            // Array of valid email domains
            string[] validDomains = { "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "live.com", "aol.com", "icloud.com", "mail.com", "protonmail.com", "yandex.com", "zoho.com", "gmx.com" };
            // Split email address to extract domain
            string[] parts = email.Split('@');
            // Check if email format is valid and domain is in the list of valid domains
            if (parts.Length != 2)
            {
                return false; // Invalid format
            }
            string domain = parts[1].ToLower();
            return validDomains.Contains(domain);
        }

        // Method to validate phone number format
        private bool IsPhoneNumberValid(string phoneNumber)
        {
            // Check if phone number consists of 11 digits only
            return phoneNumber.Length == 11 && phoneNumber.All(char.IsDigit);
        }

        // Method to check if email exists asynchronously
        public async Task<Response> CheckEmailExists(string email, SqlConnection connection)
        {
            Response response = new Response();
            try
            {
                using (SqlCommand command = new SqlCommand("SELECT COUNT(*) FROM Registrations WHERE Email = @Email", connection))
                {
                    // Open the database connection
                    await connection.OpenAsync();
                    command.Parameters.AddWithValue("@Email", email);
                    int count = (int)await command.ExecuteScalarAsync();
                    connection.Close();

                    if (count > 0)
                    {
                        // Email exists
                        response.StatusCode = 200;
                        response.StatusMessage = "Email exists";
                    }
                    else
                    {
                        // Email does not exist
                        response.StatusCode = 200;
                        response.StatusMessage = "Email does not exist";
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error
                response.StatusCode = 500;
                response.StatusMessage = "Internal server error";
            }
            return response;
        }




        // Method to login
        public Response Login(Registration registration, SqlConnection connection)
        {
            Response response = new Response();

            // Open the connection before executing any commands
            connection.Open();

            // Variable to store the hashed password retrieved from the database
            string hashedPassword = "";

            // Retrieve the hashed password from the database using a SQL query
            using (SqlCommand cmd = new SqlCommand("SELECT Password FROM Registration WHERE Email = @Email", connection))
            {
                // Add email parameter to the SQL query to prevent SQL injection
                cmd.Parameters.AddWithValue("@Email", registration.Email);

                // Execute the SQL query and retrieve data using SqlDataReader
                SqlDataReader reader = cmd.ExecuteReader();

                // Check if any rows were returned by the SQL query
                if (reader.HasRows)
                {
                    // Loop through the rows to retrieve the hashed password
                    while (reader.Read())
                    {
                        hashedPassword = reader["Password"].ToString();
                    }
                }
                else
                {
                    // Handle case when user does not exist
                    response.StatusCode = 100;
                    response.StatusMessage = "User does not exist";
                    connection.Close(); // Close the connection
                    return response;
                }

                reader.Close();
            }

            // Verify the provided password with the hashed password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(registration.Password, hashedPassword);

            if (isPasswordValid)
            {
                // Password is valid, proceed with login
                // Retrieve user details from the database
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Registration WHERE Email = @Email", connection))
                {
                    cmd.Parameters.AddWithValue("@Email", registration.Email);

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    if (dt.Rows.Count > 0)
                    {
                        // Create a new Registration object to store user details
                        Registration reg = new Registration();
                        reg.Id = Convert.ToInt32(dt.Rows[0]["Id"]);
                        reg.Name = Convert.ToString(dt.Rows[0]["Name"]);
                        reg.Email = Convert.ToString(dt.Rows[0]["Email"]);
                        reg.UserType = Convert.ToString(dt.Rows[0]["UserType"]);

                        // Check if the user is approved
                        if (Convert.ToString(dt.Rows[0]["UserType"]) == "USER" && Convert.ToString(dt.Rows[0]["IsApproved"]) == "0")
                        {
                            response.StatusCode = 100;
                            response.StatusMessage = "Registration is pending for approval.";
                        }
                        else
                        {
                            response.StatusCode = 200;
                            response.StatusMessage = "Login successful";
                            response.Registration = reg;
                        }
                    }
                    else
                    {
                        response.StatusCode = 100;
                        response.StatusMessage = "User details not found";
                    }
                }
            }
            else
            {
                // Password is invalid
                response.StatusCode = 100;
                response.StatusMessage = "Invalid email or password";
            }

            // Close the connection after executing all commands
            connection.Close();

            return response;
        }


        // Method to display list of all registrations
        public Response RegistrationList(Registration registration, SqlConnection connection)
        {
            // Create a new Response object to hold the response data
            Response response = new Response();
            // Execute a SQL query to select active registrations based on user type
            using (SqlCommand cmd = new SqlCommand("SELECT * FROM Registration WHERE IsActive = 1 AND UserType = @UserType", connection))
            {
                cmd.Parameters.AddWithValue("@UserType", registration.UserType);

                // Create a SqlDataAdapter to retrieve data from the database
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                // Create a list to store Registration objects
                List<Registration> lstRegistration = new List<Registration>();

                // Iterate through each row in the DataTable
                foreach (DataRow row in dt.Rows)
                {
                    Registration reg = new Registration
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        Name = Convert.ToString(row["Name"]),
                        Password = Convert.ToString(row["Password"]),
                        Email = Convert.ToString(row["Email"]),
                        IsActive = Convert.ToInt32(row["IsActive"]),
                        PhoneNo = Convert.ToString(row["PhoneNo"]),
                        IsApproved = Convert.ToInt32(row["IsApproved"])
                    };
                    // Add the Registration object to the list
                    lstRegistration.Add(reg);
                }

                if (lstRegistration.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Registration data found";
                    response.listRegistration = lstRegistration;
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "No Registration data found";
                    response.listRegistration = null;
                }
            }

            return response;
        }


        // Method to delete a single registration
        public Response DeleteRegistration(Registration registration, SqlConnection connection)
        {
            Response response = new Response();
            // Execute a SQL command to delete the registration with the specified ID if it is active
            using (SqlCommand cmd = new SqlCommand("DELETE FROM Registration WHERE ID = @Id AND IsActive = 1", connection))
            {
                // Add the ID parameter to the SQL command
                cmd.Parameters.AddWithValue("@Id", registration.Id);

                connection.Open();
                // Execute the SQL command to delete the registration and get the number of affected rows
                int i = cmd.ExecuteNonQuery();
                connection.Close();

                if (i > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Registration deleted successfully";
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Registration deletion failed";
                }
            }

            return response;
        }




        // Method to approve a users registration
        public Response UserApproval(Registration registration, SqlConnection connection)
        {
            // Create a new Response object to hold the response data
            Response response = new Response();

            // Execute a SQL command to update the IsApproved status of the user with the specified ID if it is active

            using (SqlCommand cmd = new SqlCommand("UPDATE Registration SET IsApproved = 1 WHERE Id = @Id AND IsActive = 1", connection))
            {
                // Add the ID parameter to the SQL command
                cmd.Parameters.AddWithValue("@Id", registration.Id);

                connection.Open();
                // Execute the SQL command to update the user's approval status and get the number of affected rows
                int i = cmd.ExecuteNonQuery();
                connection.Close();

                if (i > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "User approved";
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "User approval failed";
                }
            }

            return response;
        }




        // Method to retrieve registration details by Id
        public Registration GetRegistrationById(int id, SqlConnection connection)
        {
            // Create a new Registration object to hold the retrieved registration details
            Registration registration = new Registration();

            // Execute a SQL command to select registration details from the database based on the provided ID
            using (SqlCommand cmd = new SqlCommand("SELECT * FROM Registration WHERE Id = @Id", connection))
            {
                // Add the ID parameter to the SQL command
                cmd.Parameters.AddWithValue("@Id", id);

                connection.Open();
                // Execute the SQL command and retrieve the results using a data reader
                SqlDataReader reader = cmd.ExecuteReader();

                // Check if the data reader contains any rows
                if (reader.Read())
                {
                    registration.Id = Convert.ToInt32(reader["Id"]);
                    registration.Name = reader["Name"].ToString();
                    registration.Email = reader["Email"].ToString();
                    registration.Password = reader["Password"].ToString();
                    registration.PhoneNo = reader["PhoneNo"].ToString();
                }

                reader.Close();
                connection.Close();
            }

            return registration;
        }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Task Methods
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Method to update when a task is complete and checked by admin
        public Response TasksApproval(Tasks tasks, SqlConnection connection)
        {
            Response response = new Response();
            using (SqlCommand cmd = new SqlCommand("UPDATE Tasks SET IsCompleted = 1 WHERE Id = @Id AND IsActive = 1", connection))
            {
                cmd.Parameters.AddWithValue("@Id", tasks.Id);

                connection.Open();
                int i = cmd.ExecuteNonQuery();
                connection.Close();

                if (i > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Tasks Approved for Completion";
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Tasks approval failed";
                }
            }

            return response;
        }









        // Method to update when the user is finished
        public Response UserComplete(Tasks tasks, SqlConnection connection)
        {
            Response response = new Response();
            using (SqlCommand cmd = new SqlCommand("UPDATE Tasks SET CompleteRequest = 1 WHERE Id = @Id AND IsActive = 1", connection))
            {
                cmd.Parameters.AddWithValue("@Id", tasks.Id);

                connection.Open();
                int i = cmd.ExecuteNonQuery();
                connection.Close();

                if (i > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Task Sent for Approval";
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Task failed sending for approval";
                }
            }

            return response;
        }








        
        //Method to add a mew task into the database
        public Response AddTasks(Tasks tasks, int assignedUserId, SqlConnection connection)
        {
            Response response = new Response();

            // Define the SQL query to insert tasks into the database
            string query = "INSERT INTO Tasks (Title, AssignedUser, Content, Email, IsActive, CreatedOn, DueDate, Priority) " +
                           "VALUES (@Title, @AssignedUser, @Content, @Email, 1, GETDATE(), @DueDate, @Priority)";

            // Create a new SQL command with the query and connection
            using (SqlCommand cmd = new SqlCommand(query, connection))
            {
                // Parameters to the SQL command to prevent SQL injection
                cmd.Parameters.AddWithValue("@Title", tasks.Title);
                cmd.Parameters.AddWithValue("@AssignedUser", tasks.AssignedUser);
                cmd.Parameters.AddWithValue("@Content", tasks.Content);
                cmd.Parameters.AddWithValue("@Email", tasks.Email);
                cmd.Parameters.AddWithValue("@DueDate", tasks.DueDate);
                cmd.Parameters.AddWithValue("@Priority", tasks.Priority);

                connection.Open();
                // Execute the SQL command to insert tasks and get the number of affected rows
                int i = cmd.ExecuteNonQuery();
                connection.Close();

                // Check if any rows were affected by the insert operation
                if (i > 0)
                {
                    // Set response status code and message for successful task creation
                    response.StatusCode = 200;
                    response.StatusMessage = "Tasks created";
                }
                else
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Tasks creation failed";
                }
            }
            // Return the response object containing the status of the task creation operation
            return response;
        }





        // Method to retrieve user's email by user Id
        public string GetUserEmailById(int userId, SqlConnection connection)
        {
            string userEmail = string.Empty;

            using (SqlCommand cmd = new SqlCommand("SELECT Email FROM Registration WHERE Id = @Id", connection))
            {
                cmd.Parameters.AddWithValue("@Id", userId);

                connection.Open();
                object result = cmd.ExecuteScalar();

                if (result != null)
                {
                    userEmail = result.ToString();
                }

                connection.Close();
            }

            return userEmail;
        }








        // Method to display all tasks in a list
        public Response TasksList(SqlConnection connection)
        {
            Response response = new Response();
            using (SqlCommand cmd = new SqlCommand("SELECT Id, Title, AssignedUser, Content, Email, IsActive, CONVERT(NVARCHAR, CreatedOn, 107) AS CreatedOn, DueDate, Priority, IsCompleted, CompleteRequest FROM Tasks WHERE IsActive = 1", connection))
            {
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                List<Tasks> lstTasks = new List<Tasks>();
                foreach (DataRow row in dt.Rows)
                {
                    Tasks tasks = new Tasks
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        Title = Convert.ToString(row["Title"]),
                        AssignedUser = Convert.ToString(row["AssignedUser"]),
                        Content = Convert.ToString(row["Content"]),
                        Email = Convert.ToString(row["Email"]),
                        IsActive = Convert.ToInt32(row["IsActive"]),
                        CreatedOn = Convert.ToString(row["CreatedOn"]),
                        DueDate = Convert.ToDateTime(row["DueDate"]),
                        Priority = Convert.ToString(row["Priority"]),
                        IsCompleted = Convert.ToInt32(row["IsCompleted"]),
                        CompleteRequest = Convert.ToInt32(row["CompleteRequest"]),
                    };

                    lstTasks.Add(tasks);
                }

                if (lstTasks.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Tasks data found";
                    response.listTasks = lstTasks;
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "No Tasks data found";
                    response.listTasks = null;
                }
            }

            return response;
        }













        // Method to delete a single task
        public Response DeleteTasks(Tasks tasks, SqlConnection connection)
        {
            Response response = new Response();
            using (SqlCommand cmd = new SqlCommand("DELETE FROM Tasks WHERE ID = @Id AND IsActive = 1", connection))
            {
                cmd.Parameters.AddWithValue("@Id", tasks.Id);

                connection.Open();
                int i = cmd.ExecuteNonQuery();
                connection.Close();

                if (i > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Tasks deleted successfully";
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Tasks deletion failed";
                }
            }

            return response;
        }









        //Method to update a task
        public Response EditTasks(Tasks tasks, SqlConnection connection)
        {
            // Create a new Response object to hold the response status
            Response response = new Response();
            // Define the SQL query to update tasks in the database based on ID and IsActive status
            using (SqlCommand cmd = new SqlCommand("UPDATE Tasks SET Title = @Title, AssignedUser = @AssignedUser, Content = @Content, DueDate = @DueDate, Priority = @Priority WHERE ID = @Id AND IsActive = 1", connection))
            {
                // Parameters to the SQL command to prevent SQL injection
                cmd.Parameters.AddWithValue("@Id", tasks.Id);
                cmd.Parameters.AddWithValue("@Title", tasks.Title);
                cmd.Parameters.AddWithValue("@AssignedUser", tasks.AssignedUser);
                cmd.Parameters.AddWithValue("@Content", tasks.Content);
                cmd.Parameters.AddWithValue("@DueDate", tasks.DueDate);
                cmd.Parameters.AddWithValue("@Priority", tasks.Priority);

                connection.Open();
                // Execute the SQL command to update tasks and get the number of affected rows
                int i = cmd.ExecuteNonQuery();
                connection.Close();

                if (i > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Tasks updated successfully";
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Tasks update failed";
                }
            }
            // Return the response object containing the status of the task update operation
            return response;
        }


    }
}




