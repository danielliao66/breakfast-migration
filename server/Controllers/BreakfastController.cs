using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Text.Json;
using BreakfastServer.Entities;
using BreakfastServer.Services;

namespace BreakfastServer.Controllers;

[ApiController]
public class BreakfastController : ControllerBase
{
    private readonly IMongoCollection<MenuItem> _menuCollection;
    private readonly IMongoCollection<Order> _orderCollection;
    private readonly INumGenerator _numGenerator;

    public BreakfastController(IMongoDatabase database, INumGenerator numGenerator)
    {
        _menuCollection = database.GetCollection<MenuItem>("items");
        _orderCollection = database.GetCollection<Order>("orders_new");
        _numGenerator = numGenerator;
    }
    
    [HttpGet("menu")]
    public async Task<ActionResult<List<MenuItem>>> GetMenu()
    {
        var menu = await _menuCollection.Find(_ => true).ToListAsync();
        return Ok(menu);
    }

    [HttpGet("order-number")]
    public async Task<ActionResult<int>> GetOrderNumber()
    {
        return Ok(_numGenerator.GetNext());
    }

    [HttpPost("orders")]
    public async Task<IActionResult> CreateOrder([FromBody] Order order)
    {   
        await _orderCollection.InsertOneAsync(order);
        return Ok(new { Message = "new order created" });
    }
}