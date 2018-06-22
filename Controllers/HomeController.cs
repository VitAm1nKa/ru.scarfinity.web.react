using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using ru.scarfinity.core.models.ReduxStore;

namespace scarfinity_react.Controllers
{
    public class HomeController : Controller
    {
        private readonly ISpaPrerenderer _spaPrerenderer;
        public HomeController(ISpaPrerenderer spaPrerenderer)
        {
            _spaPrerenderer = spaPrerenderer;
        }

        public async Task<IActionResult> Index()
        {
            var cookies = new Dictionary<string, string>();
            foreach (var c in HttpContext.Request.Cookies)
            {
                cookies.Add(c.Key, c.Value);
            }
            var data = new { cookies };

            var prerenderData = await _spaPrerenderer.RenderToString("src/dist/main-server", customDataParameter: data);
            var state = prerenderData.Globals["initialReduxState"].ToObject<Store>();

            var meta = state.Environment.Meta;
            ViewData["title"] = meta.Title;
            ViewData["description"] = meta.Description;
            ViewData["keywords"] = meta.Keywords;
            ViewData["author"] = meta.Author;
            ViewData["og:title"] = meta.OpenGpaphMeta.Title;
            ViewData["og:description"] = meta.OpenGpaphMeta.Description;
            ViewData["og:image"] = meta.OpenGpaphMeta.Image;
            ViewData["og:url"] = "https://scarfinity.ru";
            ViewData["og:site_name"] = "Scarfinity";
            ViewData["og:type"] = "website";

            return View(prerenderData);
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
