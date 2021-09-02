using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.services
{
    public class EmailSender
    {
            public string SendGridKey = "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";
            public string SendGridUser = "TheFoodWorksAdmin";
   
        public Task SendEmailAsync(string email, string subject, string message)
        {
            return Execute(SendGridKey, subject, message, email);
        }

        public Task Execute(string apiKey, string subject, string message, string email)
        {
            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("amyclairetod@gmail.com", "TheFoodWorksAdmin"),// Options.SendGridUser,
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));

            // Disable click tracking.
            // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
            msg.SetClickTracking(false, false);

            return client.SendEmailAsync(msg);
        }
    }
}

