using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Template.Core.Data;
using Template.Infrastructure.DataAccess;

namespace Template.Core.Command
{
    public class InsertStringResourceCommandHandler : AsyncRequestHandler<InsertStringResourceCommand>
    {
        private readonly IMediator _mediator;
        private readonly ApplicationDbContext _dbContext;

        public InsertStringResourceCommandHandler(IMediator mediator, ApplicationDbContext dbContext)
        {
            _mediator = mediator;
            _dbContext = dbContext;
        }

        protected override async Task Handle(InsertStringResourceCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Key))
                throw new ArgumentNullException(nameof(request.Key));

            var existing = await _dbContext.StringResources.SingleOrDefaultAsync(x => request.Key == x.Key && x.LanguageCode == "en-US");
            if(existing != null)
                throw new ArgumentException(nameof(request.Key));

            var entity = new StringResource
            {
                Key = request.Key,
                Value = request.Key,
                LanguageCode = "en-US"
            };
            _dbContext.StringResources.Add(entity);
            await _dbContext.SaveChangesAsync();
        }
    }
}
