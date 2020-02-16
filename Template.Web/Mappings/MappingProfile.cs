using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Template.Web.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //CreateMap<Source, Destination>()
            //    .ForMember(dest => dest.property, opt => opt.MapFrom(src => src.prop));

        }
    }
}
