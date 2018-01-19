using Devia.Sigma.Business.Parameter;
using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Core.Exceptions;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Parameter
{
    public class FrmPrmCmnVarController : SgControllerBase
    {
        // GET: FrmPrmCmnVar
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmPrmCmnVarList()
        {
            return FrmPrmCmnVar.SelectAll().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmPrmCmnVar(FrmPrmCmnVar obj)
        {
            obj.VarKey = obj.VarKey.Trim();

            SgDbTxn.Auto(() =>
            {
                if(FrmPrmCmnVar.Exists(a => a.VarKey == obj.VarKey))
                {
                    throw new SgException("Bu değişken ismi zaten kullanılıyor");
                }

                obj.Insert();
            });
            
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmPrmCmnVar(FrmPrmCmnVar obj)
        {
            obj.VarKey = obj.VarKey.Trim();
            obj.Update();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmPrmCmnVar(FrmPrmCmnVar obj)
        {
            obj.Delete();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgAuth(SgAuthType.LoginUsers)]
        public String GetValue(String key)
        {
            return SgCmnVar.GetValue(key, "");
        }
    }
}
