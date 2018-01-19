using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using Devia.Sigma.Business.Help.Announce.Entity;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Help.Announce
{
    public class FrmAnnCtgController : SgControllerBase
	{
		// GET: FrmAnnCtg
		public ActionResult Index()
		{
			return View();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public String GetFrmAnnCtgList()
		{
			return FrmAnnCtg.SelectAll().SgSerializeToJson();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void SaveFrmAnnCtg(FrmAnnCtg obj)
		{
			obj.Insert();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void UpdateFrmAnnCtg(FrmAnnCtg obj)
		{
			obj.Update();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void DeleteFrmAnnCtg(FrmAnnCtg obj)
		{
			obj.Delete();
		}
    }
}
