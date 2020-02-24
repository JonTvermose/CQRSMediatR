using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Template.Core.Data;
using Template.Infrastructure.DataAccess;

namespace Template.Core.Command
{
    public class UpdateApplicationUserCommandHandler : AsyncRequestHandler<UpdateApplicationUserCommand>
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public UpdateApplicationUserCommandHandler(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        protected override async Task Handle(UpdateApplicationUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.UserModel.Email);
            user.FirstName = request.UserModel.FirstName;
            user.LastName = request.UserModel.LastName;
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new ApplicationException($"Error updating user {user.Email}. ");
            }
        }
    }
}
