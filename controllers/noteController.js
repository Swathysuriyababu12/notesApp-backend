const asyncHandler = require("express-async-handler");

const Note = require("../models/noteModel");
const User = require("../models/userModel");

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id });

  res.status(200).send(notes);
});

const createNote = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add text fields");
  }

  const { title, desc, text } = req.body;
  const note = await Note.create({
    title,
    desc,
    text,
    user: req.user.id,
  });

  res.status(201).send(note);
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error("Note not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User Not Found");
  }

  // Make sure the logged in user matches notes user
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User Not Authorized");
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).send(updatedNote);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error("Note not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User Not Found");
  }

  // Make sure the logged in user matches notes user
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User Not Authorized");
  }

  const deletedNote = await Note.deleteOne({ _id: req.params.id });

  res.status(200).send({ id: req.params.id });
});

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
