using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Command
{
    public class UpdateStringResourceCommand : IRequest
    {
        public string Key { get; }
        public string Value { get; }
        public string LanguageCode { get; }

        public UpdateStringResourceCommand(string key, string value, string languageCode)
        {
            Key = key;
            Value = value;
            LanguageCode = languageCode;
        }

    }
}
