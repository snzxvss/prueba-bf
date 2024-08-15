using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using backend.Models;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonedasController : ControllerBase
    {
        private readonly CrudContext _context;
        private readonly ILogger<MonedasController> _logger;

        public MonedasController(CrudContext context, ILogger<MonedasController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Monedas
        [HttpGet]
        public async Task<IActionResult> GetMonedas()
        {
            _logger.LogDebug("Inicio de GetMonedas");

            var monedas = await _context.Monedas
                .FromSqlRaw("EXEC spObtenerMonedas")
                .ToListAsync();

            _logger.LogDebug("Se obtuvieron {Count} monedas", monedas.Count);
            _logger.LogDebug("Fin de GetMonedas");

            return Ok(monedas);
        }

        // POST: api/Monedas/Create
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] Moneda moneda)
        {
            _logger.LogDebug("Inicio de Create con los datos: {Moneda}", moneda);

            if (ModelState.IsValid)
            {
                var idParam = new SqlParameter("@Codigo", moneda.Id);
                var nombreParam = new SqlParameter("@Nombre", moneda.Nombre);
                var codigoParam = new SqlParameter("@Codigo", moneda.Codigo);
                var simboloParam = new SqlParameter("@Simbolo", moneda.Simbolo);

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spCrearMoneda @Codigo, @Nombre, @Codigo, @Simbolo",
                    idParam, nombreParam, codigoParam, simboloParam
                );

                _logger.LogDebug("Moneda creada correctamente: {Moneda}", moneda);
                _logger.LogDebug("Fin de Create");

                return Ok();
            }

            _logger.LogWarning("Petición inválida en Create: {ModelStateErrors}", ModelState);
            return BadRequest(ModelState);
        }

        // PUT: api/Monedas/Edit
        [HttpPut("Edit")]
        public async Task<IActionResult> Edit([FromBody] Moneda moneda)
        {
            _logger.LogDebug("Inicio de Edit con los datos: {Moneda}", moneda);

            if (ModelState.IsValid)
            {
                var idParam = new SqlParameter("@Codigo", moneda.Id);
                var nombreParam = new SqlParameter("@Nombre", moneda.Nombre);
                var codigoParam = new SqlParameter("@Codigo", moneda.Codigo);
                var simboloParam = new SqlParameter("@Simbolo", moneda.Simbolo);

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spActualizarMoneda @Codigo, @Nombre, @Codigo, @Simbolo",
                    idParam, nombreParam, codigoParam, simboloParam
                );

                _logger.LogDebug("Moneda actualizada correctamente: {Moneda}", moneda);
                _logger.LogDebug("Fin de Edit");

                return Ok();
            }

            _logger.LogWarning("Petición inválida en Edit: {ModelStateErrors}", ModelState);
            return BadRequest(ModelState);
        }

        // DELETE: api/Monedas/Delete/5
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogDebug("Inicio de Delete con Id: {Id}", id);

            var idParam = new SqlParameter("@Codigo", id);

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spEliminarMoneda @Codigo",
                idParam
            );

            _logger.LogDebug("Moneda con Id {Id} eliminada correctamente", id);
            _logger.LogDebug("Fin de Delete");

            return Ok();
        }
    }
}
