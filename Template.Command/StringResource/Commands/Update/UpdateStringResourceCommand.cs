using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Template.Core.Data;

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

        public UpdateStringResourceCommand(StringResource resource)
        {
            Key = resource.Key;
            Value = resource.Value;
            LanguageCode = resource.LanguageCode;
        }
    }
}
