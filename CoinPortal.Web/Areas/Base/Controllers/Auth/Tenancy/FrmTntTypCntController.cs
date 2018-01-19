using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Auth.Tenancy
{
    public class FrmTntTypCntController : SgControllerBase
    {
        // GET: FrmTntTypCnt
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmTntTypCntList()
        {
            return FrmTntTypCnt.SelectAll().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmTntTypCnt(FrmTntTypCnt obj)
        {
            obj.Insert();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmTntTypCnt(FrmTntTypCnt obj)
        {
            obj.Update();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmTntTypCnt(FrmTntTypCnt obj)
        {
            obj.Delete();
        }
    }
}
