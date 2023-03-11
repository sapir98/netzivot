<%@ WebHandler Language="C#" Class="Handler" %>

using System.Web;
using Newtonsoft.Json;

public class Handler : IHttpHandler
{
    public static SQLClass SQLClass = new SQLClass();

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";

        var action = context.Request["Action"];

        switch (action)
        {
            case "getAllRights":
                var query = "SELECT * FROM rights";
                var rights = SQLClass.SQLSelect(query);
                context.Response.Write(JsonConvert.SerializeObject(rights.Tables[0]));
                break;

            default:
                context.Response.Write("Unknown Action");
                break;
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}