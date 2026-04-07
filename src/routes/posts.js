const express = require("express");
const router = express.Router();

// ── Temporary in-memory storage (will be replaced by Prisma + PostgreSQL) ──
let posts = [
  {
    id: 1,
    title: "Welcome to Campus Buzz!",
    content:
      "This is the student bulletin board for RVITM. Share announcements, events, and updates!",
    category: "General",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Placement Season is Coming",
    content:
      "Start preparing your DSA. Minimum 2 problems a day on LeetCode. Companies visit from August.",
    category: "Placement",
    createdAt: new Date().toISOString(),
  },
];
let nextId = 3;

// ══════════════════════════════════════════════
// GET /api/posts — Get all posts
// ══════════════════════════════════════════════
router.get("/", (req, res) => {
  // Support optional query params for filtering
  const { category, search } = req.query;

  let result = [...posts];

  // Filter by category if provided
  if (category && category !== "All") {
    result = result.filter((p) => p.category === category);
  }

  // Filter by search term if provided
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term)
    );
  }

  res.json({
    count: result.length,
    posts: result,
  });
});

// ══════════════════════════════════════════════
// GET /api/posts/:id — Get a single post by ID
// ══════════════════════════════════════════════
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({
      error: "Post not found",
      message: `No post exists with id ${id}`,
    });
  }

  res.json(post);
});

// ══════════════════════════════════════════════
// POST /api/posts — Create a new post
// ══════════════════════════════════════════════
router.post("/", (req, res) => {
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
    "General",
    "Events",
    "Academic",
    "Placement",
    "Sports",
    "Tech",
    "Lost & Found",
  ];
  if (category && !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(", ")}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", messages: errors });
  }

  // ── Create the post ──
  const newPost = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    category: category || "General",
    createdAt: new Date().toISOString(),
  };

  posts.unshift(newPost); // Add to beginning (newest first)

  // 201 = "Created" — standard for successful POST
  res.status(201).json(newPost);
});

// ══════════════════════════════════════════════
// PUT /api/posts/:id — Update an existing post
// ══════════════════════════════════════════════
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({
      error: "Post not found",
      message: `No post exists with id ${id}`,
    });
  }

  const { title, content, category } = req.body;

  // Update only provided fields
  if (title) posts[postIndex].title = title.trim();
  if (content) posts[postIndex].content = content.trim();
  if (category) posts[postIndex].category = category;

  res.json(posts[postIndex]);
});

// ══════════════════════════════════════════════
// DELETE /api/posts/:id — Delete a post
// ══════════════════════════════════════════════
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({
      error: "Post not found",
      message: `No post exists with id ${id}`,
    });
  }

  const deletedPost = posts.splice(postIndex, 1)[0];

  res.json({
    message: "Post deleted successfully",
    deletedPost,
  });
});

module.exports = router;