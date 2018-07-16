using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using Microsoft.Extensions.DependencyInjection;
using ru.scarfinity.core.models.ReduxStore;

namespace scarfinity_react.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult IndexBest()
        {
            var cookies = new Dictionary<string, string>();
            foreach (var c in HttpContext.Request.Cookies)
            {
                cookies.Add(c.Key, c.Value);
            }
            ViewData["data"] = new { cookies };
            return View();
        }

        public async Task<IActionResult> Index([FromServices] ISpaPrerenderer prerenderer)
        {
            var cookies = new Dictionary<string, string>();
            foreach (var c in HttpContext.Request.Cookies)
            {
                cookies.Add(c.Key, c.Value);
            }
            var data = new { cookies };

            var result = await prerenderer.RenderToString("src/dist/main-server", customDataParameter: data);

            if(!string.IsNullOrEmpty(result.RedirectUrl))
            {
                return Redirect(result.RedirectUrl);
            }

            ViewData["PrerenderHtml"] = result.Html;
            ViewData["PrerenderGlobals"] = result.CreateGlobalsAssignmentScript();

            var state = result.Globals["initialReduxState"].ToObject<Store>();

            var meta = state.Environment.Meta;
            ViewData["title"] = meta.Title;
            ViewData["description"] = meta.Description;
            ViewData["keywords"] = meta.Keywords;
            ViewData["author"] = meta.Author;
            ViewData["og:title"] = meta.OpenGraphMeta.Title;
            ViewData["og:description"] = meta.OpenGraphMeta.Description;
            ViewData["og:image"] = meta.OpenGraphMeta.Image;
            ViewData["og:url"] = $"https://scarfinity.ru{meta.OpenGraphMeta.Url}";
            ViewData["og:site_name"] = "Scarfinity";
            ViewData["og:type"] = "website";

            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
