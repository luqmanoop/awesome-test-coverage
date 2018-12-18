const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const server = require('../src/server');
const db = require('../src/db');
const CatsController = require('../src/controllers');

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

const expect = chai.expect;
let request;

describe('Cats', () => {
  let catId;

  before(async () => {
    request = chai.request(server).keepOpen();
    await db.set('cats', []).write();
  });

  afterEach(() => sinon.restore());

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

  describe('CatsController', () => {
    it('fakes server error getting all cats', async () => {
      const req = {};
      const res = {
        status() {},
        send() {}
      };

      sinon.stub(res, 'status').returnsThis();
      sinon.stub(db, 'get').throws();

      await CatsController.findAll(req, res);
      expect(res.status).to.have.been.calledWith(500);
    });

    it('fails to find cat by ID', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status() {},
        send() {}
      };

      sinon.stub(res, 'status').returnsThis();
      sinon.stub(db, 'get').returnsThis();
      sinon.stub(db, 'find').returnsThis();
      sinon.stub(db, 'value').returns(false);

      await CatsController.findOne(req, res);
      expect(res.status).to.have.been.calledWith(404);
    });

    it('fakes server error getting a cat by ID', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status() {},
        send() {}
      };

      sinon.stub(res, 'status').returnsThis();
      sinon.stub(db, 'get').returnsThis();
      sinon.stub(db, 'find').throws();

      await CatsController.findOne(req, res);
      expect(res.status).to.have.been.calledWith(500);
    });

    it('fakes server error creating a cat', async () => {
      const req = {
        body: {
          name: 'fido',
          age: 3
        }
      };
      const res = {
        status() {},
        send() {}
      };

      sinon.stub(res, 'status').returnsThis();
      sinon.stub(db, 'get').throws();

      await CatsController.create(req, res);
      expect(res.status).to.have.been.calledWith(500);
    });
  });
});
