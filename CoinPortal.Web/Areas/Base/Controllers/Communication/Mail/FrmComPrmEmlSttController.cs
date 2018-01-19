using Devia.Sigma.Business.Communication.Mail.Entity;
using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;
using Devia.Sigma.Web.MvcAttribute;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Communication.Mail
{
    public class FrmComPrmEmlSttController : SgControllerBase
    {
        // GET: FrmComPrmEmlStt
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmComPrmEmlSttList()
        {
            return FrmComPrmEmlStt.SelectAll().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmComPrmEmlStt(FrmComPrmEmlStt obj)
        {
            obj.Insert();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmComPrmEmlStt(FrmComPrmEmlStt obj)
        {
            obj.Update();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmComPrmEmlStt(FrmComPrmEmlStt obj)
        {
            obj.Delete();
        }

        [SgAuth(SgAuthType.LoginUsers)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmComPrmEmlSttLookup(FrmComPrmEmlStt obj)
        {
            return FrmComPrmEmlStt.SelectAll().ToDictionary(a => a.EmailStatus, a => a.Description).SgSerializeToJson();
        }
    }
}
