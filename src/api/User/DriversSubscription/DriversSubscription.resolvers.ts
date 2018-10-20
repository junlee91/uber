const resolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: (_, __, { pubSub }) => {
        return pubSub.asyncIterator("driverUpdate");  // listen to this channel
      }
    }
  }
};

export default resolvers;
