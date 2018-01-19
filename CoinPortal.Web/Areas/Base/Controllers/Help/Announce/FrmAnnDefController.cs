using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using Devia.Sigma.Business.Auth.Entity;
using System.Collections.Generic;
using System.Linq;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Business.Document;
using Devia.Sigma.Business.Auth.Session;
using Devia.Sigma.Business.Help.Announce.Entity;
using Devia.Sigma.Web.MvcAttribute;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Help.Announce
{
    [SgTenancyMode(TenantIdWorkMode.Use, TenantIdWorkMode.Use, "")]
    public class FrmAnnDefController : SgControllerBase
	{
		// GET: FrmAnnDef
		public ActionResult Index()
		{
			return View();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public String GetFrmAnnDefList()
		{
			return FrmAnnDef.SelectAll().SgSerializeToJson();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void SaveFrmAnnDef(FrmAnnDef obj)
		{
            if(SgSession.Current.Tenant.Opt.UseTenantIdOnDml)
            {
                obj.TntType = SgSession.Current.Tenant.TntType;
            }

            obj.Insert();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmAnnDef(FrmAnnDef obj, String img)
        {
            SgDbTxn.AutoMerge(() =>
            {
                if (SgSession.Current.Tenant.Opt.UseTenantIdOnDml)
                {
                    obj.TntType = SgSession.Current.Tenant.TntType;
                    obj.TntId = SgSession.Current.Tenant.TntId;
                }

                if (String.IsNullOrEmpty(img))
                {
                    obj.ImageId = 0;
                }
                else if (img.StartsWith("data:image")) // Yani resim güncellenmiþse
                {
                    obj.ImageId = SgDocManager.AddDoc(img);
                }
                obj.Update();

            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void DeleteFrmAnnDef(FrmAnnDef obj)
		{
			obj.Delete();
		}

        public static  Dictionary<String,String> GetFrmTntTyp()
        {
            var list = FrmTntTyp.SelectAll();
            list.Insert(0,new FrmTntTyp() { TypCode = "-1", TypName = "Tümü" });
            return list.ToDictionary(a => a.TypCode.ToString(), a => a.TypName);
        }

        public static Dictionary<String, String> GetFrmTnt()
        {
            var list = FrmTnt.SelectAll();
            list.Insert(0,new FrmTnt() { TntId = 0, TntName = "Tümü" });
            return list.ToDictionary(a => a.TntId.ToString(), a => a.TntName);
        }
    }
}
