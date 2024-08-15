using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
#pragma warning disable CS8604

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CrudContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(CrudContext context, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        // POST: api/Auth/Login
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            _logger.LogDebug("Inicio de Login para Identificación: {Identificacion}", loginRequest.Identificacion);

            var ident = new SqlParameter("@Identificacion", loginRequest.Identificacion);

            var user = _context.Registros
                .FromSqlRaw("EXEC spValidarIdentificacion @Identificacion", ident)
                .AsEnumerable()
                .FirstOrDefault();

            if (user == null)
            {
                _logger.LogWarning("Login fallido para Identificación: {Identificacion}", loginRequest.Identificacion);

                // Crear un objeto JSON con el código y el estado
                var errorResponse = new
                {
                    Code = "401",
                    Status = "Identificación inválida"
                };

                _logger.LogDebug("Fin de Login con error: Identificación inválida");

                return Unauthorized(errorResponse);
            }

            _logger.LogDebug("Login exitoso para Identificación: {Identificacion}", loginRequest.Identificacion);

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Identificacion),
                    new Claim("Codigo", user.Codigo.ToString()),
                    new Claim("Descripcion", user.Descripcion),
                    new Claim("Direccion", user.Direccion),
                    new Claim("FechaCreacion", user.FechaCreacion?.ToString("o") ?? string.Empty),
                    new Claim("IdMoneda", user.MonedaId.ToString()),
                    new Claim("MonedaNombre", user.MonedaNombre ?? string.Empty),
                    new Claim("MonedaCodigo", user.MonedaCodigo ?? string.Empty)
                }),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpiryInMinutes"])),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            _logger.LogDebug("Token generado correctamente para Identificación: {Identificacion}", user.Identificacion);
            _logger.LogDebug("Fin de Login exitoso");

            return Ok(new
            {
                Token = tokenString,
                User = new
                {
                    user.Codigo,
                    user.Descripcion,
                    user.Direccion,
                    user.Identificacion,
                    user.FechaCreacion,
                    user.MonedaId,
                    user.MonedaNombre,
                    user.MonedaCodigo
                }
            });
        }
    }

    public class LoginRequest
    {
        public string Identificacion { get; set; } = null!;
    }
}
