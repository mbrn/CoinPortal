using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;
using Devia.Sigma.Business.Sys.Monitoring.Entity;
using Devia.Sigma.Core.Types;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Enumeration;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Sys.Monitoring
{
	public class FrmMonSsnController : SgControllerBase
	{
		// GET: FrmMonSsn
		public ActionResult Index()
		{
			return View();
		}

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public String GetFrmMonSsnInfo (String ssnId, String cltIpAddr, 
                                        String usrId, String loginStatus, String loginType,
                                         String browserName, String deviceType, DateTime minDate, DateTime maxDate)
		{
            var filter = new SgDbEntityFilter();
            filter.Add("Lastupdated", minDate.SgToYYYYMMDDHHMMSS() * 100, SgDbFilterOperator.GreatEqual);
            filter.Add("Lastupdated", maxDate.SgToYYYYMMDDHHMMSS() * 100, SgDbFilterOperator.LowerEqual);
            filter.Add("SsnId", ssnId);
            filter.Add("UsrId", usrId);
            filter.Add("CltIpAddr", cltIpAddr);
            filter.Add("LoginStatus", loginStatus);
            filter.Add("LoginType", loginType);
            filter.Add("LoginType", loginType);
            filter.Add("BrowserName", browserName);
            if(deviceType == "M")
                filter.Add("IsMobileDevice", true);
            return FrmMonSsn.SelectAll(filter).SgSerializeToJson();
		}

    }
}
