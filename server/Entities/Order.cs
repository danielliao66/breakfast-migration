using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace BreakfastServer.Entities;

public class Order {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonElement("items")]
    public List<OrderedItem> Items { get; set; }
    [BsonElement("status")]
    public string Status { get; set; } = "preparing";
    [BsonElement("number")]
    [JsonPropertyName("number")]
    public int OrderNumber { get; set; }
}