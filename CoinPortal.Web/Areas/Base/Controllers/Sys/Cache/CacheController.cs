using Devia.Sigma.Db.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Sys.Cache
{
    public class CacheController : SgControllerBase
    {
        // GET: Base/Cache
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetCacheList()
        {
            return SgDbEntityCacheManager.GetCacheInfo().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void ReloadCache(String namezpace, String className)
        {            
            SgDbEntityCacheManager.ReloadCache(namezpace, className);
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void ReloadCaches(SgDbEntityCacheInfo[] caches)
        {
            if (caches == null)
                return;

            foreach(var cache in caches)
            {
                SgDbEntityCacheManager.ReloadCache(cache.Namespace, cache.Class);
            }
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void ReloadAllCaches()
        {
            SgDbEntityCacheManager.ReloadAllCaches();
        }
    }
}