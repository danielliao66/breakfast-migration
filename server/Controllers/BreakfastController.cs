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
    private readonly NumGenerator _numGenerator;
    private readonly StatusService _statusService;

    public BreakfastController(IMongoDatabase database, NumGenerator numGenerator, StatusService statusService)
    {
        _menuCollection = database.GetCollection<MenuItem>("items");
        _orderCollection = database.GetCollection<Order>("orders_new");
        _numGenerator = numGenerator;
        _statusService = statusService;
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

    [HttpGet("orders")]
    public async Task<IActionResult> GetActiveOrders()
    {   
        var orders = (await _orderCollection
            .Find(order => order.Status != "taken")
            .ToListAsync())
            .Select(order => new { id = order.Id, number = order.OrderNumber, status = order.Status });
        return Ok(orders);
    }

    [HttpPost("orders")]
    public async Task<IActionResult> CreateOrder([FromBody] Order order)
    {   
        await _orderCollection.InsertOneAsync(order);
        return Ok(new { Message = "new order created" });
    }

    [HttpPut("orders")]
    public async Task<IActionResult> UpdateStatus([FromBody] Order updatedOrder)
    {   
        var update = Builders<Order>.Update.Set(order => order.Status, updatedOrder.Status);

        await _orderCollection.UpdateOneAsync(order => order.Id == updatedOrder.Id, update);

        return Ok(new { Message = "order updated" });
    }
}