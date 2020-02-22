﻿using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Template.Core.Command;
using Template.Core.Query.Queries.StringResource;
using Template.Web.Models.StringResourceModels;

namespace Template.Web.Controllers
{
    public class StringResourceController : BaseController
    {
        private readonly IMediator _mediator;

        public StringResourceController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> AddMissingKey([FromBody] MissingStringResource inputModel)
        {
            await _mediator.Send(new InsertStringResourceCommand(inputModel.Key));
            return Ok(new { Key = inputModel.Key, Message = $"Key added for en-US: {inputModel.Key}" });
        }

        [HttpGet]
        public async Task<IActionResult> GetResources(string languageCode)
        {
            var stringResourceDictionary = await _mediator.Send(new LanguageStringResourceQuery(languageCode));
            return Ok(new StringResourcesLanguage { languageCode = languageCode, values = stringResourceDictionary });
        }

        [HttpGet]
        public async Task<string> GetResourcesScript()
        {
            var stringResourceDictionary = await _mediator.Send(new LanguageStringResourceQuery("en-US"));
            var resources = JsonSerializer.Serialize(new StringResourcesLanguage { languageCode = "en-US", values = stringResourceDictionary });
            var script = $"var stringResources = [{resources}];";
            return script;
        }
        
    }
}