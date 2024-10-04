const request = require("supertest");
const { app } = require("../index.js");

const {
    validateUser, 
    validateBook, 
    validateReview,
} = require("../index.js");
const http = require("http");

jest.mock('../index.js', () => ({
  ...jest.requireActual('../index.js'),
  validateUser: jest.fn(), 
  validateBook: jest.fn(), 
  validateReview: jest.fn()

}));

let server ;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
}); 


describe('API Endpoints to add data', () => {

  it('should add a new user with valid input', async() => {
    const res = await request(server)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@example.com'});

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
    });

  });

  it('should return 400 from invalid user input', async() => {
    const res = await request(server)
      .post('/api/users')
      .send({ name: 'Alice' });

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Email is required and should be a string.");

  });

  it('should add a new book with valid input', async() => {
    const res = await request(server)
      .post('/api/books')
      .send({ title: 'Moby Dick', author: 'Herman Melville' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      id: 1,
      title: 'Moby Dick',
      author: 'Herman Melville'
  });
  });
  it('should return 400 from invalid book input', async() => {
      const res = await request(server)
        .post('/api/books')
        .send({ title: 'Moby Dick' });

      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual( "Author is required and should be a string." );

  });


  it('should add a new review with valid input', async() => {
    const res = await request(server)
      .post('/api/reviews')
      .send({ 'content': 'Great book!','userId': 1});

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      id: 1,
      content: 'Great book!',
      userId: 1
  });
  });

  it('should return 400 from invalid review input', async() => {
      const res = await request(server)
        .post('/api/reviews')
        .send({ userId: 1 });

      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual( "Content is required and should be a string." );

  });
  });

describe('API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


    it('should validate user input', async () => {
      const mockUser = {id: 2, name: 'Alice', email: 'alice@example.com'}
      validateUser.mockReturnValue(mockUser);
  
      const res = await request(server)
        .post('/api/users')
        .send({ name: 'Alice', email: 'alice@example.com' });
  
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(mockUser);
  
    });

  it('should validate book input', async () => {
    const mockBook = { id: 2, title: 'Moby Dick', author: 'Herman Melville' }
    validateBook.mockReturnValue(mockBook);

    const res = await request(server)
      .post('/api/books')
      .send({ title: 'Moby Dick', author: 'Herman Melville' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockBook);

  });

  it('should validate review input', async () => {
    const mockReview = { id: 2, 'content': 'Great book!','userId': 1}
    validateReview.mockReturnValue(mockReview);

    const res = await request(server)
      .post('/api/reviews')
      .send({ 'content': 'Great book!','userId': 1});

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockReview);

  });


  
});
  

  






