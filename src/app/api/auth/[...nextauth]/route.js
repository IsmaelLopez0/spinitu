import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/libs/prisma';

export const authOptions = {
  site: process.env.NEXTAUTH_URL,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'Email', type: 'text', placeholder: 'email@domain.com' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '********',
        },
      },
      async authorize(credentials, req) {
        const userFound = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!userFound) throw new Error('No user found');
        if (!userFound.isActive) throw new Error('Inactive user');
        const matchPassword = await bcrypt.compare(
          credentials.password,
          userFound.password,
        );
        if (!matchPassword) throw new Error('Wrong password');
        return { ...userFound };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
