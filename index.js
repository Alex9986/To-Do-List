import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// Configure PostgreSQL database connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: "",
  port: 5432,
});
db.connect(); // Establish connection to the database

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = []; // Array to store to-do list items

// Route for the home page
app.get("/", async (req, res) => {
  try {
    // Query to fetch all items from the database
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows; // Store the result in the items array

    res.render("index.ejs", {
      listTitle: "To-Do", // Pass the title for the to-do list
      listItems: items, // Pass the list of items to be rendered
    });
  } catch (err) {
    console.log(err);
  }
});

// Route to handle adding a new item
app.post("/add", async (req, res) => {
  const item = req.body.newItem; // Get the new item from the request body
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]); // Insert the new item into the database
    res.redirect("/"); // Redirect to the home page after adding the item
  } catch (err) {
    console.log(err);
  }
});

// Route to handle editing an existing item
app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle; // Get the updated item title from the request body
  const id = req.body.updatedItemId; // Get the ID of the item to be updated from the request body

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]); // Update the item in the database
    res.redirect("/"); // Redirect to the home page after editing the item
  } catch (err) {
    console.log(err);
  }
});

// Route to handle deleting an item
app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId; // Get the ID of the item to be deleted from the request body
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]); // Delete the item from the database
    res.redirect("/"); // Redirect to the home page after deleting the item
  } catch (err) {
    console.log(err);
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
