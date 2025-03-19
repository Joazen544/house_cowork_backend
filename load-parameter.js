const AWS = require('aws-sdk');
const fs = require('fs');

const ssm = new AWS.SSM({
  region: 'ap-northeast-1',
});

async function loadParameter(name) {
  try {
    const prefix = '/house-cowork/';
    const params = {
      Name: prefix + name,
      WithDecryption: true,
    };
    const data = await ssm.getParameter(params).promise();
    return data.Parameter.Value;
  } catch (error) {
    console.error(`Error reading parameter: ${name}`, error);
    throw error;
  }
}

async function loadEnv() {
  try {
    if (fs.existsSync('.env.production')) {
      fs.unlinkSync('.env.production');
    }

    const databaseType = await loadParameter('database-type');
    const databaseHost = await loadParameter('database-host');
    const databaseName = await loadParameter('database-name');
    const databaseUsername = await loadParameter('database-username');
    const databasePassword = await loadParameter('database-password');
    const jwtSecret = await loadParameter('jwt-secret');
    const avatarsBucket = await loadParameter('avatars-bucket');

    fs.appendFileSync(
      '.env.production',
      `
      DATABASE_TYPE=${databaseType}\n
      DATABASE_NAME=${databaseName}\n
      DATABASE_HOST=${databaseHost}\n
      DATABASE_PORT=5432\n
      DATABASE_USERNAME=${databaseUsername}\n
      DATABASE_PASSWORD=${databasePassword}\n
      DATABASE_SSL=true\n
      JWT_SECRET=${jwtSecret}\n
      AWS_REGION=ap-northeast-1\n
      AVATARS_BUCKET=${avatarsBucket}
    `,
    );

    console.log('Environment variables loaded and .env file created successfully.');
  } catch (error) {
    console.error('Error loading environment variables', error);
    process.exit(1);
  }
}

loadEnv();
