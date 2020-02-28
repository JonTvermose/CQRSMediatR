using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Template.Core.Command;
using Template.Infrastructure.DataAccess;

namespace Template.Core.Command
{
    public class DeleteStringResourceCommandHandler : AsyncRequestHandler<DeleteStringResourceCommand>
    {
        private readonly ApplicationDbContext _dbContext;

        public DeleteStringResourceCommandHandler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        protected override async Task Handle(DeleteStringResourceCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Key))
                throw new ArgumentNullException(nameof(request.Key));

            if (string.IsNullOrWhiteSpace(request.LanguageCode))
            {
                // Delete all rows with the key
                var resources = _dbContext.StringResources.Where(x => x.Key == request.Key).ToList();
                _dbContext.StringResources.RemoveRange(resources);
            } 
            else
            {
                var resource = _dbContext.StringResources.Where(x => x.Key == request.Key && x.LanguageCode == request.LanguageCode).SingleOrDefault();
                if(resource != null)
                {
                    _dbContext.StringResources.Remove(resource);
                }
            }
            await _dbContext.SaveChangesAsync();
        }
    }
}
