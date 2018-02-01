using Devia.Sigma.Business.Auth.Session;
using Devia.Sigma.Business.Auth.User;
using Devia.Sigma.Business.Parameter;
using Devia.Sigma.Core.Exceptions;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace CoinPortal.Web.Areas.Site.Controllers.Main
{
    [SgAuth(SgAuthType.Anonymous)]
    public class MembershipController : SgControllerBase
    {
        private const String KEY_SHOW_CAPTCHA = "KEY_SHOW_CAPTCHA";
        private const String KEY_CAPTCHA_PUBLIC_KEY = "CAPTCHA_PUBLIC_KEY";
        private const String FRONT_END_TENANT_TYPE = "FRN";

        // GET: Site/Login
        public ActionResult Index(String returnUrl)
        {
            if (SgSession.Current.IsLoggedIn)
            {
                if (String.IsNullOrEmpty(returnUrl))
                {
                    var url = @"~\";                    
                    return Redirect(url);
                }
                else
                {
                    return Redirect("~/" + returnUrl);
                }
            }
            else
            {
                if (SgCmnVar.GetValue<bool>(KEY_SHOW_CAPTCHA, false))
                {
                    if (Session[KEY_SHOW_CAPTCHA] != null && (bool)Session[KEY_SHOW_CAPTCHA] == true)
                    {
                        ViewBag.ShowCaptcha = true;
                        ViewBag.CaptchaKey = SgCmnVar.GetValue(KEY_CAPTCHA_PUBLIC_KEY);
                    }
                }

                return View();
            }
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public ActionResult SignUp(String mail, String name, String surname, String password)
        {
            var url = "http://" + System.Web.HttpContext.Current.Request.Url.Authority + "/Membership/EmailVerify";

            try
            {
                SgMemberManager.CreateNewTenant(mail, name + " " + surname, name, surname, password, FRONT_END_TENANT_TYPE, url);                 
                return Json(new { result = true }, JsonRequestBehavior.AllowGet);
            }
            catch (SgException ex)
            {
                return Json(new { result = false, description = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new { result = false, description="System Error" }, JsonRequestBehavior.AllowGet);
            }
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public ActionResult SendPasswordResetLink(String mail)
        {
            var url = "http://" + System.Web.HttpContext.Current.Request.Url.Authority + "/Membership/SetPassword";

            try
            {
                SgMemberManager.SendPasswordResetLink(mail, url);
                return Json(new { result = true }, JsonRequestBehavior.AllowGet);
            }
            catch (SgException ex)
            {
                return Json(new { result = false, description = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new { result = false, description = "System Error" }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}