using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Command
{
    public class DeleteStringResourceCommand : IRequest
    {
        public string Key { get; }
        public string LanguageCode { get; }

        public DeleteStringResourceCommand(StringResourceKeyLanguageModel model)
        {
            Key = model.Key;
            LanguageCode = model.LanguageCode;
        }
    }
}
