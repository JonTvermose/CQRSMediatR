using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Command
{
    public class InsertStringResourceCommand : IRequest
    {
        public string Key { get; }

        public InsertStringResourceCommand(string key)
        {
            Key = key;
        }

    }
}
