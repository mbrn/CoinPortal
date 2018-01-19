using Devia.Sigma.Business.Auth;
using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Business.Auth.Session;
using Devia.Sigma.Business.Auth.User;
using Devia.Sigma.Business.Parameter;
using Devia.Sigma.Core.Exceptions;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.General
{
    public class LoginController : SgControllerBase
    {
        private const String START_URL_KEY = "START_URL";
        private const String KEY_WRONG_PASSWORD_COUNT = "WRONG_PASSWORD_COUNT";
        private const String KEY_SHOW_CAPTCHA = "KEY_SHOW_CAPTCHA";
        private const String KEY_CAPTCHA_PUBLIC_KEY = "CAPTCHA_PUBLIC_KEY";
        private const String KEY_CAPTCHA_PRIVATE_KEY = "CAPTCHA_PRIVATE_KEY";

        // GET: Login
        [SgAuth(SgAuthType.Anonymous)]
        public ActionResult Index(String returnUrl, bool loginError = false)
        {        
            if (SgSession.Current.IsLoggedIn)
            {
                if (String.IsNullOrEmpty(returnUrl))
                {
                    var url = @"~\Base\Empty\Index";
                    var screen = SgSession.Current.Tenant.GetDefaultScreen(SgSession.Current.UserInfo.UsrId);
                    if (screen != null)
                    {
                        url = @"~\{0}\{1}\Index".SgFormat(screen.Area, screen.Controller);
                    }

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

                ViewBag.LoginError = loginError;
                return View();
            }
        }

        [SgAuth(SgAuthType.Anonymous)]
        public ActionResult Validation(String username, [SgMonitoring(false)] String password, String remember, [Bind(Prefix = "g-recaptcha-response")] String captchaValue)
        {
            if (SgCmnVar.GetValue<bool>(KEY_SHOW_CAPTCHA, false))
            {
                if ((Session[KEY_SHOW_CAPTCHA] != null && (bool)Session[KEY_SHOW_CAPTCHA] == true) ||
                    SgAuthManager.NeedCaptchaValidation(username))
                {
                    if (String.IsNullOrEmpty(captchaValue))
                    {
                        Session[KEY_SHOW_CAPTCHA] = true;
                        return RedirectToAction("Index", new { loginError = true });
                    }

                    var captchaResult = ReCaptchaClass.Validate(captchaValue, SgCmnVar.GetValue(KEY_CAPTCHA_PRIVATE_KEY));
                    if (captchaResult != "true")
                    {
                        Session[KEY_SHOW_CAPTCHA] = true;
                        return RedirectToAction("Index", new { loginError = true });
                    }
                }
            }

            var result = SgSession.Login(username, password);
            if (result == SgLoginResult.Success)
            {
                Session[KEY_SHOW_CAPTCHA] = false;
                Session[KEY_WRONG_PASSWORD_COUNT] = 0;

                if (remember == "on")
                {
                    var token = SgAuthManager.GenerateToken(SgAuthManager.TokenType.COOKIE, "WEB", Request.UserHostAddress);
                                
                    Response.Cookies[SgSession.SSN_COOKIE].Value = token;
                    Response.Cookies[SgSession.SSN_COOKIE].Expires = DateTime.Now.AddYears(1);
                }
                else
                {
                    Response.Cookies[SgSession.SSN_COOKIE].Value = "empty";
                    Response.Cookies[SgSession.SSN_COOKIE].Expires = DateTime.Now.AddYears(-1);
                }

                var url = @"~\Base\Empty\Index";
                var screen = SgSession.Current.Tenant.GetDefaultScreen(SgSession.Current.UserInfo.UsrId);
                if (screen != null)
                {
                    url = @"~\{0}\{1}\Index".SgFormat(screen.Area, screen.Controller);
                }

                return Redirect(url);
            }
            else
            {
                if(result.SgIn(SgLoginResult.WrongPassword, SgLoginResult.UserNotFound))
                {
                    if (Session[KEY_WRONG_PASSWORD_COUNT] == null)
                        Session[KEY_WRONG_PASSWORD_COUNT] = 1;
                    else
                        Session[KEY_WRONG_PASSWORD_COUNT] = (int)Session[KEY_WRONG_PASSWORD_COUNT] + 1;

                    if (((int)Session[KEY_WRONG_PASSWORD_COUNT]) >= 3 || SgAuthManager.NeedCaptchaValidation(username))
                    {
                        Session[KEY_SHOW_CAPTCHA] = true;
                    }
                }
                return RedirectToAction("Index", new { loginError = true });
            }
        }

        [SgAuth(SgAuthType.Anonymous)]
        public String LoginWithToken(String uid, String token, String authProvider)
        {
            var result = SgSession.Login(uid, token, authProvider);
            if (result == SgLoginResult.Success)
            {
                return true.SgSerializeToJson();
            }
            else
            {
                return false.SgSerializeToJson();
            }
        }

        [SgAuth(SgAuthType.Anonymous)]
        public ActionResult Logout()
        {
            var token = String.Empty;

            if (Request.Cookies.AllKeys.Contains(SgSession.SSN_COOKIE)  && Request.Cookies[SgSession.SSN_COOKIE].Value != null)
            {
                token = Request.Cookies[SgSession.SSN_COOKIE].Value;

                if (String.IsNullOrEmpty(token) == false)
                {
                    Request.Cookies[SgSession.SSN_COOKIE].Value = String.Empty;
                    Request.Cookies[SgSession.SSN_COOKIE].Expires = DateTime.Now.AddYears(-1);
                    Response.Cookies[SgSession.SSN_COOKIE].Value = String.Empty;
                    Response.Cookies[SgSession.SSN_COOKIE].Expires = DateTime.Now.AddYears(-1);
                }
            }

            SgSession.Logout(token);

            var defaultLogin = SgCmnVar.GetValue<String>("DEFAULT_LOGIN_PAGE", "");

            if (String.IsNullOrEmpty(defaultLogin))
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                return Redirect(defaultLogin);
            }
        }

        [HttpGet]
        [SgAuth(SgAuthType.Anonymous)]
        public ActionResult SetPassword(String verificationCode)
        {
            var usr = FrmTntAutUsr.SelectFirst(u => u.VerificationCode == verificationCode);
            if(usr == null || String.IsNullOrEmpty(verificationCode))
            {
                ViewBag.Status = "NoVerification";
                return View();
            }

            ViewBag.Username = usr.Username;
            ViewBag.VerificationCode = verificationCode;

            return View();
        }

        [HttpPost]
        [SgAuth(SgAuthType.Anonymous)]
        public ActionResult SetPassword(String password, String passwordAgain, String verificationCode)
        {
            var usr = FrmTntAutUsr.SelectFirst(u => u.VerificationCode == verificationCode);
            if (usr == null || String.IsNullOrEmpty(verificationCode))
            {
                ViewBag.Status = "NoVerification";
                return View();
            }

            if(password == null || password != passwordAgain)
            {               
                ViewBag.Status = "Error";
                ViewBag.Error = "Lütfen geçerli şifre giriniz";
                return SetPassword(verificationCode);
            }

            usr.VerificationCode = Guid.NewGuid().ToString(); // Verification codu degistirelim
            usr.Password = SgAuthManager.Hash(password);
            usr.IsApproved = true;
            usr.Update();

            ViewBag.Status = "Success";

            return View();            
        }

        [SgAuth(SgAuthType.Anonymous)]
        public bool SendPasswordResetLink(String email)
        {
            var url = System.Web.HttpContext.Current.Request.Url.SgAddToRoot("Base/Login/SetPassword");

            try
            {
                SgMemberManager.SendPasswordResetLink(email, url);
                return true;
            }
            catch (SgException ex)
            {
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        [SgAuth(SgAuthType.Anonymous)]
        public ActionResult InviteUser(String verificationCode)
        {
            SgDbTxn.AutoMerge(() =>
            {
                var inv = FrmTntAutUsrTntInv.SelectFirst(a => a.VerificationCode == verificationCode);
                if (inv == null)
                {
                    ViewBag.Status = "NoVerification";
                    return;
                }

                if (inv.IsCancelled)
                {
                    ViewBag.Status = "IsCancelled";
                    return;
                }

                if (inv.IsConfirmed)
                {
                    ViewBag.Status = "IsAlreadyConfirmed";
                    return;
                }
                
                var usr = FrmTntAutUsr.SelectFirst(a => a.Mail == inv.Mail);
                if (usr == null)
                {
                    ViewBag.VerificationCode = inv.VerificationCode;
                    ViewBag.Status = "NewUser";
                }
                else
                {
                    SgMemberManager.ApproveUsr(inv.VerificationCode, usr.UsrId, false);

                    var tnt = FrmTnt.SelectFirst(a => a.TntId == inv.TntId);
                    if (tnt != null)
                        ViewBag.TenantName = tnt.TntName;

                    ViewBag.Status = "Confirmed";
                }
            });

            return View();
        }

        [HttpPost]
        [SgAuth(SgAuthType.Anonymous)]
        public ActionResult InviteUser(String verificationCode, String name, String surname, String password)
        {
            SgDbTxn.AutoMerge(() =>
            {
                var inv = FrmTntAutUsrTntInv.SelectFirst(a => a.VerificationCode == verificationCode);
                if (inv == null)
                {
                    ViewBag.Status = "NoVerification";
                    return;
                }

                if (inv.IsCancelled)
                {
                    ViewBag.Status = "IsCancelled";
                    return;
                }

                if (inv.IsConfirmed)
                {
                    ViewBag.Status = "IsAlreadyConfirmed";
                    return;
                }

                SgMemberManager.ApproveUsr(inv.VerificationCode, name, surname, password);

                var tnt = FrmTnt.SelectFirst(a => a.TntId == inv.TntId);
                if (tnt != null)
                    ViewBag.TenantName = tnt.TntName;

                ViewBag.Status = "Confirmed";                
            });
            
            return View();
        }

        // GET: Site/Notification
        [SgAuth(SgAuthType.Anonymous)]
        public ActionResult EmailVerify(String verificationCode)
        {
            if (String.IsNullOrEmpty(verificationCode))
            {
                ViewBag.Status = "E";
                ViewBag.Message = "Geçersiz doğrulama kodu. Lütfen doğrulama mailini tekrar talep ediniz";
            }
            else
            {
                try
                {
                    SgMemberManager.VerifyUser(verificationCode);
                    ViewBag.Status = "S";
                    ViewBag.Message = "E-posta doğrulama işleminiz başarıyla gerçekleştirilmiştir";
                }
                catch (SgException ex)
                {
                    ViewBag.Status = "E";
                    ViewBag.Message = ex.Message;
                }
                catch (Exception)
                {
                    ViewBag.Status = "E";
                    ViewBag.Message = "Sistemsel bir hata ile karşılaşılmıştır. Lütfen daha sonra tekrar deneyiniz";
                }
            }

            return View();
        }        
    }

    public class ReCaptchaClass
    {
        public static string Validate(string encodedResponse, String privateKey)
        {
            var client = new System.Net.WebClient();

            var googleReply = client.DownloadString(string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}", privateKey, encodedResponse));

            var captchaResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<ReCaptchaClass>(googleReply);

            return captchaResponse.Success;
        }

        [JsonProperty("success")]
        public string Success
        {
            get { return m_Success; }
            set { m_Success = value; }
        }

        private string m_Success;
        [JsonProperty("error-codes")]
        public List<string> ErrorCodes
        {
            get { return m_ErrorCodes; }
            set { m_ErrorCodes = value; }
        }

        private List<string> m_ErrorCodes;
    }
}