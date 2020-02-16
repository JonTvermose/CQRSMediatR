using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Template.Core.Data;
using Template.Core.Query.Queries.LogEntry.Models;

namespace Template.Web.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //CreateMap<Source, Destination>()
            //    .ForMember(dest => dest.property, opt => opt.MapFrom(src => src.prop));

            // LogEntry
            CreateMap<LogEntry, LogEntryListview>()
                .ReverseMap();
            CreateMap<LogEntry, LogEntryDetails>()
                .ReverseMap();
        }
    }
}
