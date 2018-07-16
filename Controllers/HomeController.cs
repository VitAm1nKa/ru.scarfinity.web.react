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
        public async Task<IActionResult> Index()
        {
            var nodeServices = Request.HttpContext.RequestServices.GetRequiredService<INodeServices>();
            var hostEnv = Request.HttpContext.RequestServices.GetRequiredService<IHostingEnvironment>();

            var applicationBasePath = hostEnv.ContentRootPath;
            var requestFeature = Request.HttpContext.Features.Get<IHttpRequestFeature>();
            var unencodedPathAndQuery = requestFeature.RawTarget;
            var unencodedAbsoluteUrl = $"{Request.Scheme}://{Request.Host}{unencodedPathAndQuery}";

            CancellationTokenSource cancelTokenSource = new CancellationTokenSource();
            CancellationToken token = cancelTokenSource.Token;

            var cookies = new Dictionary<string, string>();
            foreach (var c in HttpContext.Request.Cookies)
            {
                cookies.Add(c.Key, c.Value);
            }
            var data = new { cookies };

            var prerenderResult = await Prerenderer.RenderToString(
                "/",
                nodeServices,
                token,
                new JavaScriptModuleExport(applicationBasePath + "/src/dist/main-server"),
                unencodedAbsoluteUrl,
                unencodedPathAndQuery,
                data,
                30000,
                Request.PathBase.ToString()
            );

            // var prerenderData = await _spaPrerenderer.RenderToString("src/dist/main-server", customDataParameter: data);
            var state = prerenderResult.Globals["initialReduxState"].ToObject<Store>();

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


            return View(prerenderResult);
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
