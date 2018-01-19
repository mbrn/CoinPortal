using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;
using Devia.Sigma.Web.MvcAttribute;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Parameter
{
    public class FrmPrmContinentController : SgControllerBase
    {
        // GET: FrmPrmContinent
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmPrmContinentList()
        {
            return FrmPrmContinent.SelectAll().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmPrmContinent(FrmPrmContinent obj)
        {
            obj.Insert();
        }
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmPrmContinent(FrmPrmContinent obj)
        {
            obj.Update();
        }
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmPrmContinent(FrmPrmContinent obj)
        {
            obj.Delete();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgAuth(SgAuthType.LoginUsers)]
        public String GetFrmPrmContinentPrm()
        {
            return FrmPrmContinent.SelectAll().ToDictionary(a => a.ContinentId, a => a.ContinentName).SgSerializeToJson();
            //return "{" + String.Join(",", FrmPrmContinent.SelectAll().Select(c => "\"" + c.ContinentId + "\":\"" + c.ContinentName + "\"")) + "}";
        }
    }
}
