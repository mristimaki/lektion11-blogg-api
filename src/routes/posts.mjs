import express from "express";
import { validateNumber, validateString } from "../utilities/validation.mjs";
import {
    createBlogPost,
    deleteBlogPostById,
    dislikeBlogPostById,
    getAllBlogPosts,
    getBlogPostById,
    getBlogPostByTitle,
    likeBlogPostById,
    updateBlogPostById,
    updateBlogPostTitleById,
} from "../repositories/posts.mjs";

// Skapar en router som vi kan definiera våra endpoints på
// En router är som en mini-app inom vår huvudapp
const router = express.Router();

// POST /api/blogs - skapar ett nytt blogginlägg
// req (request) innehåller data från klienten
// res (response) används för att skicka tillbaka data till klienten
router.post("/blogs", async (req, res) => {
    // Först kollar vi att requesten har en body (JSON-data)
    if (!req.body) {
        res.status(400).json({
            error: "A JSON body must be included",
        });
        return;
    }

    // Plockar ut title, content och user från request body
    const title = req.body.title;
    const content = req.body.content;
    const author = req.body.author;

    // Validerar att title är en sträng och inte undefined
    if (!validateString(title)) {
        res.status(400).json({
            error: "Title must be included and be a string",
        });
        return;
    }

    // Validerar author också
    if (validateString(author)) {
        res.status(400).json({
            error: "Author must be included and be a string",
        });
        return;
    }

    // Om allt är okej, försöker vi skapa inlägget i databasen
    try {
        const post = await createBlogPost(title, content, author);
        // Status 201 = Created (framgångsrikt skapad)
        res.status(201).json(post);
    } catch (error) {
        // Om något går fel, skriver vi ut felet och skickar tillbaka 500 (server error)
        console.log(error);
        res.status(500).json({ error: "An unexpected error occured."});
        return;
    }
});

// Kolla så att du inte missat något ovan! Det stämmer inte med lektionen