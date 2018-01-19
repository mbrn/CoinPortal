using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Services;
using Devia.Sigma.Core.Types;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Enumeration;
using Devia.Sigma.Db.Monitoring;
using Devia.Sigma.Db.Query;
using Devia.Sigma.Db.Common;
using Devia.Sigma.Business.Sys.Monitoring.Entity;
using Devia.Sigma.Business.Sys.Monitoring;
using Devia.Sigma.Web.MvcAttribute;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Sys.Monitoring
{
    public class MonitoringController : SgControllerBase
    {
        // GET: Base/Monitoring
        [SgMonitoring(false)]
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgMonitoring(false)]
        public String GetChartsData(String username, String ScrItemId, int hour, String tntType, Int64 tntId)
        {
            var lastUpdated = DateTime.Now.AddHours(-1 * (hour - 1));// .SgToYYYYMMDDHHMMSS() * 100;
            lastUpdated = lastUpdated.AddMinutes(-1 * lastUpdated.Minute);
            lastUpdated = lastUpdated.AddSeconds(-1 * lastUpdated.Second);
            var param = lastUpdated.SgToYYYYMMDDHHMMSS() * 100;

            var paramList = new List<SgDbParameter>();
            paramList.Add(SgDbParameter.New("P_LASTUPDATED", param.ToString()));
            if (String.IsNullOrEmpty(username) == false)
                paramList.Add(SgDbParameter.New("P_USERNAME", username));
            if (String.IsNullOrEmpty(ScrItemId) == false)
                paramList.Add(SgDbParameter.New("P_SCREEN_ITEM_ID", ScrItemId));
            if (String.IsNullOrEmpty(tntType) == false)
                paramList.Add(SgDbParameter.New("P_TNT_TYPE", tntType));
            if (tntId > 0)
                paramList.Add(SgDbParameter.New("P_TNT_ID", tntId.ToString()));
            var resultAvg = FrmMonActChartDataAvg.SelectAll(paramList.ToArray());
            var resultCnt = FrmMonActChartDataCnt.SelectAll(paramList.ToArray());
          
            var categories = new List<String>();
            var resultAverageMsAjax = new List<long>();
            var resultAverageMsNonAjax = new List<long>();
            var resultCountSuccess = new List<long>();
            var resultCountError = new List<long>();

            long totalTime = 0;
            long txnCount = 0;
            for (int i = 0; i < hour; i++)
            {
                var hourNow = DateTime.Now.AddHours(-1 * hour + 1 + i).Hour;

                categories.Add(hourNow.ToString().PadLeft(2, '0') + ":00");

                #region Cnt 

                if (resultCnt.Exists(a => a.Hour == hourNow && a.LogStatus == "F") == false)
                    resultCountSuccess.Add(0);
                else
                    resultCountSuccess.Add(resultCnt.Find(a => a.Hour == hourNow && a.LogStatus == "F").Count);

                if (resultCnt.Exists(a => a.Hour == hourNow && a.LogStatus == "E") == false)
                    resultCountError.Add(0);
                else
                    resultCountError.Add(resultCnt.Find(a => a.Hour == hourNow && a.LogStatus == "E").Count);

                #endregion

                #region Avg 

                if (resultAvg.Exists(a => a.Hour == hourNow && a.IsAjax == true) == false)
                {
                    resultAverageMsAjax.Add(0);
                }
                else
                {
                    var avg = resultAvg.Find(a => a.Hour == hourNow && a.IsAjax == true);
                    resultAverageMsAjax.Add(avg.AvgCost);
                    totalTime += avg.Count * avg.AvgCost;
                    txnCount += avg.Count;
                }

                if (resultAvg.Exists(a => a.Hour == hourNow && a.IsAjax == false) == false)
                    resultAverageMsNonAjax.Add(0);
                else
                {
                    var avg = resultAvg.Find(a => a.Hour == hourNow && a.IsAjax == false);
                    resultAverageMsNonAjax.Add(avg.AvgCost);
                    totalTime += avg.Count * avg.AvgCost;
                    txnCount += avg.Count;
                }

                #endregion

            }

            var responseCount = resultCnt.Sum(a => a.Count);
            var successCount = resultCnt.FindAll(a => a.LogStatus == "F").Sum(a => a.Count);
            var responseSuccessRatio = responseCount > 0 ? Math.Truncate((decimal)successCount * 100 / responseCount) : 0;
            var responceAvg = Math.Truncate(txnCount > 0 ? Math.Truncate((decimal)totalTime  / txnCount) : 0);            

            return new {
                onlineUserCount = HttpContext.Application["OnlineCounter"] ?? 0,
                responseCount = responseCount,
                responseSuccessRatio = responseSuccessRatio,
                responceAvg = responceAvg,
                categories = categories,
                cntSuccess = resultCountSuccess,
                cntError = resultCountError,
                avgCostAjaxArr = resultAverageMsAjax,
                avgCostNonAjaxArr = resultAverageMsNonAjax }.SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgMonitoring(false)]
        public String GetLastMonActLst(String logStatus, String username, String ScrItemId, String tntType, Int64 tntId)
        {
            var filter = new SgDbEntityFilter();

            filter.Add("Lastupdated", DateTime.Now.AddMinutes(-10).SgToYYYYMMDDHHMMSS() * 100, SgDbFilterOperator.Greater);
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
            if (tntId > 0)
                filter.Add("TntId", tntId);

            filter.Add("TntType", tntType);
            filter.Add("Username", username);
            filter.Add("ScreenItemId", ScrItemId);
            var monAct = FrmMonAct.SelectAll(filter).OrderBy(a => a.LogId).ToList();

            return new {startDate = DateTime.Now, monAct =  monAct}.SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgMonitoring(false)]
        public String GetFrmMonDtbTxnEvtLst(long logId)
        {
            var lst = FrmMonDtbTxnEvt.SelectAll(a => a.ActLogId == logId && 
            a.EvtType != SgDbMonitoring.EventType.COMMIT &&
            a.EvtType != SgDbMonitoring.EventType.CONNECTION_CLOSED &&
            a.EvtType != SgDbMonitoring.EventType.CONNECTION_STARTED &&
            a.EvtType != SgDbMonitoring.EventType.ROLLBACK);

            return lst.OrderBy(a => a.EvtId).ToList().SgSerializeToJson();

        }
    }

    [SgDbCustomEntityAttribute("", "GET_FRM_MON_ACT_CHART_DATA_AVG")]
    public partial class FrmMonActChartDataAvg : SgDbCustomEntity<FrmMonActChartDataAvg>
    {
        [SgDbCustomEntityFieldAttribute(0)]
        public Int32 Hour { get; set; }

        [SgDbCustomEntityFieldAttribute(1)]
        public bool IsAjax { get; set; }

        [SgDbCustomEntityFieldAttribute(2)]
        public long Count { get; set; }

        [SgDbCustomEntityFieldAttribute(3)]
        public long AvgCost { get; set; }        
    }

    [SgDbCustomEntityAttribute("", "GET_FRM_MON_ACT_CHART_DATA_CNT")]
    public partial class FrmMonActChartDataCnt : SgDbCustomEntity<FrmMonActChartDataCnt>
    {
        [SgDbCustomEntityFieldAttribute(0)]
        public Int32 Hour { get; set; }

        [SgDbCustomEntityFieldAttribute(1)]
        public String LogStatus { get; set; }

        [SgDbCustomEntityFieldAttribute(2)]
        public long Count { get; set; }                
    }
}