import Verification from "../../../entities/Verification";
import { Resolvers } from "../../../types/resolvers";
import {
  StartPhoneVerfificationMutationArgs,
  StartPhoneVerfificationResponse
} from "../../../types/graph";
import { sendVerificationSMS } from "../../../utils/sendSMS";

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
        await sendVerificationSMS(
          new_Verification.payload,
          new_Verification.key
        );
        return {
          ok: true,
          error: null
        };
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
