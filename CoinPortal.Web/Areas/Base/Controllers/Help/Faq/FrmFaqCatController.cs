using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using Devia.Sigma.Business.Help.Faq.Entity;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Help.Faq
{
    public class FrmFaqCatController : SgControllerBase
	{
		// GET: FrmFaqCat
		public ActionResult Index()
		{
			return View();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public String GetFrmFaqCatList()
		{
			return FrmFaqCat.SelectAll().SgSerializeToJson();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void SaveFrmFaqCat(FrmFaqCat obj)
		{
			obj.Insert();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void UpdateFrmFaqCat(FrmFaqCat obj)
		{
			obj.Update();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void DeleteFrmFaqCat(FrmFaqCat obj)
		{
			obj.Delete();
		}
    }
}
