using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Parameter
{
    public class FrmPrmCurrencyController : SgControllerBase
    {
        // GET: FrmPrmCurrency
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmPrmCurrencyList()
        {
            return FrmPrmCurrency.SelectAll().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmPrmCurrency(FrmPrmCurrency obj)
        {
            obj.Insert();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmPrmCurrency(FrmPrmCurrency obj)
        {
            obj.Update();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmPrmCurrency(FrmPrmCurrency obj)
        {
            obj.Delete();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmPrmCurrencyPrm()
        {
            return "{" + String.Join(",", FrmPrmCurrency.SelectAll().Select(c => "\"" + c.CurrencyCode + "\":\"" + c.Name + "\"")) + "}";
        }  
    }
}
