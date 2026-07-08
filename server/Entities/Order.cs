using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BreakfastServer.Entities;

public class Order {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public OrderedItem[] Items;
}