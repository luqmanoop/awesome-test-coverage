const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const db = require('../src/db');

chai.use(chaiHttp);
const expect = chai.expect;
let request;

describe('Cats', () => {
  let catId;

  before(async () => {
    request = chai.request(server).keepOpen();
    await db.set('cats', []).write();
  });
  after(() => request.close());

  it('should get all cats', async () => {
    const response = await request.get('/api/cats');

    expect(response.body)
      .to.have.property('cats')
      .that.deep.equals([]);
  });

  it('should create a cat', async () => {
    const cat = {
      name: 'fluffy',
      age: 11
    };
    const response = await request.post('/api/cats').send(cat);
    catId = response.body.cat.id;
    expect(response.status).to.equal(201);
  });

  it('should get a cat by id', async () => {
    const response = await request.get(`/api/cats/${catId}`);

    expect(response.status).to.equal(200);
    expect(response.body.cat).to.have.property('id', catId);
  });
});
