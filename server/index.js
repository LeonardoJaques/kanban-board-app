const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// All data (for initial load)
app.get('/api/all', async (req, res) => {
  try {
    const boards = await prisma.board.findMany();
    const records = await prisma.record.findMany();
    const result = [
      ...boards.map(b => ({ ...b.data, _id: b.id, name: b.name })),
      ...records.map(r => ({ ...r.data, _id: r.id, boardId: r.boardId }))
    ];
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Boards
app.get('/api/boards', async (req, res) => {
  try {
    const boards = await prisma.board.findMany();
    res.json(boards.map(b => ({
      ...b.data,
      _id: b.id,
      name: b.name
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/boards/:id', async (req, res) => {
  try {
    const board = await prisma.board.findUnique({ where: { id: req.params.id } });
    if (!board) return res.status(404).json({ error: 'Not found' });
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const { v4: uuidv4 } = require('uuid');

app.post('/api/boards', async (req, res) => {
  const { _id, name, ...data } = req.body;
  const id = _id || uuidv4();
  console.log('Saving board:', { id, name });
  try {
    const board = await prisma.board.upsert({
      where: { id },
      update: { name, data },
      create: { id, name, data }
    });
    res.json(board);
  } catch (error) {
    console.error('Error saving board:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/boards/:id', async (req, res) => {
  try {
    await prisma.board.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: error.message });
  }
});

// Records
app.get('/api/records/:boardId', async (req, res) => {
  try {
    const records = await prisma.record.findMany({
      where: { boardId: req.params.boardId }
    });
    res.json(records.map(r => ({
      ...r.data,
      _id: r.id,
      boardId: r.boardId
    })));
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/records', async (req, res) => {
  const { _id, boardId, ...data } = req.body;
  const id = _id || uuidv4();
  console.log('Saving record:', { id, boardId });
  try {
    const record = await prisma.record.upsert({
      where: { id },
      update: { data, boardId },
      create: { id, boardId, data }
    });
    res.json(record);
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/records/:id', async (req, res) => {
  try {
    await prisma.record.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
