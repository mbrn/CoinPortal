using Devia.Sigma.Business.Communication.Sms.Entity;
using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Communication.Sms
{
	public class FrmComSmsRspSttController : SgControllerBase
	{
		// GET: FrmComSmsRspStt
		public ActionResult Index()
		{
			return View();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public String GetFrmComSmsRspSttList()
		{
			return FrmComSmsRspStt.SelectAll().SgSerializeToJson();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void SaveFrmComSmsRspStt(FrmComSmsRspStt obj)
		{
			obj.Insert();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void UpdateFrmComSmsRspStt(FrmComSmsRspStt obj)
		{
			obj.Update();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void DeleteFrmComSmsRspStt(FrmComSmsRspStt obj)
		{
			obj.Delete();
		}
	}
}
