using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Business.Sys.Monitoring.Entity;
using Devia.Sigma.Core.Types;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Enumeration;
using Devia.Sigma.Db.Monitoring;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Services;


namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Sys.Monitoring
{
    public class FrmMonDtbTxnEvtController : SgControllerBase
    {
        // GET: Base/FrmMonAct
        [SgMonitoring(false)]
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgMonitoring(false)]
        public String GetFrmMonDtbTxnEvtList(String evtId, String actLogId, String txnId, String evtType, DateTime minDate, DateTime maxDate, 
            String dbName, String schemaName, String tableName)
        {
            var filter = new SgDbEntityFilter();
            filter.Add("EvtId", evtId);
            filter.Add("ActLogId", actLogId);
            filter.Add("TxnId", txnId);

            if (evtType.SgIn("ALL"))
            {
                filter.Add("EvtType", SgDbMonitoring.EventType.COMMIT, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.CONNECTION_CLOSED, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.CONNECTION_STARTED, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.ROLLBACK, SgDbFilterOperator.IsNotEqual);
            }
            else if (evtType.SgIn("S*"))
            {
                filter.Add("EvtType", SgDbMonitoring.EventType.COMMIT, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.CONNECTION_CLOSED, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.CONNECTION_STARTED, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.DELETE, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.DELETE_ALL, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.INSERT, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.ROLLBACK, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.UPDATE, SgDbFilterOperator.IsNotEqual);                
            }
            else if (evtType.SgIn("DML"))
            {
                filter.Add("EvtType", SgDbMonitoring.EventType.COMMIT, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.CONNECTION_CLOSED, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.CONNECTION_STARTED, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.ROLLBACK, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_ALL, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_AVERAGE, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_COUNT, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_EXISTS, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_GUID, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_KEY, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_MAX, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_MIN, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_SUM, SgDbFilterOperator.IsNotEqual);                
            }
            else if (evtType.SgIn("ACT"))
            {
                filter.Add("EvtType", SgDbMonitoring.EventType.DELETE, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.DELETE_ALL, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.INSERT, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.UPDATE, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_ALL, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_AVERAGE, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_COUNT, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_EXISTS, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_GUID, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_KEY, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_MAX, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_MIN, SgDbFilterOperator.IsNotEqual);
                filter.Add("EvtType", SgDbMonitoring.EventType.SELECT_SUM, SgDbFilterOperator.IsNotEqual);
            }
            else if(evtType.SgIn("SA", "SG", "SK", "SE", "SV", "SX", "SN", "SC", "SS", "IN", "UP", "DE", "DA", "OP", "CL", "CM", "RB"))
            {
                filter.Add("EvtType", evtType);
            }         

            filter.Add("Lastupdated", minDate.SgToYYYYMMDDHHMMSS() * 100, SgDbFilterOperator.GreatEqual);
            filter.Add("Lastupdated", maxDate.SgToYYYYMMDDHHMMSS() * 100, SgDbFilterOperator.LowerEqual);

            filter.Add("DbName", dbName);
            filter.Add("SchemaName", schemaName);
            filter.Add("TableName", tableName);

            return FrmMonDtbTxnEvt.SelectAll(filter).SgSerializeToJson();
        }


        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgMonitoring(false)]
        [SgAuth(SgAuthType.LoginUsers)]
        public String GetFrmMonDtbTxnEvtListWithLogId(long logId, long ssnId)
        {
            var filter = new SgDbEntityFilter();
            filter.Add("ActLogId", logId);
            filter.Add("EvtType", SgDbMonitoring.EventType.COMMIT, SgDbFilterOperator.IsNotEqual);
            filter.Add("EvtType", SgDbMonitoring.EventType.CONNECTION_CLOSED, SgDbFilterOperator.IsNotEqual);
            filter.Add("EvtType", SgDbMonitoring.EventType.CONNECTION_STARTED, SgDbFilterOperator.IsNotEqual);
            filter.Add("EvtType", SgDbMonitoring.EventType.ROLLBACK, SgDbFilterOperator.IsNotEqual);

            var txnEvt = FrmMonDtbTxnEvt.SelectAll(filter).OrderBy(a => a.ActLogId) ;
            var txnSsn = FrmMonSsn.SelectFirst(u=> u.SsnId == ssnId);

            return new { txnEvt = txnEvt, txnSsn = txnSsn}.SgSerializeToJson();

        }
    }
}