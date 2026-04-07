const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

// ══════════════════════════════════════════════
// GET /api/posts — Get all posts
// ══════════════════════════════════════════════
router.get("/", async (req, res, next) => {
  try {
    const { category, search } = req.query;

    // Build the "where" clause dynamically
    const where = {};

    if (category && category !== "All") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }
    // Find all posts that match the filters, ordered by newest first
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" }, // Newest first
    });

    res.json({
      count: posts.length,
      posts,
    });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
});

// ══════════════════════════════════════════════
// GET /api/posts/:id — Get a single post
// ══════════════════════════════════════════════
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID — must be a number" });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
        message: `No post exists with id ${id}`,
      });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});

// ══════════════════════════════════════════════
// POST /api/posts — Create a new post
// ══════════════════════════════════════════════
router.post("/", async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    // ── Validation ──
    const errors = [];

    if (!title || title.trim() === "") {
      errors.push("Title is required");
    } else if (title.trim().length > 100) {
      errors.push("Title must be 100 characters or less");
    }

    if (!content || content.trim() === "") {
      errors.push("Content is required");
    } else if (content.trim().length > 500) {
      errors.push("Content must be 500 characters or less");
    }

    const validCategories = [
      "General", "Events", "Academic", "Placement",
      "Sports", "Tech", "Lost & Found",
    ];
    if (category && !validCategories.includes(category)) {
      errors.push(`Category must be one of: ${validCategories.join(", ")}`);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        messages: errors,
      });
    }

    // ── Create in database ──
    const newPost = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category || "General",
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

// ══════════════════════════════════════════════
// PUT /api/posts/:id — Update a post
// ══════════════════════════════════════════════
router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID — must be a number" });
    }

    const { title, content, category } = req.body;

    // Check if post exists first
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        error: "Post not found",
        message: `No post exists with id ${id}`,
      });
    }

    // Build update data — only include fields that were provided
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (category !== undefined) updateData.category = category;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// ══════════════════════════════════════════════
// DELETE /api/posts/:id — Delete a post
// ══════════════════════════════════════════════
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID — must be a number" });
    }

    // Check if post exists
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        error: "Post not found",
        message: `No post exists with id ${id}`,
      });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({
      message: "Post deleted successfully",
      deletedPost: existing,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;