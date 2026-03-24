/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration, login, logout and profile management
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [fullname, email, phoneNumber, password, role, file]
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Secret@123"
 *                 description: Min 8 chars, 1 uppercase, 1 number, 1 special character
 *               role:
 *                 type: string
 *                 enum: [student, recruiter]
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo (image/*)
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error or missing file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       502:
 *         description: Cloudinary upload failed
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login and receive an httpOnly session cookie
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Secret@123"
 *               role:
 *                 type: string
 *                 enum: [student, recruiter]
 *     responses:
 *       200:
 *         description: Login successful — token set as httpOnly cookie
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=eyJhbGc...; HttpOnly; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Welcome back John Doe" }
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Incorrect email or password
 *       403:
 *         description: Role mismatch
 */

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout — clears the session cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */

/**
 * @swagger
 * /user/profile/update:
 *   post:
 *     summary: Update authenticated user's profile
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               bio:
 *                 type: string
 *                 maxLength: 300
 *               skills:
 *                 type: string
 *                 description: Comma-separated list e.g. "React,Node.js,MongoDB"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Resume PDF (application/pdf)
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 */
