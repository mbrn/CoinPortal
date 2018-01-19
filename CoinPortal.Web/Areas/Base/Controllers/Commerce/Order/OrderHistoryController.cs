using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Commerce.Order
{
    public class OrderHistoryController : SgControllerBase
    {
        // GET: Base/OrderHistory
        public ActionResult Index()
        {
            return View();
        }
    }
}