
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let reviews = [
  {id: 1, content: "Great product:", userID: 1},
  {id: 2, content: "Not bad, could be better", userID: 2},
]

let users= [
  { id: 1, name: "John Doe", email: "johndoe@example.com" },
  { id: 2, name: "Jane Smith", email: "janesmith@example.com"},
]

async function getAllReviews() {
  return reviews;
}

async function getReviewById(id) {
  return reviews.find(review => review.id === id);
}

async function addReview(data) {
  // data.id = reviews.length + 1 ;
  const newReview = {
    id: reviews.length + 1,
    ...data 
  };
  reviews.push(newReview) ;
  return newReview ;
}

async function getUserById(id) {
  return users.find(user => user.id === id);
  
}

async function addUser(user) {
  user.id = users.length + 1;
  users.push(user);
  return user ;

}



app.get("/reviews", async (req, res) => {
  const reviews = await getAllReviews();
  res.json(reviews);
})

app.get("/reviews/details/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const review = await getReviewById(id);
  if (!review) return res.status(404).send("Review not found");
  res.json(review);

});

app.post("/reviews/new", async (req, res) => {
  const newReview = await addReview(req.body);
  res.status(201).json(newReview);
});

app.get("/users/details/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await getUserById(id);

  if (!user) return res.status(404).send("User not found");
  res.json(user);
});

app.post("/users/new", async (req, res) => {
  const newUser = await addUser(req.body);
  res.status(201).json(newUser);
});







app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = {
  app,
  getAllReviews,
  getReviewById,
  addReview,
  getUserById,
  addUser,
}