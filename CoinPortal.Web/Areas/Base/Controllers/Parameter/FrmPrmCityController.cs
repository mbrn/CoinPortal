using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;
using Devia.Sigma.Web.MvcAttribute;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Parameter
{
	public class FrmPrmCityController : SgControllerBase
	{
		// GET: FrmPrmCity
		public ActionResult Index()
		{
			return View();
		}

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgAuth(SgAuthType.LoginUsers)]
        public String GetFrmPrmCityList(Int32? CityId, String CityName, String CountryCode)
        {
            var filter = new SgDbEntityFilter();
            filter.Add("CityId", CityId);
            filter.Add("CityName", CityName);
            filter.Add("CountryCode", CountryCode);
            
            return FrmPrmCity.SelectAll(filter).SgSerializeToJson();
        }		 

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void SaveFrmPrmCity(FrmPrmCity obj)
		{
			obj.Insert();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void UpdateFrmPrmCity(FrmPrmCity obj)
		{
			obj.Update();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void DeleteFrmPrmCity(FrmPrmCity obj)
		{
			obj.Delete();
		}

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgAuth(SgAuthType.LoginUsers)]
        public String GetFrmPrmCityPrm()
        {
            return "{" + String.Join(",", FrmPrmCity.SelectAll().Select(c => "\"" + c.CityId + "\":\"" + c.CityName + "\"")) + "}";
        }
    }
}
