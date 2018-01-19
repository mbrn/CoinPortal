using Devia.Sigma.Business.Commerce.Order;
using Devia.Sigma.Business.Commerce.Order.Entity;
using Devia.Sigma.Business.Commerce.Payment;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Commerce.Order
{
    [SgAuth(SgAuthType.LoginUsers)]
    public class OrderController : SgControllerBase
    {
        // GET: Base/Order
        public ActionResult Index()
        {
            var order = SgOrder.Get();
            return View(order);
        }

        [SgAuth(SgAuthType.Anonymous)]
        public ActionResult PrvResultSuccess(int accId)
        {
            var result = SgPaymentManager.Process3DSResult(accId, Request);
            ViewBag.Error = result.PrvRspText;
            return View();
        }

        [HttpPost]
        [SgAuth(SgAuthType.Anonymous)]
        public ActionResult PrvResultError(int accId)
        {
            var result = SgPaymentManager.Process3DSResult(accId, Request);
            ViewBag.Error = result.PrvRspText;
            return View();
        }

        public ActionResult OrderCompleted(int ordId)
        {
            return View();
        }

        //[HttpPost]
        //public ActionResult Error(String TURKPOS_RETVAL_Sonuc, String TURKPOS_RETVAL_Sonuc_Str, String TURKPOS_RETVAL_GUID,
        //    String TURKPOS_RETVAL_Islem_Tarih, String TURKPOS_RETVAL_Dekont_ID, String TURKPOS_RETVAL_Tahsilat_Tutari, 
        //    String TURKPOS_RETVAL_Odeme_Tutari, String TURKPOS_RETVAL_Siparis_ID, String TURKPOS_RETVAL_Islem_ID,
        //    String TURKPOS_RETVAL_Ext_Data)
        //{
        //    return View();
        //}

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String UpdateOrdPrd(long ordPrdId, int quantity)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var order = SgOrder.Get();
                order.UpdateProduct(ordPrdId, quantity);

                return order.SgSerializeToJson();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String DeleteOrdPrd(long ordPrdId)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var order = SgOrder.Get();
                order.RemoveProduct(ordPrdId);

                return order.SgSerializeToJson();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String SaveOrdAdr(FrmCmrOrdAdr shpAdr, FrmCmrOrdAdr blnAdr)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var order = SgOrder.Get();
                order.SetAddresses(shpAdr, blnAdr);

                return new { shpAdr = order.ShpAdr, blnAdr = order.BlnAdr }.SgSerializeToJson();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String DoPayment(String cardOwner, String cardNo, String expiryMonth, String expiryYear, String cardCvc)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var order = SgOrder.Get();
                var result = order.DoPayment(cardOwner, cardNo, expiryMonth, expiryYear, cardCvc);

                return result.SgSerializeToJson();
            });
        }
    }
}