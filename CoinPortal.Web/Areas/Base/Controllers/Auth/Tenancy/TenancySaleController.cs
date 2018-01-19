using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Business.Auth.Tenancy;
using Devia.Sigma.Business.Commerce.Order;
using Devia.Sigma.Core.Exceptions;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Auth.Tenancy
{
    public class TenancySaleController : SgControllerBase
    {
        // GET: Base/TenancySale
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void AddPckToBasket(long pckId)
        {
            SgDbTxn.AutoMerge(() =>
            {
                var pck = FrmTntTypPck.SelectFirst(a => a.PckId == pckId);
                if(pck == null || pck.IsActive == false)
                {
                    throw new SgException("Paketin satışı durdurulmuş. Lütfen sayfanızı yenileyerel tekrar deneyiniz");
                }

                var order = SgOrder.Get();
                order.Clear();
                order.AddProduct(pck.PrdId, 0, 12);                
            });

            
        }
    }
}