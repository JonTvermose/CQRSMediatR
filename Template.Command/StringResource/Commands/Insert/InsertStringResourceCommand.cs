using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Command
{
    public class InsertStringResourceCommand : IRequest
    {
        public string Key { get; }
        public string Value { get; }
        public string LanguageCode { get; }


        public InsertStringResourceCommand(string key)
        {
            Key = key;
        }

        public InsertStringResourceCommand(string key, string value, string languageCode)
        {
            Key = key;
            Value = value;
            LanguageCode = languageCode;
        }

    }
}
