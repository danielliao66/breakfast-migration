using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Get connection string from appsettings.json
var connectionString = builder.Configuration["MongoDB"];
var databaseName = "orderDatabase";

// Register MongoClient and IMongoDatabase
builder.Services.AddSingleton<IMongoClient>(new MongoClient(connectionString));
builder.Services.AddScoped<IMongoDatabase>(sp => 
    sp.GetRequiredService<IMongoClient>().GetDatabase(databaseName));

var clientUrl = "http://localhost:4200";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "client",
                      policy =>
                      {
                          policy.WithOrigins(clientUrl)
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("client");

app.MapControllers();

app.Run();