import { withFilter } from "graphql-yoga";

import Chat from "../../../entities/Chat";
import User from "../../../entities/User";

const resolvers = {
  Subscription: {
    MessageSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("newChatMessage"); // subscribe to newChatMessage channel
        },
        async (payload, _, { context }) => {
          const user: User = context.currentUser;
          // payload is a Message which has a associated chatId
          const {
            MessageSubscription: { chatId }
          } = payload;

          try {
            const chat = await Chat.findOne({ id: chatId });
            if (chat) {
              // notify driver and passenger of this message
              return chat.driverId === user.id || chat.passengerId === user.id;
            } else {
              return false;
            }
          } catch (error) {
            return false;
          }
        }
      )
    }
  }
};

export default resolvers;
