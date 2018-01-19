using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;
using Devia.Sigma.Web.MvcAttribute;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Parameter
{
    public class FrmPrmCountryController : SgControllerBase
    {
        // GET: FrmPrmCountry
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgAuth(SgAuthType.LoginUsers)]
        public String GetFrmPrmCountryList()
        {
            return FrmPrmCountry.SelectAll().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmPrmCountry(FrmPrmCountry obj)
        {
            obj.Insert();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmPrmCountry(FrmPrmCountry obj)
        {
            obj.Update();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmPrmCountry(FrmPrmCountry obj)
        {
            obj.Delete();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgAuth(SgAuthType.LoginUsers)]
        public String GetFrmPrmCountryPrm()
        {
            //return "{" + String.Join(",", FrmPrmCountry.SelectAll().Select(c => "\"" + c.CountryCode + "\":\"" + c.CountryName + "\"")) + "}";
            return FrmPrmCountry.SelectAll().ToDictionary(x => x.CountryCode, x => x.LocalName).SgSerializeToJson();
        }   
    }
}
