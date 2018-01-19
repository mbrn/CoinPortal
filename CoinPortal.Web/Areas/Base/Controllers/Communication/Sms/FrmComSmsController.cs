using Devia.Sigma.Business.Auth.Session;
using Devia.Sigma.Business.Communication.Sms.Entity;
using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Enumeration;
using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;
using Devia.Sigma.Business.Communication.Sms;
using Devia.Sigma.Db.Transaction;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Communication.Sms
{
    public class FrmComSmsController : SgControllerBase
    {
        // GET: FrmComEml
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmComSmsList(String AccountId, String smsStatus, String phoneNo, DateTime startDate, DateTime endDate)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var filter = new SgDbEntityFilter();
				if (!String.IsNullOrEmpty(AccountId))
					filter.Add("AccountId", Convert.ToInt64(AccountId));
                filter.Add("SmsStatus", smsStatus);
                filter.Add("InsertDate", startDate, SgDbFilterOperator.GreatEqual);
                filter.Add("InsertDate", endDate, SgDbFilterOperator.LowerEqual);

                if (phoneNo == String.Empty)
                    return FrmComSmsGrp.SelectAll(filter).SgSerializeToJson();
                else
                {
                    var groups = FrmComSms.SelectAll(u => u.Number.EndsWith(phoneNo)).Select(l => l.GroupId).ToArray();
                    var result = FrmComSmsGrp.SelectAll(filter);
                    result.AddRange(FrmComSmsGrp.SelectAll(u => u.GroupId.SgIn(groups)));
                    return result.Distinct().SgSerializeToJson();
                }
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmComSmsNumberList(Int64 GroupId)
        {
            return FrmComSms.SelectAll(u => u.GroupId == GroupId).SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void CancelFrmComSmsList(List<FrmComSmsGrp> smslist)
        {
            SgDbTxn.AutoMerge(() =>
            {
                if (smslist != null)
                {
                    foreach (var item in smslist)
                    {
                        if (item.SmsStatus == SgSmsManager.SMS_STATUS_WAITING)
                        {
                            item.SmsStatus = SgSmsManager.SMS_STATUS_CANCELED;
                            item.CancelDatetime = DateTime.Now;
                            item.CancelUser = SgSession.Current.UserInfo.Username;
                            item.Update();
                        }

                    }
                }
            });

           
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void CancelFrmComSmsNumberList(List<FrmComSms> smslist)
        {
            SgDbTxn.AutoMerge(() =>
            {
                if (smslist != null)
                {
                    foreach (var item in smslist)
                    {
                        if (item.SmsStatus == SgSmsManager.SMS_STATUS_WAITING)
                        {
                            item.SmsStatus = SgSmsManager.SMS_STATUS_CANCELED;
                            item.CancelDatetime = DateTime.Now;
                            item.CancelUser = SgSession.Current.UserInfo.Username;
                            item.Update();
                        }
                    }
                }
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void RequestReport(Int64 groupId)
        {
            SgDbTxn.AutoMerge(() =>
            {
                var group = FrmComSmsGrp.SelectFirst(u => u.GroupId == groupId);

                if (group.SmsReportStatus != SgSmsManager.SMS_STATUS_SUCCESS)
                {
                    group.SmsReportStatus = SgSmsManager.SMS_STATUS_IMMIDEATELY;
                    group.Update();
                }
            });
          
        }
    }
}
