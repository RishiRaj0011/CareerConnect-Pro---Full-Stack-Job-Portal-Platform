/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company registration and management (recruiter only)
 */

/**
 * @swagger
 * /company/register:
 *   post:
 *     summary: Register a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyName]
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: Acme Corp
 *     responses:
 *       201:
 *         description: Company registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: Company name already registered
 */

/**
 * @swagger
 * /company/get:
 *   get:
 *     summary: Get all companies owned by the authenticated recruiter
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 companies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /company/get/{id}:
 *   get:
 *     summary: Get a single company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d2
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /company/update/{id}:
 *   put:
 *     summary: Update company details and optionally upload a new logo
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: https://acme.com
 *               location:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Company logo (image/*)
 *     responses:
 *       200:
 *         description: Company updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Company not found
 *       502:
 *         description: Logo upload failed
 */
