# InSynk

## Project Overview

At the heart of our project lies a commitment to revolutionize teamwork and task management. With **InSynk**, we aim to empower teams to seamlessly collaborate, innovate, and achieve their goals with unparalleled efficiency. By integrating intuitive task creation, streamlined assignment processes, and real-time progress tracking, we're paving the way for enhanced productivity and communication. Join us on this journey to unlock the full potential of your team and elevate your project management experience to new heights.

## Installation Instructions

1. Restore packages
   Once the solution is opened, Vs will automatically restore NuGet packages required by this project.

2. Build the solution
   Ensure the solution builds successfully without errors by selecting Build > Build Solution, or press Crtl + Shift + B.

3. Run the Application
   Start the backend by pressing F5 or selecting Debug > Start Debugging. This will launch the app in your default browser.

4. Verify Installation
   Once the development server starts, open the browser and navigate to https://localhost:7089/swagger/index.html


# Setting up the Connection String and Connecting to the Database

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


## Usage Guide

1. Task creation, admin enters task details such as title and content, the admin then assigns it to a user. Admin is able to edit and update tasks, as well as approve it as complete.

2. Task management, admin and users can access all tasks and users can access specific tasks also which have been assigned to them on their dashboard. Users can update the status of the task as complete from their side, admin is shown this change then approves completion allow the user to now delete the task.

3. Real-time notifications on main accross the system to update the users.



## Demonstration Video

Watch the demonstration video to see a walkthrough of the application's features in action.

https://www.loom.com/share/c3cee7e3706d4275bc8a3a245c925342?sid=d1b1da5b-227d-41e7-a44c-c3de698dc9ad

https://universityofwestminster-my.sharepoint.com/:v:/g/personal/w1834523_westminster_ac_uk/EdKUjDSRTjJHk_LYSvywiiEBeM1SfBef8SiQDlfyDBW1Xg?e=dbLRo1&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D

## Configuration

Task display, users can search for tasks based on the entered email address of the assigned user. This feature allows them to only view tasks for that user from a filtered table.

## Contributing Guidelines

Contributions are restricted to specific individuals only.

## License

This project is for educational purposes only. All rights reserved. Redistribution and use of this code, with or without modification, are not permitted without the permission of the author.
