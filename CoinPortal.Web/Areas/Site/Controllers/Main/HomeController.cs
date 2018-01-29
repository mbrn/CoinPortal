using CoinPortal.Business.CoinMarketCap;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CoinPortal.Web.Areas.Site.Controllers.Main
{
    [SgAuth(SgAuthType.Anonymous)]
    public class HomeController : SgControllerBase
    {
        // GET: Site/Home
        public ActionResult Index()
        {
            return View();
        }

        // GET: Site/Home
        public ActionResult NotReady()
        {
            return View();
        }

        public JsonResult GetGlobalData()
        {
            return Json(CoinMarketCapData.GlobalData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTickerList()
        {
            return Json(CoinMarketCapData.TickerList, JsonRequestBehavior.AllowGet);
        }
    }
}