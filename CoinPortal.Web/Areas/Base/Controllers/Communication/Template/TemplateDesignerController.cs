using Devia.Sigma.Business.Communication.Template.Entity;
using Devia.Sigma.Core.Exceptions;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Communication.Template
{
    public class TemplateDesignerController : SgControllerBase
    {
        // GET: Base/TemplateDesigner
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetTemplates()
        {
            return FrmComTmp.SelectAll().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveTemplate(FrmComTmp tmp)
        {
            SgDbTxn.AutoMerge(() =>
            {
                if(FrmComTmp.Exists(a => a.TmpKey == tmp.TmpKey))
                {
                    throw new SgException("Şablon kodu zaten kullanılıyor. Lütfen farklı bir kod ile deneyiniz");
                }
                tmp.Insert();
            });            
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateTemplate(FrmComTmp tmp)
        {
            SgDbTxn.AutoMerge(() =>
            {
                if (FrmComTmp.Exists(a => a.TmpKey == tmp.TmpKey && a.TmpId != tmp.TmpId))
                {
                    throw new SgException("Şablon kodu zaten kullanılıyor. Lütfen farklı bir kod ile deneyiniz");
                }
                tmp.Update();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteTemplate(FrmComTmp tmp)
        {
            SgDbTxn.AutoMerge(() =>
            {
                tmp.Delete();
            });
        }
    }
}