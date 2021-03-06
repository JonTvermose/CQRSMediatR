﻿using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using Template.Infrastructure.DataAccess;

namespace Template.Core.Command
{
    public class UpdateStringResourceCommandHandler : AsyncRequestHandler<UpdateStringResourceCommand>
    {
        private readonly IMediator _mediator;
        private readonly ApplicationDbContext _dbContext;

        public UpdateStringResourceCommandHandler(IMediator mediator, ApplicationDbContext dbContext)
        {
            _mediator = mediator;
            _dbContext = dbContext;
        }

        protected override async Task Handle(UpdateStringResourceCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Key))
                throw new ArgumentNullException(nameof(request.Key));
            if (string.IsNullOrWhiteSpace(request.LanguageCode))
                throw new ArgumentNullException(nameof(request.LanguageCode));

            var entity = await _dbContext.StringResources.SingleOrDefaultAsync(x => request.Key == x.Key && x.LanguageCode == request.LanguageCode);
            if(entity == null)
            {
                // Create a new entry
                await _mediator.Send(new InsertStringResourceCommand(request.Key, request.Value, request.LanguageCode));
                return;
            }

            if (string.IsNullOrWhiteSpace(request.Value))
            {
                // Delete the entry for this specific languagecode
                await _mediator.Send(new DeleteStringResourceCommand(new StringResourceKeyLanguageModel
                {
                    Key = request.Key,
                    LanguageCode = request.LanguageCode
                }));
                return;
            }

            entity.Value = request.Value;

            _dbContext.StringResources.Update(entity);
            await _dbContext.SaveChangesAsync();
        }
    }
}
