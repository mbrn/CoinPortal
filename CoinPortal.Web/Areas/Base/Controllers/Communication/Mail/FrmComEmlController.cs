using Devia.Sigma.Business.Auth.Session;
using Devia.Sigma.Business.Communication.Mail;
using Devia.Sigma.Business.Communication.Mail.Entity;
using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Enumeration;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Communication.Mail
{
    public class FrmComEmlController : SgControllerBase
    {
        // GET: FrmComEml
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmComEmlList(String AccountId, String mailStatus, DateTime startDate, DateTime endDate)
        {
            var filter = new SgDbEntityFilter();
            if (AccountId != String.Empty)
                filter.Add("AccId", Convert.ToInt64(AccountId));
            filter.Add("MailStatus", mailStatus);
            filter.Add("InsertDate", startDate, SgDbFilterOperator.GreatEqual);
            filter.Add("InsertDate", endDate, SgDbFilterOperator.LowerEqual);

           return FrmComEmlGrp.SelectAll(filter).SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmComGroupMailList(Int64 GroupId)
        {
            return FrmComEml.SelectAll(u => u.GrpId == GroupId).SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void CancelFrmComEmlGrpList(List<FrmComEmlGrp> emlgrplist)
        {
            SgDbTxn.AutoMerge(() =>
            {
                if (emlgrplist != null)
                {
                    foreach (var item in emlgrplist)
                    {
                        if (item.MailStatus == SgMailManager.MAIL_STATUS_WAITING)
                        {
                            item.MailStatus = SgMailManager.MAIL_STATUS_CANCELED;
                            item.CancelDatetime = DateTime.Now;
                            item.CancelUser = SgSession.Current.UserInfo.Username;
                            item.Update();
                        }
                    }
                }
            });
          
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void CancelFrmComMailList(List<FrmComEml> emllist)
        {
            SgDbTxn.AutoMerge(() =>
            {
                if (emllist != null)
                {
                    foreach (var item in emllist)
                    {
                        if (item.MailStatus == SgMailManager.MAIL_STATUS_WAITING)
                        {
                            item.MailStatus = SgMailManager.MAIL_STATUS_CANCELED;
                            item.CancelDatetime = DateTime.Now;
                            item.CancelUser = SgSession.Current.UserInfo.Username;
                            item.Update();
                        }
                    }
                }
            });
          
        }
    }
}
