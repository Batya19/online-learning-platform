module.exports = (db) => {
const express = require('express');
const { checkAuth, checkTeacher } = require('../middlewares/auth')(db);
const Course = require('../models/Course');

  const router = express.Router();
  const courseModel = Course(db);

  // Get all courses
  router.get('/', checkAuth, async (req, res) => {
    courseModel.findAll((err, courses) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching courses' });
      }
      res.status(200).json(courses);
    });
  });

  // Get course by ID
  router.get('/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    courseModel.findById(id, (err, course) => {
      if (err || !course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(course);
    });
  });

  // Create new course (Teacher only)
  router.post('/', checkAuth, checkTeacher, async (req, res) => {
    const { title, description } = req.body;
    const teacherId = req.userId;
    courseModel.create(title, description, teacherId, (err, courseId) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating course' });
      }
      res.status(201).json({ message: 'Course created successfully', courseId });
    });
  });

  // Update course by ID (Teacher only)
  router.put('/:id', checkAuth, checkTeacher, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    courseModel.updateById(id, updates, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating course' });
      }
      res.status(200).json({ message: 'Course updated successfully' });
    });
  });

  // Delete course by ID (Teacher only)
  router.delete('/:id', checkAuth, checkTeacher, async (req, res) => {
    const { id } = req.params;
    courseModel.deleteById(id, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting course' });
      }
      res.status(200).json({ message: 'Course deleted successfully' });
    });
  });

  return router;
};