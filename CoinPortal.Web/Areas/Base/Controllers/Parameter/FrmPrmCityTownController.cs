using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Web.MvcAttribute;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Parameter
{
	public class FrmPrmCityTownController : SgControllerBase
	{
		// GET: FrmPrmCityTown
		public ActionResult Index()
		{
			return View();
		}

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgAuth(SgAuthType.LoginUsers)]
        public String GetFrmPrmCityTownList(Int32? TownId, String TownName, Int32? CityId)
        {
            var filter = new SgDbEntityFilter();
            filter.Add("TownId", TownId);
            filter.Add("TownName", TownName);
            filter.Add("CityId", CityId);

            return FrmPrmCityTown.SelectAll(filter).SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void SaveFrmPrmCityTown(FrmPrmCityTown obj)
		{
			obj.Insert();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void UpdateFrmPrmCityTown(FrmPrmCityTown obj)
		{
			obj.Update();
		}

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmPrmCityTown(FrmPrmCityTown obj)
        {
            obj.Delete();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgAuth(SgAuthType.LoginUsers)]
        public String GetFrmPrmCityTownPrm()
        {
            return "{" + String.Join(",", FrmPrmCityTown.SelectAll().Select(c => "\"" + c.TownId + "\":\"" + c.TownName + "\"")) + "}";
        }
    }
}
