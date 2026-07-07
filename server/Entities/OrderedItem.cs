namespace BreakfastServer.Entities;

public class OrderedItem {
    public string? ItemId { get; set; }
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public int Quantity;
}