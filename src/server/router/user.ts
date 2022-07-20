import { createRouter } from "./context";
import { z } from "zod";
import GD, { User } from "gd.js";

export const userRouter = createRouter().query("get", {
  input: z.object({
    user: z.string(),
  }),
  async resolve({ input }) {
    const gd = new GD({});
    const preuserdata: User = await gd.users.getByUsername(input.user);

    console.log();
    return {
      userdata: {
        username: preuserdata.username,
        id: preuserdata.id,
        accountID: preuserdata.accountID,
        stats: preuserdata.stats,
        permissions: preuserdata.permissions,
      },
    };
  },
});
