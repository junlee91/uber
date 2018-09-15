import Verification from "../../../entities/Verification";
import { Resolvers } from "../../../types/resolvers";
import {
  StartPhoneVerfificationMutationArgs,
  StartPhoneVerfificationResponse
} from "../../../types/graph";

const resolvers: Resolvers = {
  Mutation: {
    StartPhoneVerfification: async (
      _,
      args: StartPhoneVerfificationMutationArgs
    ): Promise<StartPhoneVerfificationResponse> => {
      const { phoneNumber } = args;
      try {
        const existing_Verification = await Verification.findOne({
          payload: phoneNumber
        });
        if (existing_Verification) {
          existing_Verification.remove();
        }
        const new_Verification = await Verification.create({
          payload: phoneNumber,
          target: "PHONE"
        }).save();
        // TODO: Send SMS

      } catch (error) {
        return {
          ok: false,
          error: error.message
        };
      }
    }
  }
};

export default resolvers;
