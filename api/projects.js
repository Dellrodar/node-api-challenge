const express = require('express');
const projectDb = require('../data/helpers/projectModel')

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

router.get('/:id', validateProjectId, async (req, res, next) => {
  try {
    const project = await projectDb.get(req.params.id);
    res.status(200).json(project);
  } catch (err) {
    return next(err);
  }
});

// GET Project Actions
router.get('/:id/actions', validateProjectId, async (req, res, next) => {
  try {
    const projectActions = await projectDb.getProjectActions(req.params.id);
    res.status(200).json(projectActions);
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
router.put('/:id', validateProjectId, validateProject, async (req, res, next) => {
  try {
    const project = await projectDb.update(req.params.id, req.body);
    res.status(201).json({message: "Project has been updated!", project });
  } catch (err) {
    next(err);
  }
});

//DELETE
router.delete('/:id', validateProjectId, async (req, res, next) => {
  try {
    const deletedProject = await projectDb.get(req.params.id);
    const expulsion = await projectDb.delete(req.params.id);
    res.status(200).json({message: "This project has been removed: ", deletedProject})
  } catch (err) {
    next(err)
  }
});

// Middleware
function validateProject(req, res, next) {
  if (!req.body.description || !req.body.name) {
    res.status(400).json({ message: "Missing description or notes" })
  }
  return next();
}

function validateProjectId(req, res, next) {
  projectDb.get(req.params.id)
    .then(project => {
      if(project) {
        req.project = project;
        next();
      }
      return res.status(400).json({ message: "Invalid project ID" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving project data" });
    });
}

module.exports = router;
