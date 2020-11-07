export const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  console.info('------------[ development mode ]-----------')
}