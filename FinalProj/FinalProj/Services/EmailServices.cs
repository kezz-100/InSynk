using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using FinalProj.Services;

namespace FinalProj.Services
{
    // Class responsible for sending emails
    public class EmailService
    {
        // Email settings for the SMTP server
        private readonly EmailSettings _emailSettings;

        // Constructor to initialize the EmailService with email settings
        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        // Method to send an email with specified parameters
        public void SendEmail(string toEmail, string subject, string body)
        {
            // Create a new MimeMessage
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("InSynk", _emailSettings.SmtpUsername));

            // Set the recipient of the email
            message.To.Add(new MailboxAddress("Receiver Name", toEmail));
            message.Subject = subject;

            // Create a default body builder for constructing the email body
            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = "<div style=\"background-color: #f2f2f2; padding: 20px;\"><h2 style=\"color: #333;\">Duty awaits</h2>" +
                "<p style=\"color: #555;\">We hope to see you soon. <a href=\"http://localhost:3000\">Login Here</a> </p>" +
                "<p style=\"color: #555; font-size:10px;\">          " +
                "At the heart of our project lies a commitment to revolutionize\n          teamwork and task management. With 'InSynk,' we aim to empower teams\n          " +
                "to seamlessly collaborate, innovate, and achieve their goals with\n          unparalleled efficiency. By integrating intuitive task creation,\n          " +
                "streamlined assignment processes, and real-time progress tracking,\n          we're paving the way for enhanced productivity and communication. Join\n          " +
                "us on this journey to unlock the full potential of your team and\n          " +
                "elevate your project management experience to new heights.</p><h2 style=\"color: #333;\">InSynk</h2></div>";

            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new MailKit.Net.Smtp.SmtpClient()) // Specify MailKit's SmtpClient
            {
                client.Connect(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);
                // Authenticate with the SMTP server using the provided username and password
                client.Authenticate(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);
                // Send the email
                client.Send(message);
                client.Disconnect(true);
            }
        }

    }
}


