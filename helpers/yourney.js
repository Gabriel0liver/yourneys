'use strict';

const didUserAddYourney = (user, yourney) => {
  const item = yourney.addedBy.find((item) => {
    return item._id.equals(user._id);
  });
  return !!item;
};

module.exports = {
  didUserAddYourney
};
