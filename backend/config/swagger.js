const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SpotIT API',
      version: '1.0.0',
      description: 'SpotIT - Waste Reporting Platform API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            totalPoints: { type: 'number' },
            totalReports: { type: 'number' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Report: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            image: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                publicId: { type: 'string' },
              },
            },
            location: {
              type: 'object',
              properties: {
                address: { type: 'string' },
                coordinates: {
                  type: 'object',
                  properties: {
                    lat: { type: 'number' },
                    lng: { type: 'number' },
                  },
                },
              },
            },
            description: { type: 'string' },
            status: {
              type: 'string',
              enum: ['pending', 'assigned', 'inprogress', 'cleared'],
            },
            assignedWorker: {
              type: 'object',
              properties: {
                workerId: { type: 'string' },
                name: { type: 'string' },
                phone: { type: 'string' },
                area: { type: 'string' },
                assignedAt: { type: 'string', format: 'date-time' },
              },
            },
            pointsAwarded: { type: 'number' },
            adminNote: { type: 'string' },
            clearedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Worker: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Ramesh Kumar' },
            phone: { type: 'string', example: '9876543210' },
            area: { type: 'string', example: 'Anand City' },
            isAvailable: { type: 'boolean', example: true },
            totalAssigned: { type: 'number', example: 5 },
            totalCleared: { type: 'number', example: 3 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Reward: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            type: {
              type: 'string',
              enum: ['gift_voucher', 'cashback', 'certificate'],
            },
            pointsRequired: { type: 'number' },
            isActive: { type: 'boolean' },
          },
        },
        Redemption: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            reward: { type: 'string' },
            pointsUsed: { type: 'number' },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Query: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            category: {
              type: 'string',
              enum: ['report_issue', 'reward_issue', 'general'],
            },
            subject: { type: 'string' },
            status: {
              type: 'string',
              enum: ['open', 'replied', 'closed'],
            },
            messages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sender: { type: 'string', enum: ['user', 'admin'] },
                  text: { type: 'string' },
                  attachment: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;