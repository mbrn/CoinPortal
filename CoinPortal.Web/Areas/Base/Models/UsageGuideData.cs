using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Business.Help.UsageGuide.Entity;
using Devia.Sigma.Db.Transaction;
using System;
using System.Collections.Generic;

namespace Devia.Sigma.Web.Template.Areas.Base.Models
{
    public class UsageGuideData
    {
        public FrmUsgSbj UsgSbj;
        public List<FrmUsgSbjComment> UsgSbjComment { get; set; }
        public Decimal UsgSbjRate = 0;

        public static UsageGuideData GetUsageGuidData(long subjectId)
        {
            var usgGuideData = new UsageGuideData();
            SgDbTxn.AutoMerge(() =>
            {
                usgGuideData.UsgSbj = FrmUsgSbj.SelectFirst(u => u.SubjectId == subjectId);
                usgGuideData.UsgSbjComment = FrmUsgSbjComment.SelectAll(u => u.SubjectId == subjectId);
                try
                {
                    usgGuideData.UsgSbjRate = FrmUsgSbjRate.Avg(u => u.RateVal, u => u.SubjectId == subjectId);
                    usgGuideData.UsgSbjRate = UsageGuideData.GetRoundupToHalf(usgGuideData.UsgSbjRate);
                }
                catch
                {
                }
            });

            FrmTntAutUsr user = null;
            foreach (var item in usgGuideData.UsgSbjComment)
            {
                user = FrmTntAutUsr.SelectFirst(u => u.Username == item.InsertUser);
                if(user != null)
                    item.ImgPath = user.ImgPath;
            }

            return usgGuideData;
        }

        public static decimal GetRoundupToHalf(Decimal d)
        {
            Decimal decimalpoint = d - (Int32)d ;
            if (decimalpoint > (Decimal)0.5)
                return (Int32)d + 1;
            else
                return d;
        }
    }
}