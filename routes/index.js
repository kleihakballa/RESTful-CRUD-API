const express = require('express');
const router = express.Router();

const {Student} = require('../model/students');

// Retrieve data
router.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();  
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



router.get('/api/students/:id', async (req, res) => {
    try {

        const student = await Student.findById(req.params.id);
        
        if (student) {
            res.json(student);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (error) {
        console.error('Error retrieving student:', error); 
        res.status(500).send('Server error');
    }
});

router.get('/api/students/name/:name', async (req, res) => {
    try {
        const student = await Student.findOne({ name: req.params.name });
        
        if (student) {
            res.json(student);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (error) {
        console.error('Error retrieving student by name:', error);
        res.status(500).send('Server error');
    }
});


//Save data
router.post('/api/students/add', async (req, res) => {
    try {
       
        const stu = new Student({
            name: req.body.name,
            age: req.body.age 
        });

        
        const data = await stu.save(); 

       
        res.status(200).json({
            code: 200,
            message: 'Student saved',
            addStudent: data
        });
    } catch (error) {
        console.error('Error saving student:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


//Update data
router.put("/api/students/edit/:id", async (req, res) => {
    try {
       
        const stu = {
            name: req.body.name,
            age: req.body.age 
        };

        const student = await Student.findByIdAndUpdate(
            req.params.id,        
            { $set: stu },       
            { new: true }         
        );

        if (student) {
            res.status(200).json({
                code: 200,
                message: 'Student Updated',
                updateStudent: student
            });
        } else {
            res.status(404).json({
                code: 404,
                message: 'Student not found'
            });
        }
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).json({
            code: 500,
            message: 'Server error'
        });
    }
});


//Delete data
router.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (student) {
            res.status(200).json({
                code: 200,
                message: 'Student Deleted',
                deleteStudent: student
            });
        } else {
            res.status(404).json({
                code: 404,
                message: 'Student not found'
            });
        }
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({
            code: 500,
            message: 'Server error'
        });
    }
});

module.exports = router;