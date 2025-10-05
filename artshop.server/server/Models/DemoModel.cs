using System.ComponentModel.DataAnnotations;

namespace artshop.Server.Models;

public class DemoModel
{
    [Required]
    public int Id { get; set; }

    [Required]
    public int Value { get; set; }
}