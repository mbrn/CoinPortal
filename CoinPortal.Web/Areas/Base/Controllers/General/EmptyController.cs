using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.General
{
    public class EmptyController : SgControllerBase
    {
        // GET: Base/Empty
        [SgAuth(SgAuthType.LoginUsers)]
        public ActionResult Index()
        {
            return View();
        }
    }
}