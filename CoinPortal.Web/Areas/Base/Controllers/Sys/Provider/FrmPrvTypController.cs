using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using Devia.Sigma.Business.Sys.Provider.Entity;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Sys.Provider
{
    public class FrmPrvTypController : SgControllerBase
	{
		// GET: FrmPrvTyp
		public ActionResult Index()
		{
			return View();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public String GetFrmPrvTypList()
		{
			return FrmPrvTyp.SelectAll().SgSerializeToJson();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void SaveFrmPrvTyp(FrmPrvTyp obj)
		{
			obj.Insert();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void UpdateFrmPrvTyp(FrmPrvTyp obj)
		{
			obj.Update();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void DeleteFrmPrvTyp(FrmPrvTyp obj)
		{
			obj.Delete();
		}
	}
}
