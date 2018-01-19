﻿using System.Web.Mvc;

namespace Devia.Sigma.Web.Template.Areas.Base
{
    public class BaseAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            { 
                return "Base";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Base_default",
                "Base/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}