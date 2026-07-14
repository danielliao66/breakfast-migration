using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace BreakfastServer.Entities;

public class MenuItem {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonElement("name")]
    public string? Name { get; set; }
    [BsonElement("price")]
    public int Price { get; set; }
    [BsonElement("img_url")]
    [JsonPropertyName("img_url")]
    public string? ImgUrl { get; set; }
}