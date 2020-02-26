using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Models.Email
{
    public class EmailButtonViewModel
    {
        public EmailButtonViewModel(string text, string url)
        {
            Text = text;
            Url = url;
        }

        public string Url { get; set; }
        public string Text { get; set; }
    }
}
