using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BreakfastServer.Entities;

public class MenuItem {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonElement("name")]
    public string Name { get; set; }
    [BsonElement("price")]
    public int Price { get; set; }
    [BsonElement("img_url")]
    public string ImgUrl { get; set; }
}