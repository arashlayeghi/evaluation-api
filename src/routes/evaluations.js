const express = require("express");
const { body } = require("express-validator");
const evaluationController = require("../controllers/evaluationController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Evaluation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         score:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedEvaluations:
 *       type: object
 *       properties:
 *         evaluations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Evaluation'
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *             totalPages:
 *               type: integer
 *             totalItems:
 *               type: integer
 *             itemsPerPage:
 *               type: integer
 */

const validateEvaluation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().trim(),
  body("score").optional().isFloat({ min: 0, max: 100 }),
  body("status").optional().isIn(["pending", "in_progress", "completed"]),
];

/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Create a new evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               score:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *     responses:
 *       201:
 *         description: Evaluation created
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, validateEvaluation, evaluationController.create);

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Get all evaluations (paginated)
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of evaluations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedEvaluations'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, evaluationController.getAll);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   get:
 *     summary: Get evaluation by ID
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evaluation found
 *       404:
 *         description: Evaluation not found
 */
router.get("/:id", authenticate, evaluationController.getById);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   put:
 *     summary: Update evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               score:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evaluation updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Evaluation not found
 */
router.put(
  "/:id",
  authenticate,
  validateEvaluation,
  evaluationController.update
);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   delete:
 *     summary: Delete evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evaluation deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: Evaluation not found
 */
router.delete("/:id", authenticate, evaluationController.delete);

module.exports = router;
