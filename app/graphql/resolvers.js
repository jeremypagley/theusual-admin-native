import gql from 'graphql-tag';

export default {
  Query: {
    order(_, args, { cache }, info) {
      const query = gql`
        query GetOrder {
          order @client {
            products {
              _id,
              title,
              price,
              modifiers {
                title,
                price
              }
            }
          }
        }
      `;

      const order = cache.readQuery({ query });

      return order;
    },
  },

  Mutation: {
    // addOrderItem: (_, { product }, { cache }) => {
    //   const query = gql`
    //   {
    //     order {
    //       __typename,
    //       products {
    //         __typename,
    //         _id,
    //         title,
    //         price,
    //         modifiers {
    //           __typename,
    //           title,
    //           price
    //         }
    //       }
    //     }
    //   }
    //   `;

    //   product.__typename = "LocalProduct";

    //   let prevState = cache.readQuery({ query });

    //   prevState.order.products.push(product);
    //   const data = prevState;

    //   cache.writeData({ query, data });
    //   return null;
    // },

    removeOrderItem: (_, { id }, { cache }) => {
      const query = gql`
      {
        order {
          __typename,
          products {
            __typename,
            _id,
            title,
            price,
            modifiers {
              __typename,
              title,
              price
            }
          }
        }
      }
      `;

      product.__typename = "LocalProduct";

      // Cant do it this way as if they order the same product multiple times with different modifiers...
      /**
       * Order {
       *  user: userThatOrdered
       *  // Order items would get created in db and then OrderStatus would retrieve them, on confirm order it would pass the order id
       *  // and send that to the store
       *  OrderItems [
       *    // item is like a product
       *    {_id: title, combinedPrice}
       *  ]
       * }
       */

      let prevState = cache.readQuery({ query });
      let { products } = prevState.order;
      prevState.order.products = products.filter(prod => prod._id !== id);

      const data = prevState;

      console.log('prevState: ', prevState)

      cache.writeData({ query, data });
      return null;
    },
  },

}