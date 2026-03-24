/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listings — browse, search, and recruiter management
 */

/**
 * @swagger
 * /job/post:
 *   post:
 *     summary: Post a new job (recruiter only)
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, requirements, salary, location, jobType, experience, position, companyId]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Senior React Developer
 *               description:
 *                 type: string
 *                 example: Build scalable frontend applications
 *               requirements:
 *                 type: string
 *                 example: "React,TypeScript,Node.js"
 *                 description: Comma-separated list of required skills
 *               salary:
 *                 type: number
 *                 example: 1200000
 *               location:
 *                 type: string
 *                 example: Bangalore
 *               jobType:
 *                 type: string
 *                 enum: [Full-Time, Part-Time, Contract, Internship, Remote]
 *               experience:
 *                 type: number
 *                 example: 3
 *                 description: Minimum years of experience required
 *               position:
 *                 type: number
 *                 example: 2
 *                 description: Number of open positions
 *               companyId:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d2
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /job/get:
 *   get:
 *     summary: Get all jobs with optional search and pagination
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Full-text search on title and description
 *         example: react developer
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location (case-insensitive partial match)
 *         example: Bangalore
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [Full-Time, Part-Time, Contract, Internship, Remote]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Paginated list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 */

/**
 * @swagger
 * /job/get/{id}:
 *   get:
 *     summary: Get a single job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d3
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /job/getadminjobs:
 *   get:
 *     summary: Get all jobs posted by the authenticated recruiter (paginated)
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Recruiter's job listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Not authenticated
 */
