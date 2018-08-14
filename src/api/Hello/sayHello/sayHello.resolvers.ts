import { Greeting } from "../../../types/graph";

const resolvers = {
  Query: {
    sayHello: (): Greeting => {
      return {
        error: false,
        text: "coool ya"
      };
    }
  }
};

export default resolvers;
