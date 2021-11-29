const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const serverMessage = { welcome: "Welcome to Caj's Cool Chatroom", goodbye: "Thanks for visiting!"}
const messageArr = [];

const resolvers = {
  Query: {
    serverMessages: () => (serverMessage),
    messages: () => messageArr,
  },
  Mutation: {
    sendMessage: (_, args) => {
      messageArr.push(args)
      pubsub.publish('NEW_MESSAGE', { newMessage: args })
      return args
    }
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE']),
    },
  },
}

module.exports = resolvers;