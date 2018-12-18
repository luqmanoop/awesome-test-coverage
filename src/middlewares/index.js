const validateCat = (req, res, next) => {
  const { name, age } = req.body;
  if (!name || !age)
    return res.send(400).send({ msg: 'Please provide cat name and age' });

  if (age > 18)
    return res.status(403).send({ msg: 'No old cats allowed here' });

  return next();
};

module.exports = validateCat;
