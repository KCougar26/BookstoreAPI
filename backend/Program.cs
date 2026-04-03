using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Data;
using BookstoreAPI.Models;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// --- DATABASE CONFIGURATION ---
// 1. Get the folder where the application is actually running
var path = AppContext.BaseDirectory;

// 2. Build the absolute path to your database file
// IMPORTANT: Ensure "Bookstore.sqlite" matches your filename in the publish folder EXACTLY (case-sensitive!)
var dbPath = Path.Combine(path, "Bookstore.sqlite");
var connectionString = $"Data Source={dbPath}";

// 3. Register the DbContext using the dynamic connection string
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(connectionString));

// --- SERVICES ---
builder.Services.AddControllers(); 
builder.Services.AddOpenApi();

// --- CORS CONFIGURATION ---
// This allows your React frontend to communicate with this API
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy => 
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// --- MIDDLEWARE PIPELINE ---
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
} 

app.UseHttpsRedirection();

// UseCors MUST come before MapControllers
app.UseCors("AllowReact");

app.MapControllers(); 

app.Run();