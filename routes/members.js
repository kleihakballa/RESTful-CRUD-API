const express = require('express');
const router = express.Router();
const membersController = require('../controllers/memberController');

//Get all members
router.get('/', membersController.getAllMembers);

//Get member by id
router.get('/:id', membersController.getMemberById);

//Add a new member
router.post('/', membersController.createMember);

//Update member
router.put('/:id', membersController.updateMember);

//Delete member
router.delete('/:id', membersController.deleteMember);

//Upgrade membership
router.post('/:id', membersController.upgradeMembership);
module.exports = router;
