using Devia.Sigma.Business.Auth;
using Devia.Sigma.Business.Auth.Session;
using Devia.Sigma.Business.Help.UsageGuide.Entity;
using Devia.Sigma.Core.Exceptions;
using Devia.Sigma.Db.Query;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Db.Util;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using Devia.Sigma.Web.Template.Areas.Base.Models;
using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Help.UsageGuide
{
    public class UsageGuideController : SgControllerBase
    {
        public const string IsUsageGuideAdmin = "IsUsageGuideAdmin";
        // GET: Base/UsageGuide
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public bool IsAuthorized()
        {
            return SgAuthManager.IsCustomAuthorized(IsUsageGuideAdmin);
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmUsgSbjList()
        {
            return UsageGuideSubject.SelectAll().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmUsgSbj(Int64 subjectId)
        {
            return FrmUsgSbj.SelectFirst(u=> u.SubjectId == subjectId).SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetUsageGuidData(Int64 subjectId)
        {
            return UsageGuideData.GetUsageGuidData(subjectId).SgSerializeToJson();
        }


        [SgAuth(SgAuthType.ScreenAuth, IsUsageGuideAdmin)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmUsgSbj(FrmUsgSbj obj)
        {
            SgDbTxn.Auto(() =>
            {
                var allItems = FrmUsgSbj.SelectAll(a => a.ParentId == obj.ParentId);
                if (allItems.Count > 0)
                    obj.Priority = (Int16)(allItems.Max(u => u.Priority) + 1);
                else
                    obj.Priority = 1;
                obj.Insert();
            });
        }

        [SgAuth(SgAuthType.ScreenAuth, IsUsageGuideAdmin)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmUsgSbj(FrmUsgSbj obj)
        {
            obj.Update();
        }

        [SgAuth(SgAuthType.ScreenAuth, IsUsageGuideAdmin)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmUsgSbj(Int64 subjectId)
        {
            SgDbTxn.Auto(() =>
            {
                var obj = FrmUsgSbj.SelectFirst(u => u.SubjectId == subjectId);
                    obj.Delete();
                if(obj.NodeType == "L")
                    FrmUsgSbj.DeleteAll(u => u.ParentId == obj.SubjectId);
            });
        }

        [SgAuth(SgAuthType.ScreenAuth, IsUsageGuideAdmin)]
        public void UpdatePriorityUp(Int64 SubjectId)
        {
            SgDbTxn.Auto(() =>
            {
                var item = FrmUsgSbj.SelectFirst(a => a.SubjectId == SubjectId);
                var allItems = FrmUsgSbj.SelectAll(a => a.ParentId == item.ParentId).OrderBy(a => a.Priority).ToList();

                if (allItems.FindIndex(a => a.SubjectId == item.SubjectId) == 0)
                    throw new SgException("İçerik zaten en üstte bulunuyor!");

                var upItem = allItems[allItems.FindIndex(a => a.SubjectId == item.SubjectId) - 1];

                var tmp = item.Priority;
                item.Priority = upItem.Priority;
                upItem.Priority = tmp;

                item.Update();
                upItem.Update();
            });
        }

        [SgAuth(SgAuthType.ScreenAuth, IsUsageGuideAdmin)]
        public void UpdatePriorityDown(Int64 SubjectId)
        {
            SgDbTxn.Auto(() =>
            {
                var item = FrmUsgSbj.SelectFirst(a => a.SubjectId == SubjectId);
                var allItems = FrmUsgSbj.SelectAll(a => a.ParentId == item.ParentId).OrderByDescending(a => a.Priority).ToList();

                if (allItems.FindIndex(a => a.SubjectId == item.SubjectId) == 0)
                    throw new SgException("Ekran zaten en altta bulunuyor!");

                var downItem = allItems[allItems.FindIndex(a => a.SubjectId == item.SubjectId) - 1];

                var tmp = item.Priority;
                item.Priority = downItem.Priority;
                downItem.Priority = tmp;

                item.Update();
                downItem.Update();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmUsgSbjComment(Int64 SubjectId,  String commentText)
        {
            FrmUsgSbjComment comment = new FrmUsgSbjComment();
            comment.CommentText = commentText;
            comment.SubjectId = SubjectId;
            comment.Insert();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmUsgSbjRate(Decimal rateVal,long SubjectId)
        {
            SgDbTxn.AutoMerge(() =>
            {
                FrmUsgSbjRate rate = FrmUsgSbjRate.SelectFirst(u => u.InsertUser == SgSession.Current.UserInfo.Username && u.SubjectId == SubjectId);
                if (rate == null)
                {
                    rate = new FrmUsgSbjRate();
                    rate.RateVal = rateVal;
                    rate.SubjectId = SubjectId;
                    rate.Insert();
                }
                else
                {
                    rate.RateVal = rateVal;
                    rate.Update();
                }
            });
           
        }
    }

    [SgDbCustomEntityAttribute("", "GET_USAGE_GUIDE_SUBJECTS")]
    public partial class UsageGuideSubject : SgDbCustomEntity<UsageGuideSubject>
    {
        [SgDbCustomEntityFieldAttribute(0)]
        public Int64 SubjectId { get; set; }

        [SgDbCustomEntityFieldAttribute(1)]
        public Int64 ParentId { get; set; }

        [SgDbCustomEntityFieldAttribute(2)]
        public String NodeType { get; set; }

        [SgDbCustomEntityFieldAttribute(3)]
        public String SubjectName { get; set; }

        [SgDbCustomEntityFieldAttribute(4)]
        public String SubjectIconContent { get; set; }

        [SgDbCustomEntityFieldAttribute(5)]
        public Int16 Priority { get; set; }
    }
}




 