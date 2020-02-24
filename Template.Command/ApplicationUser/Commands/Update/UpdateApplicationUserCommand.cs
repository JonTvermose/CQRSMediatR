using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Template.Core.Command
{
    public class UpdateApplicationUserCommand : IRequest
    {
        public UpdateApplicationUserModel UserModel { get; }

        public UpdateApplicationUserCommand(UpdateApplicationUserModel model)
        {
            UserModel = model;
        }
    }
}
