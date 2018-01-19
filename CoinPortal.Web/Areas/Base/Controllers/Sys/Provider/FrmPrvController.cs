using Devia.Sigma.Business.Sys.Provider.Entity;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Sys.Provider
{
    public class FrmPrvController : SgControllerBase
	{
		// GET: FrmPrv
		public ActionResult Index()
		{
			return View();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public String GetFrmPrvList()
		{
			return FrmPrv.SelectAll().SgSerializeToJson();
		}

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmPrv(String PrvKey)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                FrmPrv prv = FrmPrv.SelectFirst(u => u.PrvKey == PrvKey);
                List<FrmPrvFld> prvFld = null;
                if (prv != null)
                {
                    prvFld = FrmPrvFld.SelectAll(u => u.PrvId == prv.PrvId);
                }
                return new { prv = prv, prvFld = prvFld }.SgSerializeToJson();
            });
            
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void SaveFrmPrv(FrmPrv prv, List<FrmPrvFld> prvFldList)
		{
            SgDbTxn.AutoMerge(() =>
            {
                prv.Insert();
                if (prvFldList != null)
                    prvFldList.ForEach(u => { u.PrvId = prv.PrvId; u.Insert(); });
            });

        
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void UpdateFrmPrv(FrmPrv prv, List<FrmPrvFld> prvFldList)
		{
             SgDbTxn.AutoMerge(() =>
            {
                prv.Update();
                var oldprvFldList = FrmPrvFld.SelectAll(u => u.PrvId == prv.PrvId);

                if (prvFldList != null)
                {
                    foreach (var item in oldprvFldList.FindAll(o => prvFldList.Exists(u => u.Guid == o.Guid) == false))
                    {
                        item.Delete();
                    }

                    foreach (var item in prvFldList.FindAll(o => oldprvFldList.Exists(u => u.Guid == o.Guid) == false))
                    {
                        item.PrvId = prv.PrvId;
                        item.Insert();
                    }

                    foreach (var item in prvFldList.FindAll(o => oldprvFldList.Exists(u => u.Guid == o.Guid) == true))
                    {
                        item.Update();
                    }
                }
                else
                    oldprvFldList.ForEach(u => { u.Delete(); });
            });
        }

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void DeleteFrmPrv(FrmPrv prv)
		{
            SgDbTxn.AutoMerge(() =>
            {
                prv.Delete();
                var prvFldList = FrmPrvFld.SelectAll(u => u.PrvId == prv.PrvId);
                if (prvFldList != null)
                    prvFldList.ForEach(u => { u.Delete(); });
            });
        }
    }
}
