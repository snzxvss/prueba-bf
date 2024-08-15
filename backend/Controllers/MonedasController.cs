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

        public MonedasController(CrudContext context)
        {
            _context = context;
        }

        // GET: api/Monedas
        [HttpGet]
        public async Task<IActionResult> GetMonedas()
        {
            var monedas = await _context.Monedas
                .FromSqlRaw("EXEC spObtenerMonedas")
                .ToListAsync();

            return Ok(monedas);
        }

        // POST: api/Monedas/Create
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] Moneda moneda)
        {
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

                return Ok();
            }
            return BadRequest(ModelState);
        }

        // PUT: api/Monedas/Edit
        [HttpPut("Edit")]
        public async Task<IActionResult> Edit([FromBody] Moneda moneda)
        {
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

                return Ok();
            }
            return BadRequest(ModelState);
        }

        // DELETE: api/Monedas/Delete/5
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var idParam = new SqlParameter("@Codigo", id);

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spEliminarMoneda @Codigo",
                idParam
            );

            return Ok();
        }
    }
}
