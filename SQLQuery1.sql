/*
Create database
*/

CREATE database InSynk;
USE InSynk;

/*
Create necessary tables
*/
Create Table Registration(
	ID INT Identity(1,1) 
	Primary Key, Name VARCHAR(100),
	Email VARCHAR(100),
	Password VARCHAR(100),
	PhoneNo VARCHAR(100),
	IsActive INT,
	IsApproved INT,
	UserType VARCHAR(100));

CREATE TABLE Tasks (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Title VARCHAR(100),
    Content VARCHAR(1000),
    Email VARCHAR(100),
    IsActive INT,
    CreatedOn DATETIME,
    DueDate DATETIME,
    Priority VARCHAR(50),
    AssignedUser VARCHAR(50),
    IsCompleted INT DEFAULT 0,
	CompleteRequest INT DEFAULT 0
);

/* //////////////////////////////////////////////////// */


/*
Setting up the Connection String and Connecting to the Database:

1. When you connect in Object Explorer, ensure you copy your server name. 
This server name will have to be placed inside the 'appsettings.json' file
in Visual Studio (backend).

2. Open the 'appsettings.json' file in the backend project.
   
3. Locate the 'ConnectionStrings' section within the file. You will see
a connection string named 'SNCon'.

4. Replace the value of 'Data Source' with your SQL Server instance name.
This is the server name you copied in Step 1.

5. Save the 'appsettings.json' file after making the necessary changes.

6. You can now run your application, and it should connect to the database
using the updated connection string.

*/


/* //////////////////////////////////////////////////// */

/*
Admin will register as normal then do this command to see 
what 'ID' they are.
*/
SELECT * FROM Registration;
/*
After seeing ID, change the command below to reference it 
('WHERE ID = '1' ') and execute the command all together.
*/
UPDATE Registration
SET IsApproved = '1',
    UserType = 'admin'
WHERE ID = '00';
/* //////////////////////////////////////////////////// */

/*
Useful commands to view the full table.
*/
SELECT * FROM Registration;
SELECT * FROM Tasks;

/*
Useful commands to delete single registration/task.
*/
DELETE FROM Registration where ID = '101';
DELETE FROM Tasks where ID = '';







