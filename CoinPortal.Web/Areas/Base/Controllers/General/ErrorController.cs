using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.General
{
    public class ErrorController : Controller
    {
        // GET: Base/Error
        public ActionResult Error403()
        {
            return View();
        }

        // GET: Base/Error
        public ActionResult Error404()
        {
            return View();
        }

        // GET: Base/Error
        public ActionResult Error500()
        {
            return View();
        }
    }
}