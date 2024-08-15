using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
#pragma warning disable CS8604

public class JwtValidationFilter : IAsyncActionFilter
{
    private readonly IConfiguration _configuration;

    public JwtValidationFilter(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Verificar 'Auth/Login'
        if (context.ActionDescriptor.RouteValues["controller"] == "Auth" && context.ActionDescriptor.RouteValues["action"] == "Login")
        {
            await next(); // Continuar sin validación de JWT
            return;
        }

        // Verificar encabezado Authorization en la solicitud
        if (context.HttpContext.Request.Headers.TryGetValue("Authorization", out var authHeader))
        {
            var token = authHeader.FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                try
                {

                    var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var validationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = _configuration["Jwt:Issuer"],
                        ValidAudience = _configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(key)
                    };

                    var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                    context.HttpContext.User = principal;

                    await next(); // Continue to the next action/filter
                    return;
                }
                catch
                {
                    context.Result = new Microsoft.AspNetCore.Mvc.UnauthorizedResult();
                    return;
                }
            }
        }

        context.Result = new Microsoft.AspNetCore.Mvc.UnauthorizedResult();
    }
}
