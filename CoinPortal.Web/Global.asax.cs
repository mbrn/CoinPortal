using Devia.Sigma.Core.Threading;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CoinPortal.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new SgViewEngine());

            SgWorker.Fire(() =>
            {
                SgEntityLoader.LoadAssembly(Assembly.GetExecutingAssembly(), true, true);
            });

            //SgMailManager.StartPool(1);
            //SgSmsManager.StartPool(1);

            Application["OnlineCounter"] = 0;
        }

        void Session_Start(object sender, EventArgs e)
        {
            if (Application["OnlineCounter"] != null)
            {
                Application.Lock();
                Application["OnlineCounter"] = ((int)Application["OnlineCounter"]) + 1;
                Application.UnLock();
            }
        }

        void Session_End(object sender, EventArgs e)
        {
            if (Application["OnlineCounter"] != null)
            {
                Application.Lock();
                Application["OnlineCounter"] = ((int)Application["OnlineCounter"]) - 1;
                Application.UnLock();
            }
        }
    }
}
