using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace artshop.Server.Models;

/// <summary>
/// A model representing all of the information needed to display a Square item Variation for the Catalog
/// </summary>
public class CatalogVariationDisplay
{
    public required string ItemId { get; set; }
    public required string VariationId { get; set; }
    public required string ItemName { get; set; }
    [AllowNull]
    public required string VariationName { get; set; }
    public required List<string> Categories { get; set; }
    public required Square.Money Price { get; set; }

    [AllowNull]
    public string ImageId { get; set; }
    [AllowNull]
    public string ImageURL { get; set; }
    [AllowNull]
    public string DescriptionHTML { get; set; }
}