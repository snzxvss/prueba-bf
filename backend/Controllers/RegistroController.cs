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

        public RegistrosController(CrudContext context)
        {
            _context = context;
        }

        // GET: api/Registros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Registro>>> GetRegistros()
        {
            var registros = await _context.Registros
                .FromSqlRaw("EXEC spLeerRegistros")
                .ToListAsync();

            return Ok(registros);
        }

        // POST: api/Registros
        [HttpPost]
        public async Task<IActionResult> PostRegistro(Registro registro)
        {
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

            return CreatedAtAction(nameof(GetRegistros), new { id = registro.Codigo }, registro);
        }

        // PUT: api/Registros
        [HttpPut]
        public async Task<IActionResult> PutRegistro([FromBody] Registro registro)
        {
            if (registro == null || registro.Codigo <= 0)
            {
                return BadRequest();
            }

            // Configura los parámetros para el procedimiento almacenado
            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Codigo", registro.Codigo),
                new SqlParameter("@Descripcion", registro.Descripcion),
                new SqlParameter("@Direccion", registro.Direccion),
                new SqlParameter("@Identificacion", registro.Identificacion),
                new SqlParameter("@MonedaId", registro.MonedaId)
            };

            // Ejecutar el procedimiento almacenado para actualizar el registro
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spEditarRegistro @Codigo, @Descripcion, @Direccion, @Identificacion, @MonedaId",
                parameters.ToArray()
            );

            // Devolver las propiedades
            var response = new
            {
                Id = registro.Codigo,
                Descripcion = registro.Descripcion,
                Direccion = registro.Direccion,
                Identificacion = registro.Identificacion,
                FechaCreacion = registro.FechaCreacion,
                MonedaId = registro.MonedaId
            };

            return Ok(response);
        }



        // DELETE: api/Registros/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRegistro(int id)
        {
            var parameter = new SqlParameter("@Codigo", id);

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spEliminarRegistro @Codigo",
                parameter
            );

            return NoContent();
        }
    }
}
