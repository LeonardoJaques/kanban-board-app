const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

// Security headers
app.use(helmet());

// CORS - restrict to frontend origin
app.use(cors({ origin: ALLOWED_ORIGIN }));

// Rate limiting - 200 req/min per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(bodyParser.json({ limit: '1mb' }));

// Helpers
function sendError(res, status, message) {
  res.status(status).json({ error: message });
}

function isValidId(id) {
  return typeof id === 'string' && uuidValidate(id);
}

function validateBoardBody(body) {
  if (!body || typeof body !== 'object') return 'Request body must be an object.';
  if (body.name !== undefined && typeof body.name !== 'string') return '"name" must be a string.';
  if (body.name !== undefined && body.name.length > 200) return '"name" is too long.';
  return null;
}

function validateRecordBody(body) {
  if (!body || typeof body !== 'object') return 'Request body must be an object.';
  if (body.boardId !== undefined && !isValidId(body.boardId)) return '"boardId" must be a valid UUID.';
  return null;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// All data (for initial load)
app.get('/api/all', async (req, res) => {
  try {
    const [boards, records] = await Promise.all([
      prisma.board.findMany(),
      prisma.record.findMany(),
    ]);
    const result = [
      ...boards.map(b => ({ ...b.data, _id: b.id, name: b.name })),
      ...records.map(r => ({ ...r.data, _id: r.id, boardId: r.boardId })),
    ];
    res.json(result);
  } catch {
    sendError(res, 500, 'Failed to fetch data.');
  }
});

// Boards
app.get('/api/boards', async (req, res) => {
  try {
    const boards = await prisma.board.findMany();
    res.json(boards.map(b => ({ ...b.data, _id: b.id, name: b.name })));
  } catch {
    sendError(res, 500, 'Failed to fetch boards.');
  }
});

app.get('/api/boards/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return sendError(res, 400, 'Invalid board ID.');
  try {
    const board = await prisma.board.findUnique({ where: { id: req.params.id } });
    if (!board) return sendError(res, 404, 'Board not found.');
    res.json(board);
  } catch {
    sendError(res, 500, 'Failed to fetch board.');
  }
});

app.post('/api/boards', async (req, res) => {
  const validationError = validateBoardBody(req.body);
  if (validationError) return sendError(res, 400, validationError);

  const { _id, name, ...data } = req.body;

  if (_id && !isValidId(_id)) return sendError(res, 400, 'Invalid board ID format.');

  const id = _id || uuidv4();
  try {
    const board = await prisma.board.upsert({
      where: { id },
      update: { name, data },
      create: { id, name, data },
    });
    res.json(board);
  } catch {
    sendError(res, 500, 'Failed to save board.');
  }
});

app.delete('/api/boards/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return sendError(res, 400, 'Invalid board ID.');
  try {
    await prisma.board.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return sendError(res, 404, 'Board not found.');
    sendError(res, 500, 'Failed to delete board.');
  }
});

// Records
app.get('/api/records/:boardId', async (req, res) => {
  if (!isValidId(req.params.boardId)) return sendError(res, 400, 'Invalid board ID.');
  try {
    const records = await prisma.record.findMany({
      where: { boardId: req.params.boardId },
    });
    res.json(records.map(r => ({ ...r.data, _id: r.id, boardId: r.boardId })));
  } catch {
    sendError(res, 500, 'Failed to fetch records.');
  }
});

app.post('/api/records', async (req, res) => {
  const validationError = validateRecordBody(req.body);
  if (validationError) return sendError(res, 400, validationError);

  const { _id, boardId, ...data } = req.body;

  if (_id && !isValidId(_id)) return sendError(res, 400, 'Invalid record ID format.');
  if (!boardId) return sendError(res, 400, '"boardId" is required.');

  const id = _id || uuidv4();
  try {
    const record = await prisma.record.upsert({
      where: { id },
      update: { data, boardId },
      create: { id, boardId, data },
    });
    res.json(record);
  } catch {
    sendError(res, 500, 'Failed to save record.');
  }
});

app.delete('/api/records/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return sendError(res, 400, 'Invalid record ID.');
  try {
    await prisma.record.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return sendError(res, 404, 'Record not found.');
    sendError(res, 500, 'Failed to delete record.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
