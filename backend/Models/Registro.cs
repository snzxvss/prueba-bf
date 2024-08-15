namespace backend.Models;

public partial class Registro
{
    public int Codigo { get; set; }

    public string Descripcion { get; set; } = null!;

    public string Direccion { get; set; } = null!;

    public string Identificacion { get; set; } = null!;

    public DateTime? FechaCreacion { get; set; }

    public int MonedaId { get; set; }
    public string? MonedaNombre { get; set; }  
    public string? MonedaCodigo { get; set; } 
}
