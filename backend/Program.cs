using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Data;
using BookstoreAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(); 
builder.Services.AddOpenApi();

// 1. Get the base directory where the app is running
var path = AppContext.BaseDirectory;

// 2. Build the connection string using an absolute path 
// (Make sure "Bookstore.sqlite" matches your filename EXACTLY)
var connectionString = $"Data Source={Path.Combine(path, "Bookstore.sqlite")}";

builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddCors(options => {
        options.AddPolicy("AllowReact", policy => 
        policy.AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
} 

app.UseHttpsRedirection();

// Enable CORS before mapping controllers
app.UseCors("AllowReact");

app.MapControllers(); 

app.Run();