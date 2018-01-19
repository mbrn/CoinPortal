using Devia.Sigma.Business.Auth.Session;
using Devia.Sigma.Business.Help.Announce.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Help.Announce
{
    public class AnnounceController : SgControllerBase
    {
        // GET: Base/Announce
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetAnnounce(Int32 top, Int32 offSet)
        {
            return FrmAnnDef.SelectTop(top, offSet, u => u.StartDate <= DateTime.Now && u.FinishDate >= DateTime.Now && u.IsActive == true && (u.TntType == "-1" || u.TntType == SgSession.Current.Tenant.TntType))
                      .OrderBy(a => a.Priority).ThenBy(u => u.CtgId).SgSerializeToJson();
        }
    }
}