const Member = require('../model/Members');
const StatusCodes = require('http-status-codes') ;

//Get all members
exports.getAllMembers = async function (req, res) {
    try{
        const members = await Member.find();
        res.status(StatusCodes.OK).json(members);
    }catch(error){
        console.log('Error getting members list',error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
}
//Get member by id
exports.getMemberById = async (req, res) => {
    try {
        const memberId = req.params.id;
        const member = await Member.findById(memberId);

        if (!member) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Member not found' });
        }

        res.status(StatusCodes.OK).json(member);
    } catch (error) {
        console.error('Error getting member by ID:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

//Add a member

exports.createMember = async (req, res) => {
    try {

        const { name, age, membershipNumber, email, dateOfMembership, membershipType } = req.body;

        const newMember = new Member({
            name,
            age,
            membershipNumber,
            email,
            dateOfMembership,
            membershipType
        });

        const savedMember = await newMember.save();

        res.status(StatusCodes.CREATED).json(savedMember);
    } catch (error) {
        console.error('Error creating member:', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};


//Update Member
exports.updateMember = async (req, res) => {
    const memberId = req.params.id;
    const updatedData = req.body;
    try{
        const updatedMember = await Member.findByIdAndUpdate(
            memberId,
            updatedData,
            {new: true, runValidators:true}
        );
        if(!updatedMember) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Member not found' });
        }
        res.status(StatusCodes.OK).json(updatedMember);

    }catch (error){
        console.log("Error updating member", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
};

//Delete Member
exports.deleteMember = async (req, res) => {
    try{
        const deletedMember = await Member.findByIdAndDelete(req.params.id);
        if(!deletedMember) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Member not found' });
        }
        res.status(StatusCodes.OK).json(
            {
                code: 200,
                message: 'Member deleted successfully',
                deletedMember
            });
    }catch(error){
       console.error("Error deleting member", error);
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Server error'});
    }
};
//Upgrade membership
exports.upgradeMembership = async (req, res) => {
    try {
        const memberId = req.params.id;
        const member = await Members.findById(memberId);
        if(!member){
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Member not found' });
        }
        if(member.membershipType === 'premium'){
            return res.status(StatusCodes.CONFLICT).json({ message: 'Member is already at the highest membership level' });
        }
        member.membershipType = 'premium';
        await member.save();

        res.status(StatusCodes.OK).json({ message: 'Membership upgraded to premium', member})
    }catch (error){
        console.error("Error updating membership", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Server error"});
    }
}
