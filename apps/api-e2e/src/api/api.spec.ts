import axios from 'axios';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });

  
});

/*describe('createComment', () => {
  it('should create and return the same Comment', async () => {
    const stub = {
      postId: 'reply_id_1',
      username: 'jane_smith',
      text: 'Comment'
    }
      
    const res = await axios.post(`/comment/create`, stub)

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject(stub);
  }); 
});*/
