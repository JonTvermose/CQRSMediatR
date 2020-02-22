using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Template.Utility.Models;

namespace Template.Utility.Services
{
    public class SmtpMailSender
    {
        private readonly IHostEnvironment _env;
        private readonly ILogger<SmtpMailSender> _logger;
        private readonly SmtpSettings _smtpSettings;

        private readonly string LocalEmailFolder = @"C:\Mails";

        public SmtpMailSender(IHostEnvironment env, ILogger<SmtpMailSender> logger, IOptionsMonitor<SmtpSettings> smtpSettingOptions)
        {
            _env = env;
            _logger = logger;
            _smtpSettings = smtpSettingOptions.CurrentValue;
        }

        public void SendEmail(string recipientEmail, string subject, string messageBody)
        {
            using (var mail = new MailMessage(
              from: new MailAddress(_smtpSettings.FromEmail, _smtpSettings.FromDisplayName),
              to: new MailAddress(recipientEmail, recipientEmail)
              ))
            {
                var client = new SmtpClient(_smtpSettings.Server, _smtpSettings.Port);

                client.EnableSsl = _smtpSettings.UseSsl;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password);
                client.DeliveryMethod = SmtpDeliveryMethod.Network;

                // If running locally, save the email to a file
                if (_env.IsDevelopment())
                {
                    client.DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory;
                    client.PickupDirectoryLocation = LocalEmailFolder;
                    try
                    {
                        Directory.CreateDirectory(LocalEmailFolder);
                    }
                    catch (Exception e)
                    {
                        _logger.LogError(e.StackTrace);
                    }
                }

                mail.Subject = subject;
                mail.Body = messageBody;
                mail.IsBodyHtml = true;
                client.Send(mail);
            }
        }
    }
}
