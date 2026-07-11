using Microsoft.AspNetCore.SignalR;
using BreakfastServer.Entities;

namespace BreakfastServer.Services;

public class StatusService
{
    private readonly IHubContext<StatusHub> _hubContext;

    public StatusService(IHubContext<StatusHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task UpdateForCustomer(Order order)
    {
        await _hubContext.Clients.All.SendAsync("UpdateForCustomer", order);
    }

    public async Task UpdateForKitchen(Order order)
    {
        await _hubContext.Clients.All.SendAsync("UpdateForKitchen", order);
    }
}