using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace artshop.Server.Models;

public class CatalogObjectDisplay
{
    public string ItemId { get; set; }
    public string Name { get; set; }

    [AllowNull]
    public string ImageId { get; set; }
    public string ImageURL { get; set; }
    public string DescriptionHTML { get; set; }
}