using Devia.Sigma.Business.Language.Entity;
using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Language
{
    public class FrmLngController : SgControllerBase
    {
        // GET: FrmLng
        public ActionResult Index()
        {
            return View();
        }

        [SgAuth(SgAuthType.LoginUsers)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmLngList()
        {
            return FrmLng.SelectAll().SgSerializeToJson();            
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmLng(FrmLng obj)
        {
            obj.Insert();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmLng(FrmLng obj)
        {
            obj.Update();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmLng(FrmLng obj)
        {
            obj.Delete();
        }
    }
}
