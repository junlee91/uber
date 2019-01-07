import Chat from "../../../entities/Chat";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req, pubSub }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === "ACCEPTED") {
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  status: "REQUESTING"
                },
                { relations: ["passenger", "driver"] } // ride will be loaded with Passenger instance
              );
              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();

                // Driver accepted request, create a chat room
                const chat = await Chat.create({
                  driver: user,
                  passenger: ride.passenger
                }).save();

                // Chat and Ride have one to one relation
                ride.chat = chat;
                ride.save();
              }
            } else {
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  driver: user
                },
                { relations: ["passenger", "driver"] }
              );
            }
            if (ride) {
              ride.status = args.status;
              ride.save();
              pubSub.publish("rideUpdate", { RideStatusSubscription: ride });

              if (args.status === "FINISHED") {
                const driver = ride.driver;
                const passenger = ride.passenger;

                driver.isTaken = false;
                passenger.isRiding = false;

                driver.save();
                passenger.save();
              }

              return {
                ok: true,
                error: null,
                rideId: ride.id
              };
            } else {
              return {
                ok: false,
                error: "Cant update ride",
                rideId: null
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rideId: null
            };
          }
        } else {
          return {
            ok: false,
            error: "You are not driving",
            rideId: null
          };
        }
      }
    )
  }
};
export default resolvers;
