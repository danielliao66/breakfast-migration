using MongoDB.Driver;
using BreakfastServer.Services;

var builder = WebApplication.CreateBuilder(args);

// Get connection string from appsettings.json
var connectionString = builder.Configuration["MongoDB"];
var databaseName = "orderDatabase";

connectionString ??= Environment.GetEnvironmentVariable("MongoDB");

builder.Services.AddSingleton<IMongoClient>(new MongoClient(connectionString));
builder.Services.AddSingleton<NumGenerator>();
builder.Services.AddSingleton<StatusService>();
builder.Services.AddScoped(sp => 
    sp.GetRequiredService<IMongoClient>().GetDatabase(databaseName));

var clientUrl = "https://breakfast-migration.vercel.app";

builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "client",
                      policy =>
                      {
                          policy.WithOrigins(clientUrl)
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials();
                      });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseRouting();

app.UseCors("client");

app.MapHub<StatusHub>("/statusHub");

app.MapControllers();

app.Run();