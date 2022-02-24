module.exports = ({ validator, middlewares, handler }) => {
  return async (parent, data, ctx) => {
    let refined = {...data};
    try {
      if (validator) {
        refined = new validator().check(refined);
      }

      // refined.user = ctx.user;
      if (middlewares && middlewares.length) {
        for (const wares of middlewares) {
          await wares(parent, refined, ctx);
        }
      }
      refined.user = ctx.user;
      const result = await handler(
        refined,
        ctx,
        parent,
      );
      return result;
    } catch (err) {
      throw err;
    }
  };
};
