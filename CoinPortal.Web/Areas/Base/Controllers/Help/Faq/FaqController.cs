using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Help.Faq
{
    public class FaqController : SgControllerBase
    {
        // GET: Base/Faq
        public ActionResult Index()
        {
            return View();           
        }
    }
}