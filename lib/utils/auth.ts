const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

export const isAdminUser = (email: string) => {
  return adminEmails.includes(email);
};
