const express = require('express');
const router = express.Router();
const actionsDb = require('./data/helpers/actionModel');

// GET
router.get('/', async (req, res, next) => {
	try {
		const actions = await actionsDb.get();
		res.status(200).json(actions);
	} catch (err) {
		next(err);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const actions = await actionsDb.get(req.params.id);
		res.status(200).json(actions);
	} catch (err) {
		next(err);
	}
});

// POST
router.post('/', validateAction, async (req, res, next) => {
	try {
    const action = await actionsDb.insert(req.body);
    res.status(201).json({message: "Action successfully created!", action});
	} catch (err) {
		next(err);
	}
});

// PUT
router.put('/', validateActionId, async (req, res, next) => {
	try {
   const action = await actionsDb.update(req.params.id, req.body);
   res.status(201).json({message: "Action updated successfully!"});
	} catch (err) {
		next(err);
	}
});

// DELETE
router.delete('/', validateActionId, async (req, res, next) => {
	try {
    const deletedAction = await actionsDb.get(req.params.id);
    const expulsion = await actionsDb.delete(req.params.id);
    res.status(201).json({message: "Action deleted!", deletedAction});
	} catch (err) {
		next(err);
	}
});

// Middleware

function validateAction(req, res, next) {
	if (!req.body.project_id) {
		res.status(400).json({ message: 'You must include a project id' });
	}
	if (!req.body.description) {
		res.status(400).json({ message: 'A description is required.' });
	}
	next();
}

function validateActionId(req, res, next) {
  actionsDb.get(req.params.id)
  .then(action =>{
    if (action) {
      req.action = action;
      next();
    }
    res.status(400).json({message: "Invalid action id"});
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({message: "Oops, something went wrong!"});
  });
}

module.exports = router;
