using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Business.Communication.Mail;
using Devia.Sigma.Business.Parameter;
using Devia.Sigma.Business.Tenancy.Entity;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Services;
using Devia.Sigma.Core.Types;
using Devia.Sigma.Core.Threading;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Core.Logging;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.General
{
    [SgAuth(SgAuthType.LoginUsers)]
    public class TestController : SgControllerBase
    {
        // GET: Base/Test
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmTestTablosuList()
        {
            return FrmTestTablosu.SelectAll().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void TestAjax([SgMonitoring(false)] DateTime TarihSaat, DateTime Tarih, Int32 Saat)
        {            
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String SaveFrmTestTablosu(FrmTestTablosu obj, String s, String y)
        {
            obj.Insert();
            return obj.SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String UpdateFrmTestTablosu(FrmTestTablosu obj)
        {
            obj.Update();
            return obj.SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmTestTablosu(FrmTestTablosu obj)
        {
            obj.Delete();
        }
    }
}