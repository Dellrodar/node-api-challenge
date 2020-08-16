const express = require('express');
const projectDb = require('./data/helpers/projectModel')

const router = express.Router();

//GET
router.get('/', async (req, res, next) => {
  try {
    const project = await projectDb.get();
    res.status(200).json(project);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await projectDb.get(req.params.id);
    res.status(200).json(project);
  } catch (err) {
    return next(err);
  }
});

//POST
router.post('/', validateProject, async (req, res, next) => {
  try {
    const project = await projectDb.insert(req.body)
    res.status(201).json({message: "Project successfully created!", project})
  } catch (err) {
    next(err);
  }
})

//PUT

//DELETE

// Middleware
function validateProject(req, res, next) {
  if (!req.body.description || !req.body.notes) {
    res.status(400).json({ message: "Missing description or notes" })
  }
  return next();
}

module.exports = router;
