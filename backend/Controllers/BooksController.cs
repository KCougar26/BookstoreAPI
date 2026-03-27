using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Data;
using BookstoreAPI.Models;

namespace BookstoreAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get(int pageNum = 1, int pageSize = 5, string? sortBy = "title", string? category = null)
    {
        var query = _context.Books.AsQueryable();

        // 1. Apply Category Filter first
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(x => x.Category == category);
        }

        // 2. Apply the Sort (This is the missing piece!)
        if (sortBy?.ToLower() == "author")
        {
            query = query.OrderBy(x => x.Author);
        }
        else
        {
            query = query.OrderBy(x => x.Title); // Default sort
        }

        // 3. Apply Pagination
        var totalItems = query.Count();
        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { books, totalItems });
    }
}