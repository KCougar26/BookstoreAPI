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
    public async Task<IActionResult> GetBooks(int pageNum = 1, int pageSize = 5, string sortBy = "title")
    {
        var query = _context.Books.AsQueryable();

        // Dynamically choose how to sort based on the user's click
        if (sortBy.ToLower() == "author") {
            query = query.OrderBy(b => b.Author);
        } else {
            query = query.OrderBy(b => b.Title); // Default to title
        }

        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { books, totalCount = await _context.Books.CountAsync() });
    }
}