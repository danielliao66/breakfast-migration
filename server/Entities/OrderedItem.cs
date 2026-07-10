using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace BreakfastServer.Entities;

public class OrderedItem {
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("id")]
    [JsonPropertyName("id")]
    public string? ItemId { get; set; }
    [BsonElement("name")]
    public string Name { get; set; }
    [BsonElement("price")]
    public int Price { get; set; }
    [BsonElement("quantity")]
    public int Quantity { get; set; }
}