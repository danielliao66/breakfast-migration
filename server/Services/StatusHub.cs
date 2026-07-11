using Microsoft.AspNetCore.SignalR;
using BreakfastServer.Entities;

namespace BreakfastServer.Services; 

public class StatusHub : Hub
{
    public async Task UpdateForCustomer(Order order)
    {
        await Clients.All.SendAsync("UpdateForCustomer", order);
    }

    public async Task UpdateForKitchen(Order order)
    {
        await Clients.All.SendAsync("UpdateForKitchen", order);
    }
}