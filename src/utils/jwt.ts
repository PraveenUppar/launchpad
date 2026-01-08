import jwt from 'jsonwebtoken';

const generateToken = (userId: string) => {
  const payload = { id: userId };
  const secret = '09c7n0we987w0c89rcq8wnrqw8np8qw7ce8qn7wrpc8qc';
  const token = jwt.sign(payload, secret, {
    expiresIn: '1h',
  });
  return token;
};

export { generateToken };
