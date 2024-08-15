using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.Data.SqlClient;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(JwtValidationFilter))] // Aplicar el filtro a todos los métodos del controlador
    public class RegistrosController : ControllerBase
    {
        private readonly CrudContext _context;
        private readonly ILogger<RegistrosController> _logger;

        public RegistrosController(CrudContext context, ILogger<RegistrosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Registros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Registro>>> GetRegistros()
        {
            _logger.LogDebug("Inicio de GetRegistros");

            var registros = await _context.Registros
                .FromSqlRaw("EXEC spLeerRegistros")
                .ToListAsync();

            _logger.LogDebug("Se obtuvieron {Count} registros", registros.Count);
            _logger.LogDebug("Fin de GetRegistros");

            return Ok(registros);
        }

        // POST: api/Registros
        [HttpPost]
        public async Task<IActionResult> PostRegistro(Registro registro)
        {
            _logger.LogDebug("Inicio de PostRegistro con los datos: {Registro}", registro);

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Descripcion", registro.Descripcion),
                new SqlParameter("@Direccion", registro.Direccion),
                new SqlParameter("@Identificacion", registro.Identificacion),
                new SqlParameter("@MonedaId", registro.MonedaId)
            };

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spGuardarRegistro @Descripcion, @Direccion, @Identificacion, @MonedaId",
                parameters.ToArray()
            );

            _logger.LogDebug("Registro guardado correctamente: {Registro}", registro);
            _logger.LogDebug("Fin de PostRegistro");

            return CreatedAtAction(nameof(GetRegistros), new { id = registro.Codigo }, registro);
        }

        // PUT: api/Registros
        [HttpPut]
        public async Task<IActionResult> PutRegistro([FromBody] Registro registro)
        {
            _logger.LogDebug("Inicio de PutRegistro con los datos: {Registro}", registro);

            if (registro == null || registro.Codigo <= 0)
            {
                _logger.LogWarning("Petición inválida en PutRegistro: {Registro}", registro);
                return BadRequest();
            }

            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Codigo", registro.Codigo),
                new SqlParameter("@Descripcion", registro.Descripcion),
                new SqlParameter("@Direccion", registro.Direccion),
                new SqlParameter("@Identificacion", registro.Identificacion),
                new SqlParameter("@MonedaId", registro.MonedaId)
            };

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spEditarRegistro @Codigo, @Descripcion, @Direccion, @Identificacion, @MonedaId",
                parameters.ToArray()
            );

            var response = new
            {
                Id = registro.Codigo,
                Descripcion = registro.Descripcion,
                Direccion = registro.Direccion,
                Identificacion = registro.Identificacion,
                FechaCreacion = registro.FechaCreacion,
                MonedaId = registro.MonedaId
            };

            _logger.LogDebug("Registro actualizado correctamente: {Registro}", response);
            _logger.LogDebug("Fin de PutRegistro");

            return Ok(response);
        }

        // DELETE: api/Registros/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRegistro(int id)
        {
            _logger.LogDebug("Inicio de DeleteRegistro con Id: {Id}", id);

            var parameter = new SqlParameter("@Codigo", id);

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spEliminarRegistro @Codigo",
                parameter
            );

            _logger.LogDebug("Registro con Id {Id} eliminado correctamente", id);
            _logger.LogDebug("Fin de DeleteRegistro");

            return NoContent();
        }
    }
}
