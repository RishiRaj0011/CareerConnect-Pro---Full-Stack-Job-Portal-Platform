/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job applications — apply, track, and manage
 */

/**
 * @swagger
 * /application/apply/{id}:
 *   get:
 *     summary: Apply for a job (student only)
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job ID to apply for
 *         schema:
 *           type: string
 *         example: 64f1a2b3c4d5e6f7a8b9c0d3
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Job not found
 *       409:
 *         description: Already applied for this job
 */

/**
 * @swagger
 * /application/get:
 *   get:
 *     summary: Get all jobs the authenticated student has applied to (paginated)
 *     tags: [Applications]
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
 *         description: List of applications with job and company details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /application/{id}/applicants:
 *   get:
 *     summary: Get all applicants for a specific job (recruiter only, paginated)
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Paginated list of applicants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 job:
 *                   type: object
 *                   properties:
 *                     _id:   { type: string }
 *                     title: { type: string }
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /application/status/{id}/update:
 *   post:
 *     summary: Update application status (recruiter only)
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected]
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error — invalid status value
 *       404:
 *         description: Application not found
 */
