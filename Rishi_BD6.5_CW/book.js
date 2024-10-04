

let books = [];

 let reviews = [];

let users = [];


async function addNewUser(data) {
  // data.id = reviews.length + 1 ;
  const newUser = {
    id: users.length + 1,
    ...data 
  };
  users.push(newUser) ;
  return newUser;
}


async function addNewBook(data) {
  // data.id = reviews.length + 1 ;
  const newBook = {
    id: users.length + 1,
    ...data 
  };
  books.push(newBook) ;
  return newBook;
}

async function addNewReview(data) {
  // data.id = reviews.length + 1 ;
  const newReview = {
    id: reviews.length + 1,
    ...data 
  };
  reviews.push(newReview) ;
  return newReview;
}






module.exports = { addNewUser, addNewBook, addNewReview } ;
