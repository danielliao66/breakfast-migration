using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using BreakfastServer.Entities;

[ApiController]
public class BreakfastController : ControllerBase
{
    private readonly IMongoCollection<MenuItem> _menuCollection;
    private readonly IMongoCollection<Order> _orderCollection;

    public BreakfastController(IMongoDatabase database)
    {
        _menuCollection = database.GetCollection<MenuItem>("items");
        _orderCollection = database.GetCollection<Order>("orders_new");
    }
    
    [HttpGet("menu")]
    public async Task<ActionResult<List<MenuItem>>> GetMenu()
    {
        var menu = await _menuCollection.Find(_ => true).ToListAsync();
        return Ok(menu);
    }
}