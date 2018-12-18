const db = require('../db');
const { randomBytes } = require('crypto');

class CatsController {
  static async findAll(req, res) {
    try {
      const cats = await db.get('cats');
      return res.send({ cats });
    } catch (error) {
      return res.status(500).send({ msg: 'Server error. Unable to get cats' });
    }
  }

  static async findOne(req, res) {
    const { id } = req.params;
    try {
      const cat = await db
        .get('cats')
        .find({ id })
        .value();

      if (!cat)
        return res.status(404).send({ msg: `Cat with id ${id} not found` });

      return res.send({ cat });
    } catch (error) {
      return res.status(500).send({ msg: 'Server error. Unable to find cat' });
    }
  }

  static async create(req, res) {
    const { name, age } = req.body;
    try {
      const id = randomBytes(4).toString('hex');
      const cat = { id, name, age };

      await db
        .get('cats')
        .push(cat)
        .write();

      return res.status(201).send({ cat });
    } catch (error) {
      return res
        .status(500)
        .send({ msg: 'Server error. Failed to create cat' });
    }
  }
}

module.exports = CatsController;
