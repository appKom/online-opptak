import { NextApiResponse } from "next";

export const isAdmin = (res: NextApiResponse, session: any) => {
  if (session.user?.role !== "admin") {
    res.status(403).json({ error: "Access denied, unauthorized" });
    return false;
  }
  return true;
};

export const hasSession = (res: NextApiResponse, session: any) => {
  if (!session) {
    res.status(403).json({ error: "Access denied, no session" });
    return false;
  }
  return true;
};

export const checkOwId = (res: NextApiResponse, session: any, id: string) => {
  if (session?.user?.owId !== id) {
    res.status(403).json({ error: "Access denied, unauthorized" });
    return false;
  }
  return true;
};

export const isInCommitee = (res: NextApiResponse, session: any) => {
  if (!session?.user?.isCommitee) {
    res.status(403).json({ error: "Access denied, unauthorized" });
    return false;
  }
  return true;
};
