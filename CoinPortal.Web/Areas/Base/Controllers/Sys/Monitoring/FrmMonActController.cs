using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Business.Sys.Monitoring;
using Devia.Sigma.Business.Sys.Monitoring.Entity;
using Devia.Sigma.Core.Types;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Enumeration;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Services;


namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Sys.Monitoring
{
    public class FrmMonActController : SgControllerBase
    {
        // GET: Base/FrmMonAct
        [SgMonitoring(false)]
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgMonitoring(false)]
        public String GetFrmMonActList(String logId, String ssnId, DateTime minDate, DateTime maxDate, String logStatus, String username, String callerScreen,
            String isAjax, String area, String controller, String action, String TntType, Int64 TntId, Int64 TotalCost)
        {
            var filter = new SgDbEntityFilter();
            filter.Add("LogId", logId);
            filter.Add("SsnId", ssnId);
            filter.Add("Lastupdated", minDate.SgToYYYYMMDDHHMMSS() * 100, SgDbFilterOperator.GreatEqual);
            filter.Add("Lastupdated", maxDate.SgToYYYYMMDDHHMMSS() * 100, SgDbFilterOperator.LowerEqual);

            if (logStatus == "E")
            {
                filter.Add("LogStatus", SgActionMon.LogStatus.ACTION_FINISHED, SgDbFilterOperator.IsNotEqual);
                filter.Add("LogStatus", SgActionMon.LogStatus.ACTION_STARTED, SgDbFilterOperator.IsNotEqual);
                filter.Add("LogStatus", SgActionMon.LogStatus.RESULT_FINISHED, SgDbFilterOperator.IsNotEqual);
                filter.Add("LogStatus", SgActionMon.LogStatus.RESULT_STARTED, SgDbFilterOperator.IsNotEqual);
            }
            else
            {
                filter.Add("LogStatus", logStatus);
            } 

            if (TotalCost > 0)
                filter.Add("TotalCost", TotalCost,SgDbFilterOperator.GreatEqual);

            if(TntId != -1)
                filter.Add("TntId", TntId);

            filter.Add("TntType", TntType);
            filter.Add("Username", username);
            filter.Add("ScreenItemId", callerScreen);

            filter.Add("IsAjax", isAjax);
            filter.Add("Area", area);
            filter.Add("Controller", controller);
            filter.Add("Action", action);

            return FrmMonAct.SelectAll(filter).SgSerializeToJson();
        }

    }
}