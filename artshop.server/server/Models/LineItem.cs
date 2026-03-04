using System.ComponentModel.DataAnnotations;

namespace artshop.Server.Models;

public class LineItem
{
    [Required]
    public required string Id { get; set; }

    [Required]
    public int Quantity { get; set; }
}