using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;
using Devia.Sigma.Business.Help.Faq.Entity;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Help.Faq
{
    public class FrmFaqController : SgControllerBase
	{
		// GET: FrmFaq
		public ActionResult Index()
		{
			return View();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public String GetFrmFaqList()
		{
			return FrmFaq.SelectAll().OrderBy(u=> u.CatId).ThenBy(u=> u.Priority).SgSerializeToJson();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void SaveFrmFaq(FrmFaq obj)
		{
			obj.Insert();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void UpdateFrmFaq(FrmFaq obj)
		{
			obj.Update();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void DeleteFrmFaq(FrmFaq obj)
		{
			obj.Delete();
		}
	}
}
